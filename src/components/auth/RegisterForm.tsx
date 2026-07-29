"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FieldError, InputGroup, Label, TextField } from "@heroui/react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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

export function RegisterForm() {
  const searchParams = useSearchParams();
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: searchParams.get("email") ?? "", password: "" },
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
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            isInvalid={fieldState.invalid}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            onChange={field.onChange}
          >
            <Label>Name</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <User size={16} />
              </InputGroup.Prefix>
              <InputGroup.Input />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

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
            <Label>Email address</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Mail size={16} />
              </InputGroup.Prefix>
              <InputGroup.Input placeholder="you@example.com" type="email" />
            </InputGroup>
            <FieldError>{fieldState.error?.message}</FieldError>
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
              <InputGroup.Input type={showPassword ? "text" : "password"} />
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
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />

      {errors.root && <p className="text-xs text-red-600">{errors.root.message}</p>}

      <Button fullWidth isPending={isRegistering} type="submit" variant="primary">
        {isRegistering ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
