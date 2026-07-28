"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, hasHydrated, setSession, clearSession } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: (result) => {
      setSession(result);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authApi.register(name, email, password),
    onSuccess: (result) => {
      setSession(result);
      router.push("/dashboard");
    },
  });

  const googleSignInMutation = useMutation({
    mutationFn: (idToken: string) => authApi.googleSignIn(idToken),
    onSuccess: (result) => {
      setSession(result);
      router.push("/dashboard");
    },
  });

  const logout = async () => {
    const { refreshToken } = useAuthStore.getState();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // best-effort - clear local session regardless
      }
    }
    clearSession();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: Boolean(accessToken),
    hasHydrated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    googleSignIn: googleSignInMutation.mutateAsync,
    isGoogleSigningIn: googleSignInMutation.isPending,
    logout,
  };
}
