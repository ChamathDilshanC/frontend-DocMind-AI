import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to DocMind AI</CardTitle>
        <CardDescription>Ask questions over your own documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex justify-center">
          <GoogleSignInButton />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
