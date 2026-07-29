import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { bricolage } from "@/lib/fonts";

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 flex justify-end">
        <p className="text-xs text-[#5b6478]">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[#2743ff] hover:underline">
            Create account
          </Link>
        </p>
      </div>

      <h1 className={`${bricolage.className} text-2xl font-bold text-[#0d1220]`}>Welcome back</h1>
      <p className="mt-1 text-sm text-[#5b6478]">Sign in to your account to continue.</p>

      <div className="mt-6">
        <GoogleSignInButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e6e8ee]" />
        <span className="text-xs text-[#5b6478]">or continue with email</span>
        <div className="h-px flex-1 bg-[#e6e8ee]" />
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-xs text-[#5b6478]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#2743ff] hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-3 text-center text-[11px] text-[#5b6478]/70">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
