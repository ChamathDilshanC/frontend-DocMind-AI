"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, InputGroup, Label, Link, TextField } from "@heroui/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { gooeyToast as toast } from "goey-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api/client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoggingIn, isRedirecting } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Login failed";
      setError("root", { message });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
          >
            <Label>Email</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Mail size={16} />
              </InputGroup.Prefix>
              <InputGroup.Input placeholder="you@example.com" type="email" />
            </InputGroup>
            {fieldState.error && <p className="text-xs text-danger px-1">{fieldState.error.message}</p>}
          </TextField>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
          >
            <Label>Password</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Lock size={16} />
              </InputGroup.Prefix>
              <InputGroup.Input placeholder="••••••••" type={showPassword ? "text" : "password"} />
              <InputGroup.Suffix className="pr-0">
                <Button
                  isIconOnly
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  size="sm"
                  variant="ghost"
                  onPress={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
            {fieldState.error && <p className="text-xs text-danger px-1">{fieldState.error.message}</p>}
          </TextField>
        )}
      />

      <div className="flex items-center justify-between">
        <Checkbox defaultSelected name="rememberMe">
          <Checkbox.Content className="text-xs text-[#5b6478]">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            Remember me
          </Checkbox.Content>
        </Checkbox>
        <Link
          className="text-xs font-medium text-[#2743ff]"
          onPress={() => toast.info("Password reset isn't available yet — contact support instead.")}
        >
          Forgot password?
        </Link>
      </div>

      {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}

      <Button
        fullWidth
        isDisabled={isLoggingIn}
        isPending={isLoggingIn}
        type="submit"
        variant="primary"
      >
        {isRedirecting ? "Opening your dashboard..." : isLoggingIn ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
