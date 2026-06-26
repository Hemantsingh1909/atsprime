"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabase";

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
  optimizedDataString?: string;
}

interface AuthContextType {
  user: User | null;
  savedResumes: SavedResume[];
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  saveResume: (jobTitle: string, originalText: string, tailoredText: string, score: number, optimizedDataString?: string) => Promise<SavedResume>;
  deleteResume: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  // Helper to format Date string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 1. Initial Session Loader & Auth Listener
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const forceMock = searchParams.get("mock_auth") === "true";
    const configured = isSupabaseConfigured && !forceMock;
    setUseSupabase(configured);

    if (configured) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          });
        }
        setLoading(false);
      });

      // Listen to auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          });
        } else {
          setUser(null);
          setSavedResumes([]);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Fallback: LocalStorage Session
      try {
        const activeSession = localStorage.getItem("atsprime_session");
        if (activeSession) {
          const parsedUser = JSON.parse(activeSession) as User;
          setUser(parsedUser);
          
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
    }
  }, []);

  // 2. Fetch resumes from DB when user is logged in
  useEffect(() => {
    if (!user) {
      setSavedResumes([]);
      return;
    }

    if (useSupabase) {
      const fetchResumes = async () => {
        const { data, error } = await supabase
          .from("saved_resumes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching resumes from Supabase:", error.message);
          return;
        }

        if (data) {
          const formattedResumes: SavedResume[] = data.map((row: any) => ({
            id: row.id,
            jobTitle: row.job_title,
            originalText: row.original_text,
            tailoredText: row.tailored_text,
            score: row.score,
            optimizedDataString: row.optimized_data_string,
            createdAt: formatDate(row.created_at),
          }));
          setSavedResumes(formattedResumes);
        }
      };

      fetchResumes();
    } else {
      // Fallback: Fetch resumes from localStorage
      const userResumes = localStorage.getItem(`atsprime_resumes_${user.email}`);
      if (userResumes) {
        setSavedResumes(JSON.parse(userResumes) as SavedResume[]);
      } else {
        setSavedResumes([]);
      }
    }
  }, [user, useSupabase]);

  // Dynamic Signup
  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: "An error occurred during sign-up." };
      }
    } else {
      // Fallback: LocalStorage Signup
      try {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const emailTrim = email.trim().toLowerCase();
        if (!emailTrim || !password) {
          return { success: false, error: "Email and password are required." };
        }

        const usersStr = localStorage.getItem("atsprime_users") || "[]";
        const users = JSON.parse(usersStr) as { email: string; password: string }[];
        
        const userExists = users.some((u) => u.email === emailTrim);
        if (userExists) {
          return { success: false, error: "An account with this email already exists." };
        }

        users.push({ email: emailTrim, password });
        localStorage.setItem("atsprime_users", JSON.stringify(users));

        const newUser: User = { email: emailTrim, name: emailTrim.split("@")[0] };
        localStorage.setItem("atsprime_session", JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
      } catch (err) {
        return { success: false, error: "An unexpected error occurred during sign-up." };
      }
    }
  };

  // Dynamic Signin
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: "An error occurred during sign-in." };
      }
    } else {
      // Fallback: LocalStorage Signin
      try {
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

        const activeUser: User = { email: emailTrim, name: emailTrim.split("@")[0] };
        localStorage.setItem("atsprime_session", JSON.stringify(activeUser));
        setUser(activeUser);

        return { success: true };
      } catch (err) {
        return { success: false, error: "An unexpected error occurred during sign-in." };
      }
    }
  };

  // Signout
  const signOut = async () => {
    if (useSupabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("atsprime_session");
      setUser(null);
      setSavedResumes([]);
    }
  };

  // Save tailored resume under user profile
  const saveResume = async (
    jobTitle: string,
    originalText: string,
    tailoredText: string,
    score: number,
    optimizedDataString?: string
  ): Promise<SavedResume> => {
    if (!user) {
      throw new Error("Must be logged in to save resumes.");
    }

    if (useSupabase) {
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser) {
        throw new Error("Supabase session user not found.");
      }

      const { data, error } = await supabase
        .from("saved_resumes")
        .insert({
          user_id: sbUser.id,
          job_title: jobTitle || "Tailored Role Profile",
          original_text: originalText,
          tailored_text: tailoredText,
          score: score,
          optimized_data_string: optimizedDataString,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save resume to Supabase: ${error.message}`);
      }

      const newResume: SavedResume = {
        id: data.id,
        jobTitle: data.job_title,
        originalText: data.original_text,
        tailoredText: data.tailored_text,
        score: data.score,
        optimizedDataString: data.optimized_data_string,
        createdAt: formatDate(data.created_at),
      };

      setSavedResumes((prev) => [newResume, ...prev]);
      return newResume;
    } else {
      // Fallback: LocalStorage Save
      const newResume: SavedResume = {
        id: Math.random().toString(36).substring(2, 11),
        jobTitle: jobTitle || "Tailored Role Profile",
        originalText,
        tailoredText,
        score,
        optimizedDataString,
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
    }
  };

  // Delete saved resume
  const deleteResume = async (id: string) => {
    if (!user) return;
    
    if (useSupabase) {
      const { error } = await supabase
        .from("saved_resumes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Failed to delete resume from Supabase:", error.message);
        return;
      }

      setSavedResumes((prev) => prev.filter((r) => r.id !== id));
    } else {
      // Fallback: LocalStorage Delete
      const updatedResumes = savedResumes.filter((r) => r.id !== id);
      setSavedResumes(updatedResumes);
      localStorage.setItem(`atsprime_resumes_${user.email}`, JSON.stringify(updatedResumes));
    }
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
