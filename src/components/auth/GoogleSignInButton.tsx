"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function GoogleSignInButton() {
  const { googleSignIn } = useAuth();

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (!credentialResponse.credential) {
          toast.error("Google sign-in did not return a credential");
          return;
        }
        googleSignIn(credentialResponse.credential).catch((error: Error) => {
          toast.error(error.message || "Google sign-in failed");
        });
      }}
      onError={() => toast.error("Google sign-in failed")}
      useOneTap
    />
  );
}
