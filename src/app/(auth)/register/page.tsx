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
        <Typography type="body-xs" className="text-[#5b6478]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2743ff] hover:underline">
            Sign in
          </Link>
        </Typography>
      </div>

      <Typography.Heading level={1} className={`${bricolage.className} text-2xl text-[#0d1220]`}>
        Create your account
      </Typography.Heading>
      <Typography.Paragraph className="mt-1 text-[#5b6478]">
        Start chatting with your documents in minutes.
      </Typography.Paragraph>

      <div className="mt-6">
        <GoogleSignInButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <Typography type="body-xs" className="text-[#5b6478]">
          or continue with email
        </Typography>
        <Separator className="flex-1" />
      </div>

      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>

      <Typography type="body-xs" align="center" className="mt-6 text-[#5b6478]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2743ff] hover:underline">
          Sign in
        </Link>
      </Typography>
      <Typography type="body-xs" align="center" className="mt-3 text-[#5b6478]/70">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </Typography>
    </div>
  );
}
