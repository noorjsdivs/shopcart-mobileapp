import { supabase } from "@/lib/supabase";
import { create } from "zustand";

export interface User {
  id: string;
  email: string;
}
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  //   Login with email and password
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data && data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || "",
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  signup: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (data && data.user) {
        set({
          user: { id: data.user.id, email: data.user.email || "" },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  checkSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (data && data.session) {
        const { user } = data.session;
        set({
          user: {
            id: user.id,
            email: user.email || "",
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      set({ user: null, error: error.message, isLoading: false });
    }
  },
}));
