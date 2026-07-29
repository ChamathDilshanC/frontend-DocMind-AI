"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { gooeyToast as toast } from "goey-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-lg border border-[#dfe2ea] bg-white py-2.5 pl-10 pr-3 text-sm text-[#0d1220] placeholder:text-[#5b6478]/60 outline-none transition-colors focus:border-[#2743ff] focus:ring-4 focus:ring-[#2743ff]/15";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Login failed";
      setError("root", { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-semibold text-[#0d1220]">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5b6478]" size={16} />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register("email")}
          />
        </div>
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-xs font-semibold text-[#0d1220]">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5b6478]" size={16} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`${inputClass} pr-10`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b6478] hover:text-[#0d1220]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-[#5b6478]">
          <input type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded border-[#dfe2ea] accent-[#2743ff]" />
          Remember me
        </label>
        <button
          type="button"
          onClick={() => toast.info("Password reset isn't available yet — contact support instead.")}
          className="text-xs font-medium text-[#2743ff] hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isLoggingIn}
        className="w-full rounded-lg bg-[#2743ff] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isLoggingIn ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
