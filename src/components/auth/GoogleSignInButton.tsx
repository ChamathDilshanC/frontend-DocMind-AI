"use client";

import { GoogleLogin } from "@react-oauth/google";
import { gooeyToast as toast } from "goey-toast";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

// Render's free-tier backend sleeps after idle and can occasionally 404/502
// the very first request while it's waking up. Retry once after a short
// delay before surfacing an error to the user.
const RETRYABLE_STATUSES = new Set([404, 502, 503, 504]);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function GoogleSignInButton() {
  const { googleSignIn } = useAuth();

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  const signInWithRetry = async (idToken: string) => {
    try {
      await googleSignIn(idToken);
    } catch (error) {
      const isRetryable = !(error instanceof ApiError) || RETRYABLE_STATUSES.has(error.status);
      if (!isRetryable) throw error;
      await sleep(1500);
      await googleSignIn(idToken);
    }
  };

  return (
    <div className="flex w-full justify-center overflow-hidden rounded-[10px]">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) {
            toast.error("Google sign-in did not return a credential");
            return;
          }
          signInWithRetry(credentialResponse.credential).catch((error: Error) => {
            toast.error(error.message || "Google sign-in failed");
          });
        }}
        onError={() => toast.error("Google sign-in failed")}
        useOneTap
        theme="outline"
        shape="rectangular"
        text="continue_with"
        size="large"
        width={400}
        logo_alignment="center"
      />
    </div>
  );
}
