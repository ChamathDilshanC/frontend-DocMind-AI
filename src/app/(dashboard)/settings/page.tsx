"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { usersApi } from "@/lib/api/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const profileSchema = z.object({ name: z.string().min(1, "Name is required").max(200) });
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a digit"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: usersApi.getProfile });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: profile ? { name: profile.name } : undefined,
  });

  const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (values: ProfileValues) => {
    try {
      await usersApi.updateProfile(values.name);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Update failed");
    }
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    try {
      await usersApi.changePassword(values.currentPassword || null, values.newPassword);
      passwordForm.reset();
      toast.success("Password updated");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Password change failed");
    }
  };

  return (
    <div className="h-full space-y-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>{profile?.email}</CardDescription>
        </CardHeader>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
          <CardContent className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...profileForm.register("name")} />
            {profileForm.formState.errors.name && (
              <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
            )}
            <div className="flex gap-2 pt-2">
              {profile?.hasGoogleLinked && <Badge variant="secondary">Google linked</Badge>}
              {profile?.hasPassword && <Badge variant="outline">Password set</Badge>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              Save changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            {profile?.hasPassword ? "Enter your current password to set a new one." : "Set a password for your account."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <CardContent className="space-y-4">
            {profile?.hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
              Update password
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
          <CardDescription>End your current session on this device.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => logout()}>
            Log out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
