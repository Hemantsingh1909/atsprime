"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  email: string;
  name?: string;
}

export interface SavedResume {
  id: string;
  jobTitle: string;
  originalText: string;
  tailoredText: string;
  score: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  savedResumes: SavedResume[];
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  saveResume: (jobTitle: string, originalText: string, tailoredText: string, score: number) => Promise<SavedResume>;
  deleteResume: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);

  // Check for active session on mount
  useEffect(() => {
    try {
      const activeSession = localStorage.getItem("atsprime_session");
      if (activeSession) {
        const parsedUser = JSON.parse(activeSession) as User;
        setUser(parsedUser);
        
        // Load user's saved resumes
        const userResumes = localStorage.getItem(`atsprime_resumes_${parsedUser.email}`);
        if (userResumes) {
          setSavedResumes(JSON.parse(userResumes) as SavedResume[]);
        }
      }
    } catch (error) {
      console.error("Error reading session from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Monitor user changes to load/clear resumes
  useEffect(() => {
    if (user) {
      const userResumes = localStorage.getItem(`atsprime_resumes_${user.email}`);
      if (userResumes) {
        setSavedResumes(JSON.parse(userResumes) as SavedResume[]);
      } else {
        setSavedResumes([]);
      }
    } else {
      setSavedResumes([]);
    }
  }, [user]);

  // Dynamic Signup
  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const emailTrim = email.trim().toLowerCase();
      if (!emailTrim || !password) {
        return { success: false, error: "Email and password are required." };
      }

      // Check if user already exists
      const usersStr = localStorage.getItem("atsprime_users") || "[]";
      const users = JSON.parse(usersStr) as { email: string; password: string }[];
      
      const userExists = users.some((u) => u.email === emailTrim);
      if (userExists) {
        return { success: false, error: "An account with this email already exists." };
      }

      // Save user record
      users.push({ email: emailTrim, password });
      localStorage.setItem("atsprime_users", JSON.stringify(users));

      // Sign user in automatically
      const newUser: User = { email: emailTrim, name: emailTrim.split("@")[0] };
      localStorage.setItem("atsprime_session", JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (err) {
      return { success: false, error: "An unexpected error occurred during sign-up." };
    }
  };

  // Dynamic Signin
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const emailTrim = email.trim().toLowerCase();
      if (!emailTrim || !password) {
        return { success: false, error: "Email and password are required." };
      }

      const usersStr = localStorage.getItem("atsprime_users") || "[]";
      const users = JSON.parse(usersStr) as { email: string; password: string }[];
      
      const matchedUser = users.find((u) => u.email === emailTrim && u.password === password);
      if (!matchedUser) {
        return { success: false, error: "Invalid email or password." };
      }

      // Sign user in
      const activeUser: User = { email: emailTrim, name: emailTrim.split("@")[0] };
      localStorage.setItem("atsprime_session", JSON.stringify(activeUser));
      setUser(activeUser);

      return { success: true };
    } catch (err) {
      return { success: false, error: "An unexpected error occurred during sign-in." };
    }
  };

  // Signout
  const signOut = () => {
    localStorage.removeItem("atsprime_session");
    setUser(null);
    setSavedResumes([]);
  };

  // Save tailored resume under user profile
  const saveResume = async (
    jobTitle: string,
    originalText: string,
    tailoredText: string,
    score: number
  ): Promise<SavedResume> => {
    if (!user) {
      throw new Error("Must be logged in to save resumes.");
    }

    const newResume: SavedResume = {
      id: Math.random().toString(36).substring(2, 11),
      jobTitle: jobTitle || "Tailored Role Profile",
      originalText,
      tailoredText,
      score,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedResumes = [newResume, ...savedResumes];
    setSavedResumes(updatedResumes);
    localStorage.setItem(`atsprime_resumes_${user.email}`, JSON.stringify(updatedResumes));

    return newResume;
  };

  // Delete saved resume
  const deleteResume = (id: string) => {
    if (!user) return;
    
    const updatedResumes = savedResumes.filter((r) => r.id !== id);
    setSavedResumes(updatedResumes);
    localStorage.setItem(`atsprime_resumes_${user.email}`, JSON.stringify(updatedResumes));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        savedResumes,
        loading,
        signUp,
        signIn,
        signOut,
        saveResume,
        deleteResume,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
