import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResultDto, UserDto } from "@/types/api";

interface AuthState {
  accessToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshToken: string | null;
  user: UserDto | null;
  hasHydrated: boolean;
  setSession: (result: AuthResultDto) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      accessTokenExpiresAt: null,
      refreshToken: null,
      user: null,
      hasHydrated: false,
      setSession: (result) =>
        set({
          accessToken: result.accessToken,
          accessTokenExpiresAt: result.accessTokenExpiresAt,
          refreshToken: result.refreshToken,
          user: result.user,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          accessTokenExpiresAt: null,
          refreshToken: null,
          user: null,
        }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "docmind-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
