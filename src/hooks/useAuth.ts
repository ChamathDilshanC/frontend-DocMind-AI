"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { useRouter } from "next/navigation";
import type { AuthResultDto } from "@/types/api";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, hasHydrated, setSession, clearSession } = useAuthStore();

  // The auth request resolving is not the end of the flow — the redirect to
  // /dashboard still has to happen. Without this, the submit button would drop
  // out of its pending state while the user is still sitting on the login page,
  // which reads as "nothing happened". This stays true until the route change
  // unmounts the form.
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Warm the dashboard route's client-side cache ahead of time so the
  // post-login redirect doesn't also have to wait on fetching its JS/RSC
  // payload on top of the auth request itself.
  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const completeSignIn = useCallback(
    (result: AuthResultDto, greeting: string) => {
      setSession(result);
      setIsRedirecting(true);
      toast.success(greeting, { description: "Taking you to your dashboard..." });
      router.push("/dashboard");
    },
    [router, setSession],
  );

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: (result) => completeSignIn(result, `Welcome back, ${result.user.name}!`),
    onError: () => setIsRedirecting(false),
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authApi.register(name, email, password),
    onSuccess: (result) => completeSignIn(result, `Welcome, ${result.user.name}!`),
    onError: () => setIsRedirecting(false),
  });

  const googleSignInMutation = useMutation({
    mutationFn: (idToken: string) => authApi.googleSignIn(idToken),
    onSuccess: (result) => completeSignIn(result, `Welcome, ${result.user.name}!`),
    onError: () => setIsRedirecting(false),
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
    isLoggingIn: loginMutation.isPending || isRedirecting,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending || isRedirecting,
    registerError: registerMutation.error,
    googleSignIn: googleSignInMutation.mutateAsync,
    isGoogleSigningIn: googleSignInMutation.isPending || isRedirecting,
    isRedirecting,
    logout,
  };
}
