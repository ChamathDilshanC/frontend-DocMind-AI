"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a digit"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputClass =
  "w-full rounded-lg border border-[#dfe2ea] bg-white py-2.5 pl-10 pr-3 text-sm text-[#0d1220] placeholder:text-[#5b6478]/60 outline-none transition-colors focus:border-[#2743ff] focus:ring-4 focus:ring-[#2743ff]/15";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: searchParams.get("email") ?? "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser(values);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Registration failed";
      setError("root", { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-xs font-semibold text-[#0d1220]">
          Name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5b6478]" size={16} />
          <input id="name" autoComplete="name" className={inputClass} {...register("name")} />
        </div>
        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

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
            autoComplete="new-password"
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

      {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isRegistering}
        className="w-full rounded-lg bg-[#2743ff] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isRegistering ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
