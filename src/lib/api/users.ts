import { apiFetch } from "@/lib/api/client";
import type { PaginatedList, StatisticsDto, UserProfileDto } from "@/types/api";

interface UserListItemDto {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const usersApi = {
  getProfile: () => apiFetch<UserProfileDto>("/api/users/me"),

  updateProfile: (name: string) =>
    apiFetch<UserProfileDto>("/api/users/me", { method: "PUT", body: { name } }),

  changePassword: (currentPassword: string | null, newPassword: string) =>
    apiFetch<void>("/api/users/me/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    }),

  deleteAccount: () => apiFetch<void>("/api/users/me", { method: "DELETE" }),

  listAll: (pageNumber = 1, pageSize = 20) =>
    apiFetch<PaginatedList<UserListItemDto>>(`/api/users?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  statistics: () => apiFetch<StatisticsDto>("/api/statistics"),
};
