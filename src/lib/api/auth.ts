import { apiFetch } from "@/lib/api/client";
import type { AuthResultDto, UserDto } from "@/types/api";

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResultDto>("/api/auth/register", { method: "POST", body: { name, email, password }, skipAuth: true }),

  login: (email: string, password: string) =>
    apiFetch<AuthResultDto>("/api/auth/login", { method: "POST", body: { email, password }, skipAuth: true }),

  googleSignIn: (idToken: string) =>
    apiFetch<AuthResultDto>("/api/auth/google", { method: "POST", body: { idToken }, skipAuth: true }),

  logout: (refreshToken: string) =>
    apiFetch<void>("/api/auth/logout", { method: "POST", body: { refreshToken }, skipAuth: true }),

  me: () => apiFetch<UserDto>("/api/auth/me"),
};
