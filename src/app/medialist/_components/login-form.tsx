"use client";

import { useMedialistAuth } from "@/components/providers/medialist-auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function MedialistLoginForm() {
  const router = useRouter();
  const { configured, isAuthenticated, loading, login } = useMedialistAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/medialist/manage");
    }
  }, [isAuthenticated, loading, router]);

  if (!configured) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Convex not configured</CardTitle>
          <CardDescription>Add `NEXT_PUBLIC_CONVEX_URL` first.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!loading && isAuthenticated) {
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Seeded accounts only. No self-registration.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setPending(true);
            setError(null);

            const formData = new FormData(event.currentTarget);

            try {
              await login({
                password: String(formData.get("password") ?? ""),
                username: String(formData.get("username") ?? ""),
              });
              router.replace("/medialist/manage");
            } catch (caughtError) {
              setError(caughtError instanceof Error ? caughtError.message : "Login failed.");
            } finally {
              setPending(false);
            }
          }}
        >
          <label className="grid gap-2 text-sm">
            <span>Username</span>
            <input
              className="h-10 rounded-md border bg-background px-3"
              name="username"
              required
              type="text"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span>Password</span>
            <input
              className="h-10 rounded-md border bg-background px-3"
              name="password"
              required
              type="password"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between gap-4">
            <Button disabled={pending} type="submit">
              {pending ? "Signing in..." : "Sign in"}
            </Button>
            <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/medialist">
              Back to list
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
