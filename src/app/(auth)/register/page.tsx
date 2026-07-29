import { Suspense } from "react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { bricolage } from "@/lib/fonts";

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 flex justify-end">
        <p className="text-xs text-[#5b6478]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2743ff] hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <h1 className={`${bricolage.className} text-2xl font-bold text-[#0d1220]`}>Create your account</h1>
      <p className="mt-1 text-sm text-[#5b6478]">Start chatting with your documents in minutes.</p>

      <div className="mt-6">
        <GoogleSignInButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e6e8ee]" />
        <span className="text-xs text-[#5b6478]">or continue with email</span>
        <div className="h-px flex-1 bg-[#e6e8ee]" />
      </div>

      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>

      <p className="mt-6 text-center text-xs text-[#5b6478]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#2743ff] hover:underline">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-[11px] text-[#5b6478]/70">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
