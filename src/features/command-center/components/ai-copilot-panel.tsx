"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import { FormField } from "@/components/molecules/form-field";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  aiQuerySchema,
} from "@/features/contact/schemas";
import { z } from "zod";
import type { AiInsight, Shipment } from "@/types";

type AiForm = z.infer<typeof aiQuerySchema>;

interface AiResponse {
  answer: string;
  matches: Shipment[];
  insights: AiInsight[];
}

export function AiCopilotPanel() {
  const [result, setResult] = useState<AiResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AiForm>({
    resolver: zodResolver(aiQuerySchema),
    defaultValues: { query: "" },
  });

  const onSubmit = async (values: AiForm) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: AiResponse;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error ?? "AI request failed");
      }
      setResult(json.data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "AI request failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="size-6 text-accent" />
          AI Logistics Copilot
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask about shipments, exceptions, lanes, or clients in natural language.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <FormField
          label="Your question"
          htmlFor="query"
          required
          error={errors.query?.message}
          hint='Examples: "customs hold", "Mumbai", "EW-10846"'
        >
          <Textarea
            {...register("query")}
            placeholder="Which shipments are at risk this week?"
            className="min-h-[120px]"
          />
        </FormField>
        <Button type="submit" loading={status === "loading"}>
          <Sparkles className="size-4" />
          Ask Copilot
        </Button>
      </form>

      {status === "error" ? (
        <StateAlert
          variant="error"
          title="Copilot unavailable"
          description={error ?? undefined}
          onRetry={() => setStatus("idle")}
        />
      ) : null}

      {result ? (
        <div className="space-y-4">
          <article className="rounded-lg border border-border bg-muted/40 p-6">
            <h3 className="mb-2 font-semibold">Answer</h3>
            <p className="leading-relaxed text-foreground">{result.answer}</p>
          </article>

          {result.matches.length > 0 ? (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold">Matched shipments</h3>
              <ul className="space-y-3">
                {result.matches.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold">{s.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {s.origin} → {s.destination} · {s.client}
                      </p>
                    </div>
                    <Badge variant="outline">{s.status}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
