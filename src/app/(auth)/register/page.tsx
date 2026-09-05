import { Suspense } from "react";
import { Separator, Typography } from "@heroui/react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { bricolage } from "@/lib/fonts";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 flex justify-end">
        <Typography type="body-xs" className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:underline">
            Sign in
          </Link>
        </Typography>
      </div>

      <Typography.Heading level={1} className={`${bricolage.className} text-2xl text-foreground`}>
        Create your account
      </Typography.Heading>
      <Typography.Paragraph className="mt-2 text-muted-foreground">
        Start chatting with your documents in minutes.
      </Typography.Paragraph>

      <div className="mt-8">
        <GoogleSignInButton />
      </div>

      <div className="my-7 flex items-center gap-3">
        <Separator className="flex-1" />
        <Typography type="body-xs" className="text-muted-foreground">
          or continue with email
        </Typography>
        <Separator className="flex-1" />
      </div>

      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>

      <Typography type="body-xs" align="center" className="mt-8 text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">
          Sign in
        </Link>
      </Typography>
      <Typography type="body-xs" align="center" className="mt-3 text-muted-foreground/70">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </Typography>
    </div>
  );
}
