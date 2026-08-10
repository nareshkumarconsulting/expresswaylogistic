"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { StateAlert } from "@/components/molecules/state-alert";

type LoginFormProps = {
  defaultEmail?: string;
};

export function LoginForm({ defaultEmail = "" }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Unable to sign in");
      }

      const next = searchParams.get("next");
      const destination =
        next && next.startsWith("/command-center") ? next : "/command-center";
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {status === "error" && errorMessage ? (
        <StateAlert variant="error" title={errorMessage} />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="username"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        rounded="none"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Signing in…" : "Continue"}
      </Button>
    </form>
  );
}
