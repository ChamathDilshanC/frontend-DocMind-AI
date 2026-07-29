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
    <div className="flex w-full justify-center overflow-hidden rounded-[10px]">
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
        theme="outline"
        shape="rectangular"
        text="continue_with"
        size="large"
        width={360}
      />
    </div>
  );
}
