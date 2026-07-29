"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, hasHydrated, setSession, clearSession } = useAuthStore();

  // Warm the dashboard route's client-side cache ahead of time so the
  // post-login redirect doesn't also have to wait on fetching its JS/RSC
  // payload on top of the auth request itself.
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: (result) => {
      setSession(result);
      toast.success(`Welcome back, ${result.user.name}!`);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authApi.register(name, email, password),
    onSuccess: (result) => {
      setSession(result);
      toast.success(`Welcome, ${result.user.name}!`);
      router.push("/dashboard");
    },
  });

  const googleSignInMutation = useMutation({
    mutationFn: (idToken: string) => authApi.googleSignIn(idToken),
    onSuccess: (result) => {
      setSession(result);
      toast.success(`Welcome, ${result.user.name}!`);
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
