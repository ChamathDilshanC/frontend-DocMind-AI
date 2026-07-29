"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";

interface UserAvatarProps {
  name: string;
  /** Google profile photo. When absent (or it fails to load) the initials show instead. */
  avatarUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({ name, avatarUrl, className, fallbackClassName }: UserAvatarProps) {
  return (
    <Avatar className={cn("rounded-full", className)}>
      {avatarUrl && <AvatarImage alt={name} src={avatarUrl} referrerPolicy="no-referrer" />}
      <AvatarFallback className={cn("rounded-full bg-brand-100 font-medium text-brand-700", fallbackClassName)}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
