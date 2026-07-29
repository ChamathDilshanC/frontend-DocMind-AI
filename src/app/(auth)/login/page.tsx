import { Separator, Typography } from "@heroui/react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { bricolage } from "@/lib/fonts";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 flex justify-end">
        <Typography type="body-xs" className="text-[#5b6478]">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[#2743ff] hover:underline">
            Create account
          </Link>
        </Typography>
      </div>

      <Typography.Heading level={1} className={`${bricolage.className} text-2xl text-[#0d1220]`}>
        Welcome back
      </Typography.Heading>
      <Typography.Paragraph className="mt-2 text-[#5b6478]">Sign in to your account to continue.</Typography.Paragraph>

      <div className="mt-8">
        <GoogleSignInButton />
      </div>

      <div className="my-7 flex items-center gap-3">
        <Separator className="flex-1" />
        <Typography type="body-xs" className="text-[#5b6478]">
          or continue with email
        </Typography>
        <Separator className="flex-1" />
      </div>

      <LoginForm />

      <Typography type="body-xs" align="center" className="mt-8 text-[#5b6478]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#2743ff] hover:underline">
          Sign up
        </Link>
      </Typography>
      <Typography type="body-xs" align="center" className="mt-3 text-[#5b6478]/70">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </Typography>
    </div>
  );
}
