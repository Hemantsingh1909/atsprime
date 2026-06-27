"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabase";

export interface User {
  email: string;
  name?: string;
  avatarUrl?: string;
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
  useSupabase: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  saveResume: (jobTitle: string, originalText: string, tailoredText: string, score: number, optimizedDataString?: string) => Promise<SavedResume>;
  deleteResume: (id: string) => void;
  updateProfile: (name: string, avatarUrl?: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  resendSignupOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
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
      // Synchronous guest loader bypass: if no active session storage tokens exist, resolve loading immediately
      const hasSession = typeof window !== "undefined" && (() => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("sb-") || key === "atsprime_session")) {
            return true;
          }
        }
        return false;
      })();

      if (!hasSession) {
        setLoading(false);
      }

      const loadProfileAndSetUser = async (sessionUser: any) => {
        let name = sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email?.split("@")[0] || "";
        let avatarUrl = sessionUser.user_metadata?.avatar_url || undefined;

        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("name, avatar_url")
            .eq("id", sessionUser.id)
            .maybeSingle();
          if (data) {
            if (data.name) name = data.name;
            if (data.avatar_url) avatarUrl = data.avatar_url;
          }
        } catch (e) {
          console.warn("Could not load user profile details from public.profiles table:", e);
        }

        setUser({
          email: sessionUser.email || "",
          name,
          avatarUrl,
        });
      };

      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadProfileAndSetUser(session.user).then(() => setLoading(false));
        } else {
          setLoading(false);
        }
      });

      // Listen to auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadProfileAndSetUser(session.user);
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
        console.warn("Error reading session from localStorage", error);
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
        try {
          const { data, error } = await supabase
            .from("saved_resumes")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            console.warn("Error fetching resumes from Supabase:", error.message);
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
        } catch (err: any) {
          console.warn("Network error fetching resumes from Supabase:", err.message || err);
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
  const signUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              name: fullName.trim(),
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // Create profile row in PostgreSQL
        if (data.user) {
          try {
            await supabase.from("profiles").insert({
              id: data.user.id,
              name: fullName.trim(),
              email: email.trim().toLowerCase(),
            });
          } catch (profileErr) {
            console.warn("Supabase profiles insert error:", profileErr);
            // Non-blocking in case trigger handles it
          }
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
        if (!emailTrim || !password || !fullName) {
          return { success: false, error: "Full Name, Email, and password are required." };
        }

        const usersStr = localStorage.getItem("atsprime_users") || "[]";
        const users = JSON.parse(usersStr) as { email: string; password: string; name?: string }[];
        
        const userExists = users.some((u) => u.email === emailTrim);
        if (userExists) {
          return { success: false, error: "An account with this email already exists." };
        }

        users.push({ email: emailTrim, password, name: fullName.trim() });
        localStorage.setItem("atsprime_users", JSON.stringify(users));

        const newUser: User = { email: emailTrim, name: fullName.trim() };
        localStorage.setItem("atsprime_session", JSON.stringify(newUser));
        setUser(newUser);

        return { success: true };
      } catch (err) {
        return { success: false, error: "An unexpected error occurred during sign-up." };
      }
    }
  };

  // Google OAuth Login
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: "An error occurred during Google sign-in." };
      }
    } else {
      // Fallback: LocalStorage Mock Google Signin
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockUser: User = {
          email: "google.user@gmail.com",
          name: "Google User",
        };
        localStorage.setItem("atsprime_session", JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true };
      } catch (err) {
        return { success: false, error: "An unexpected error occurred during Google sign-in." };
      }
    }
  };

  // Forgot Password Flow
  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: "An error occurred while sending reset email." };
      }
    } else {
      // Mock Fallback
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    }
  };

  // Update Password Flow
  const updatePassword = async (password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: "An error occurred while updating password." };
      }
    } else {
      // Mock Fallback
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    }
  };

  // Dynamic Signin
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // Set the user context state instantly to prevent redirect transition lag/skeletons
        if (data.user) {
          let name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "";
          let avatarUrl = data.user.user_metadata?.avatar_url || undefined;

          try {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("name, avatar_url")
              .eq("id", data.user.id)
              .maybeSingle();
            if (profileData) {
              if (profileData.name) name = profileData.name;
              if (profileData.avatar_url) avatarUrl = profileData.avatar_url;
            }
          } catch (e) {
            console.warn("Could not load user profile details during sign-in:", e);
          }

          setUser({
            email: data.user.email || "",
            name,
            avatarUrl,
          });
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
  // Signout
  const signOut = async () => {
    // Clear local session states immediately so UI is always responsive
    localStorage.removeItem("atsprime_session");
    
    // Clear any Supabase-stored auth tokens in localStorage to prevent restoring session on reload
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("sb-") || key.includes("auth-token"))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }

    // Clear any Supabase cookies to ensure a complete clean state
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name.startsWith("sb-") || name.includes("auth-token")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      }
    }

    setUser(null);
    setSavedResumes([]);

    if (useSupabase) {
      if (typeof window !== "undefined") {
        const originalOnError = window.onerror;
        const rejectionHandler = (event: PromiseRejectionEvent) => {
          const reasonStr = event.reason?.message || event.reason?.toString() || "";
          if (reasonStr.includes("Failed to fetch") || reasonStr.includes("fetch")) {
            event.preventDefault(); // Suppress the unhandled rejection overlay
          }
        };

        window.onerror = (message, source, lineno, colno, error) => {
          const msgStr = message?.toString() || "";
          if (msgStr.includes("Failed to fetch") || msgStr.includes("TypeError")) {
            return true; // Return true to prevent error reporting
          }
          if (originalOnError) {
            return originalOnError(message, source, lineno, colno, error);
          }
          return false;
        };

        window.addEventListener("unhandledrejection", rejectionHandler);

        // Fire-and-forget network signout
        supabase.auth.signOut()
          .catch((err) => {
            console.warn("Network signout warning:", err.message || err);
          })
          .finally(() => {
            // Restore original error listeners after a short delay to let network cycles clear
            setTimeout(() => {
              window.onerror = originalOnError;
              window.removeEventListener("unhandledrejection", rejectionHandler);
            }, 1000);
          });
      }
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
        console.warn("Failed to delete resume from Supabase:", error.message);
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
  // Update user profile (name, avatar)
  const updateProfile = async (name: string, avatarUrl?: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    if (useSupabase) {
      try {
        // Clear the avatar_url in JWT metadata to prevent headers from exceeding length limits!
        const { data, error } = await supabase.auth.updateUser({
          data: { full_name: name, avatar_url: null },
        });
        if (error) throw error;
        
        // Also update profiles table
        if (data.user?.id) {
          const { error: dbErr } = await supabase
            .from("profiles")
            .update({ name, avatar_url: avatarUrl })
            .eq("id", data.user.id);
          if (dbErr) throw dbErr;
        }

        setUser({
          email: data.user?.email || user.email,
          name: name,
          avatarUrl: avatarUrl || user.avatarUrl,
        });

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to update profile." };
      }
    } else {
      // Fallback: LocalStorage Session
      try {
        const activeSession = localStorage.getItem("atsprime_session");
        if (activeSession) {
          const parsed = JSON.parse(activeSession) as User;
          const updated = { ...parsed, name, avatarUrl: avatarUrl || parsed.avatarUrl };
          localStorage.setItem("atsprime_session", JSON.stringify(updated));
          setUser(updated);
        }
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Failed to update profile sandbox." };
      }
    }
  };

  // Delete user account permanently
  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };

    if (useSupabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) throw new Error("Could not retrieve active user session ID.");

        const { error } = await supabase.rpc("delete_user_by_id", { user_id: userId });
        if (error) {
          // If RPC fails (e.g. function does not exist), fallback to manual deletion
          console.warn("delete_user_by_id RPC failed, running manual deletion fallback:", error.message);

          // Delete from public.saved_resumes and public.profiles
          const { error: resumesErr } = await supabase.from("saved_resumes").delete().eq("user_id", userId);
          if (resumesErr) throw resumesErr;

          const { error: profileErr } = await supabase.from("profiles").delete().eq("id", userId);
          if (profileErr) throw profileErr;
        }
        await signOut();
        return { success: true };
      } catch (err: any) {
        console.warn("Error during Supabase account deletion:", err);
        return { success: false, error: err.message || "Failed to delete account from database." };
      }
    } else {
      // Fallback: LocalStorage Mock Delete
      try {
        const usersStr = localStorage.getItem("atsprime_users") || "[]";
        const users = JSON.parse(usersStr) as any[];
        const filtered = users.filter((u) => u.email !== user.email);
        localStorage.setItem("atsprime_users", JSON.stringify(filtered));
        localStorage.removeItem(`atsprime_resumes_${user.email}`);
        await signOut();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: "Failed to delete mock account." };
      }
    }
  };

  // Verify Email OTP for signup confirmation
  const verifyEmailOtp = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: token.trim(),
          type: "signup",
        });

        if (error) {
          return { success: false, error: error.message };
        }

        // If verified, set the active user context state
        if (data.user) {
          let name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split("@")[0] || "";
          let avatarUrl = data.user.user_metadata?.avatar_url || undefined;

          try {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("name, avatar_url")
              .eq("id", data.user.id)
              .maybeSingle();
            if (profileData) {
              if (profileData.name) name = profileData.name;
              if (profileData.avatar_url) avatarUrl = profileData.avatar_url;
            }
          } catch (e) {
            console.warn("Could not load user profile details during OTP verification:", e);
          }

          setUser({
            email: data.user.email || "",
            name,
            avatarUrl,
          });
        }

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to verify code." };
      }
    } else {
      // Fallback: LocalStorage Mock OTP Verification (use 123456 for mock sandbox testing)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (token.trim() === "123456") {
          // Resolve mock user in local session
          const mockUser: User = {
            email: email.trim().toLowerCase(),
            name: "Sandbox User",
          };
          localStorage.setItem("atsprime_session", JSON.stringify(mockUser));
          setUser(mockUser);
          return { success: true };
        }
        return { success: false, error: "Invalid verification code. Use 123456 for sandbox testing." };
      } catch (err) {
        return { success: false, error: "An unexpected error occurred during OTP verification." };
      }
    }
  };

  // Resend signup OTP code
  const resendSignupOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      try {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: email.trim().toLowerCase(),
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || "Failed to resend verification code." };
      }
    } else {
      // Fallback: Mock Resend Sandbox
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        savedResumes,
        loading,
        useSupabase,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        forgotPassword,
        updatePassword,
        saveResume,
        deleteResume,
        updateProfile,
        deleteAccount,
        verifyEmailOtp,
        resendSignupOtp,
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
