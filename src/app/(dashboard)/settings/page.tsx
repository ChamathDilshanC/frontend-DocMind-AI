"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCardSkeleton } from "@/components/ui/loading-skeletons";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";
import { usersApi } from "@/lib/api/users";

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

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold text-sm">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: usersApi.getProfile });

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
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 pt-10 pb-2">
        <h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm">Manage your profile and account security.</p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4 p-6">
        {isLoading ? (
          <>
            <FormCardSkeleton fields={1} />
            <FormCardSkeleton fields={2} />
          </>
        ) : (
          <>
            {/* Identity summary */}
            <div className="flex items-center gap-4 rounded-xl border bg-card p-6">
              <UserAvatar
                avatarUrl={profile?.avatarUrl}
                className="h-14 w-14 shrink-0"
                fallbackClassName="bg-brand-700 text-lg text-white"
                name={profile?.name ?? ""}
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{profile?.name}</p>
                <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile?.hasGoogleLinked && (
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                      Google linked
                    </span>
                  )}
                  {profile?.hasPassword && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      Password set
                    </span>
                  )}
                  {profile?.role === "Admin" && (
                    <span className="rounded-full bg-brand-700/10 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            <SectionCard icon={UserRound} title="Profile" description="Update how your name appears in the app.">
              <form className="space-y-4" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...profileForm.register("name")} />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <Button
                  className="bg-brand-700 text-white hover:bg-brand-600"
                  type="submit"
                  disabled={profileForm.formState.isSubmitting}
                >
                  {profileForm.formState.isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </SectionCard>

            <SectionCard
              icon={profile?.hasPassword ? KeyRound : ShieldCheck}
              title={profile?.hasPassword ? "Change password" : "Set a password"}
              description={
                profile?.hasPassword
                  ? "Enter your current password to set a new one."
                  : "Add a password so you can sign in without Google."
              }
            >
              <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
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
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <Button
                  className="bg-brand-700 text-white hover:bg-brand-600"
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                >
                  {passwordForm.formState.isSubmitting ? "Updating..." : "Update password"}
                </Button>
              </form>
            </SectionCard>

            <SectionCard icon={LogOut} title="Sign out" description="End your current session on this device.">
              <Button variant="outline" onClick={() => logout()}>
                Log out
              </Button>
            </SectionCard>
          </>
        )}
      </div>
    </div>
  );
}
