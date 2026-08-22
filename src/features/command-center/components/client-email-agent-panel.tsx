"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  History,
  Mail,
  PenLine,
  Plus,
  RefreshCw,
  Send,
  Settings2,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Spinner } from "@/components/atoms/spinner";
import { Textarea } from "@/components/atoms/textarea";
import { StateAlert } from "@/components/molecules/state-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
  ClientEmailContact,
  ClientEmailMessage,
  EmailBrandingSettings,
} from "@/types";

type Step = "compose" | "edit" | "preview" | "review" | "result";

type DraftPayload = {
  subject: string;
  greeting: string;
  body: string;
  cta?: string;
  suggestedTo: string[];
  clientName?: string;
  clientCompany?: string;
  quoteRequestId?: string;
  contextNotes: string[];
};

type BrandingForm = {
  companyName: string;
  tagline: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  logoUrl: string;
};

const STEPS: { id: Step; label: string }[] = [
  { id: "compose", label: "Brief" },
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
  { id: "review", label: "Review" },
  { id: "result", label: "Sent" },
];

const TONE_CHIPS = [
  "More professional",
  "More friendly",
  "Shorter",
  "Clearer",
  "Add a stronger CTA",
];

function parseEmails(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(/[,;\s]+/)
        .map((item) => item.trim().toLowerCase())
        .filter((item) => item.includes("@")),
    ),
  ];
}

function joinBody(greeting: string, body: string, cta?: string): string {
  return [greeting.trim(), "", body.trim(), cta?.trim() ? `\n${cta.trim()}` : ""]
    .join("\n")
    .trim();
}

function brandingToForm(branding: EmailBrandingSettings): BrandingForm {
  return {
    companyName: branding.companyName ?? "",
    tagline: branding.tagline ?? "",
    websiteUrl: branding.websiteUrl ?? "",
    contactEmail: branding.contactEmail ?? "",
    contactPhone: branding.contactPhone ?? "",
    contactAddress: branding.contactAddress ?? "",
    logoUrl: branding.logoUrl ?? "",
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = (await res.json()) as {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  };
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || json.message || "Request failed");
  }
  return json.data;
}

function RecipientField({
  label,
  emails,
  onChange,
  suggestions,
}: {
  label: string;
  emails: string[];
  onChange: (next: string[]) => void;
  suggestions?: ClientEmailContact[];
}) {
  const [draft, setDraft] = useState("");

  const add = (value: string) => {
    const next = parseEmails(value);
    if (next.length === 0) return;
    onChange([...new Set([...emails, ...next])]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2 rounded-md border border-input bg-background px-2 py-2">
        {emails.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium"
          >
            {email}
            <button
              type="button"
              aria-label={`Remove ${email}`}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onChange(emails.filter((item) => item !== email))}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add(draft);
            }
          }}
          onBlur={() => add(draft)}
          placeholder="Add email and press Enter"
          className="min-w-[180px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
      {suggestions && suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 6).map((contact) => (
            <button
              key={contact.email}
              type="button"
              className="rounded-md border px-2 py-1 text-xs text-muted-foreground hover:border-accent hover:text-foreground"
              onClick={() =>
                onChange([...new Set([...emails, contact.email.toLowerCase()])])
              }
            >
              <Plus className="mr-1 inline size-3" />
              {contact.name} · {contact.email}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BrandingDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: EmailBrandingSettings;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(() => brandingToForm(initial));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await fetchJson("/api/client-email/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, updatedBy: "Operations" }),
      });
      toast.success("Email branding saved");
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[min(100%-2rem,32rem)] overflow-y-auto">
        <DialogTitle>Email branding</DialogTitle>
        <DialogDescription>
          Signature, logo, and contact details appended to every client email.
        </DialogDescription>
        <div className="grid gap-3 py-2">
          {(
            [
              ["companyName", "Company name"],
              ["tagline", "Tagline"],
              ["websiteUrl", "Website URL"],
              ["contactEmail", "Contact email"],
              ["contactPhone", "Phone"],
              ["logoUrl", "Logo URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`brand-${key}`}>{label}</Label>
              <Input
                id={`brand-${key}`}
                value={form[key]}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, [key]: event.target.value }))
                }
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="brand-address">Address</Label>
            <Textarea
              id="brand-address"
              value={form.contactAddress}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  contactAddress: event.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" loading={saving} onClick={() => void save()}>
            Save branding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ClientEmailAgentPanel() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const quoteFromUrl = searchParams.get("quoteId") ?? "";
  const emailFromUrl = searchParams.get("email") ?? "";

  const [step, setStep] = useState<Step>("compose");
  const [prompt, setPrompt] = useState("");
  const [selectedQuoteId, setSelectedQuoteId] = useState(quoteFromUrl);
  const [selectedContactEmail, setSelectedContactEmail] = useState(emailFromUrl);
  const [toneHint, setToneHint] = useState("");
  const [refineInstruction, setRefineInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandingOpen, setBrandingOpen] = useState(false);

  const [subject, setSubject] = useState("");
  const [greeting, setGreeting] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [to, setTo] = useState<string[]>(() =>
    emailFromUrl ? [emailFromUrl.toLowerCase()] : [],
  );
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [senderName, setSenderName] = useState("");
  const [contextNotes, setContextNotes] = useState<string[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");
  const [lastMessage, setLastMessage] = useState<ClientEmailMessage | null>(
    null,
  );
  const [sendError, setSendError] = useState<string | null>(null);

  const contactsQuery = useQuery({
    queryKey: ["client-email-contacts"],
    queryFn: () => fetchJson<ClientEmailContact[]>("/api/client-email/contacts"),
  });

  const brandingQuery = useQuery({
    queryKey: ["client-email-branding"],
    queryFn: () =>
      fetchJson<EmailBrandingSettings>("/api/client-email/branding"),
  });

  const historyQuery = useQuery({
    queryKey: [
      "client-email-history",
      selectedQuoteId || selectedContactEmail || "all",
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedQuoteId) params.set("quoteRequestId", selectedQuoteId);
      else if (selectedContactEmail) {
        params.set("clientEmail", selectedContactEmail);
      }
      const qs = params.toString();
      return fetchJson<ClientEmailMessage[]>(
        `/api/client-email/history${qs ? `?${qs}` : ""}`,
      );
    },
  });

  const selectedContact = useMemo(
    () =>
      contactsQuery.data?.find(
        (item) =>
          item.email.toLowerCase() === selectedContactEmail.toLowerCase(),
      ),
    [contactsQuery.data, selectedContactEmail],
  );

  const applyContact = (contact: ClientEmailContact | undefined) => {
    if (!contact) {
      setSelectedContactEmail("");
      return;
    }
    setSelectedContactEmail(contact.email);
    setClientName(contact.name);
    setClientCompany(contact.company);
    setTo([contact.email.toLowerCase()]);
    if (contact.latestQuoteId) setSelectedQuoteId(contact.latestQuoteId);
  };

  const plainBody = useMemo(
    () => joinBody(greeting, body, cta),
    [greeting, body, cta],
  );

  const recipientCount = to.length + cc.length + bcc.length;

  const applyDraft = (draft: DraftPayload) => {
    setSubject(draft.subject);
    setGreeting(draft.greeting);
    setBody(draft.body);
    setCta(draft.cta ?? "");
    setContextNotes(draft.contextNotes ?? []);
    if (draft.clientName) setClientName(draft.clientName);
    if (draft.clientCompany) setClientCompany(draft.clientCompany);
    if (draft.quoteRequestId) setSelectedQuoteId(draft.quoteRequestId);
    if (draft.suggestedTo.length > 0) {
      setTo((prev) =>
        prev.length > 0
          ? prev
          : draft.suggestedTo.map((email) => email.toLowerCase()),
      );
    }
  };

  const generateDraft = async (mode: "create" | "regenerate") => {
    setBusy(true);
    setError(null);
    try {
      const draft = await fetchJson<DraftPayload>("/api/client-email/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt:
            mode === "regenerate"
              ? `${prompt}\n\nPlease regenerate with a fresh phrasing while keeping the same facts.`
              : prompt,
          quoteRequestId: selectedQuoteId || undefined,
          clientEmail: selectedContactEmail || undefined,
          clientName:
            clientName || selectedContact?.name || undefined,
          clientCompany:
            clientCompany || selectedContact?.company || undefined,
          toneHint: toneHint || undefined,
        }),
      });
      applyDraft(draft);
      setStep("edit");
      toast.success("AI draft ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Draft failed");
    } finally {
      setBusy(false);
    }
  };

  const refineDraft = async (instruction: string) => {
    if (!instruction.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const draft = await fetchJson<DraftPayload>("/api/client-email/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction,
          subject,
          greeting,
          body,
          cta: cta || undefined,
          quoteRequestId: selectedQuoteId || undefined,
          clientEmail: selectedContactEmail || undefined,
          clientName:
            clientName || selectedContact?.name || undefined,
          clientCompany:
            clientCompany || selectedContact?.company || undefined,
        }),
      });
      applyDraft(draft);
      setRefineInstruction("");
      toast.success("Draft updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refine failed");
    } finally {
      setBusy(false);
    }
  };

  const loadPreview = async () => {
    setBusy(true);
    setError(null);
    try {
      const data = await fetchJson<{ html: string }>("/api/client-email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bodyText: plainBody, subject, senderName }),
      });
      setPreviewHtml(data.html);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setBusy(false);
    }
  };

  const sendEmailNow = async (retryOfId?: string) => {
    setBusy(true);
    setError(null);
    setSendError(null);
    try {
      const res = await fetch("/api/client-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteRequestId: selectedQuoteId || undefined,
          clientName: clientName || selectedContact?.name || undefined,
          clientCompany:
            clientCompany || selectedContact?.company || undefined,
          to,
          cc,
          bcc,
          subject,
          bodyText: plainBody,
          prompt: prompt || undefined,
          retryOfId,
          senderName: senderName.trim() || undefined,
          sentBy: senderName.trim() || "Operations",
        }),
      });
      const json = (await res.json()) as {
        success: boolean;
        data?: ClientEmailMessage;
        error?: string;
        message?: string;
      };
      if (!json.data) {
        throw new Error(json.error || "Send failed");
      }
      setLastMessage(json.data);
      setSendError(json.success ? null : json.error || "Send failed");
      setStep("result");
      void queryClient.invalidateQueries({ queryKey: ["client-email-history"] });
      if (json.success) toast.success("Email sent");
      else toast.error(json.error || "Email failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setBusy(false);
    }
  };

  const resetFlow = () => {
    setStep("compose");
    setPrompt("");
    setToneHint("");
    setSubject("");
    setGreeting("");
    setBody("");
    setCta("");
    setPreviewHtml("");
    setLastMessage(null);
    setSendError(null);
    setError(null);
    setContextNotes([]);
    setSenderName("");
  };

  const stepIndex = STEPS.findIndex((item) => item.id === step);
  const quoteOptions =
    selectedContact?.quoteIds ??
    (selectedQuoteId ? [selectedQuoteId] : []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            <Sparkles className="size-3.5" aria-hidden />
            Personal AI Account Manager
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Client Email Agent
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Brief → personalized draft → edit → branded preview → review → send
            from the dashboard.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setBrandingOpen(true)}
        >
          <Settings2 className="size-4" />
          Branding
        </Button>
      </header>

      <nav
        aria-label="Email flow steps"
        className="flex flex-wrap gap-2 rounded-lg border bg-muted/40 p-2"
      >
        {STEPS.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold",
              index <= stepIndex
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            {index + 1}. {item.label}
          </div>
        ))}
      </nav>

      {error ? (
        <StateAlert
          variant="error"
          title="Something went wrong"
          description={error}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border bg-background p-5 shadow-sm">
          {step === "compose" ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="client-contact">Client contact</Label>
                <select
                  id="client-contact"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={selectedContactEmail}
                  onChange={(event) => {
                    const email = event.target.value;
                    if (!email) {
                      applyContact(undefined);
                      return;
                    }
                    const contact = contactsQuery.data?.find(
                      (item) => item.email === email,
                    );
                    applyContact(contact);
                  }}
                >
                  <option value="">Select a client (optional)</option>
                  {(contactsQuery.data ?? []).map((contact) => (
                    <option key={contact.email} value={contact.email}>
                      {contact.company} — {contact.name} ({contact.email})
                    </option>
                  ))}
                </select>
              </div>

              {quoteOptions.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="quote-context">Related quote / shipment</Label>
                  <select
                    id="quote-context"
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={selectedQuoteId}
                    onChange={(event) => setSelectedQuoteId(event.target.value)}
                  >
                    <option value="">No specific quote</option>
                    {quoteOptions.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email-prompt">
                  What would you like to communicate?
                </Label>
                <Textarea
                  id="email-prompt"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="e.g. Follow up on the Delhi→Dubai quote, confirm cargo ready date, and offer a 15-minute call this week."
                  className="min-h-[140px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tone (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {TONE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setToneHint(chip)}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs font-medium",
                        toneHint === chip
                          ? "border-accent bg-accent/10 text-accent"
                          : "text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                loading={busy}
                disabled={prompt.trim().length < 8}
                onClick={() => void generateDraft("create")}
              >
                <Sparkles className="size-4" />
                Draft with AI
              </Button>
            </div>
          ) : null}

          {step === "edit" ? (
            <div className="space-y-5">
              {contextNotes.length > 0 ? (
                <div className="rounded-lg border border-primary/15 bg-primary/5 p-3 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">Context used</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {contextNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <RecipientField
                label="To"
                emails={to}
                onChange={setTo}
                suggestions={contactsQuery.data}
              />
              <RecipientField label="CC" emails={cc} onChange={setCc} />
              <RecipientField label="BCC" emails={bcc} onChange={setBcc} />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client name</Label>
                  <Input
                    id="client-name"
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-company">Company</Label>
                  <Input
                    id="client-company"
                    value={clientCompany}
                    onChange={(event) => setClientCompany(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sender-name">Your name</Label>
                <Input
                  id="sender-name"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder="e.g. Priya Sharma"
                />
                <p className="text-xs text-muted-foreground">
                  Shown in the email signature between &ldquo;Regards,&rdquo; and
                  the company name.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting</Label>
                <Input
                  id="greeting"
                  value={greeting}
                  onChange={(event) => setGreeting(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="min-h-[180px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta">Call to action</Label>
                <Textarea
                  id="cta"
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                <Label htmlFor="refine">Ask AI to adjust</Label>
                <div className="flex flex-wrap gap-2">
                  {TONE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="rounded-md border bg-background px-2.5 py-1 text-xs hover:border-accent"
                      onClick={() => void refineDraft(chip)}
                      disabled={busy}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="refine"
                    value={refineInstruction}
                    onChange={(event) => setRefineInstruction(event.target.value)}
                    placeholder="e.g. Mention we are awaiting packing list"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    loading={busy}
                    onClick={() => void refineDraft(refineInstruction)}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("compose")}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  loading={busy}
                  onClick={() => void generateDraft("regenerate")}
                >
                  <RefreshCw className="size-4" />
                  Regenerate
                </Button>
                <Button
                  type="button"
                  loading={busy}
                  disabled={!subject.trim() || !plainBody.trim() || to.length === 0}
                  onClick={() => void loadPreview()}
                >
                  <PenLine className="size-4" />
                  Preview
                </Button>
              </div>
            </div>
          ) : null}

          {step === "preview" ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Subject
                </p>
                <p className="mt-1 font-medium">{subject}</p>
                <div
                  className="mt-4 rounded-md border bg-white p-5"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("edit")}
                >
                  <ArrowLeft className="size-4" />
                  Back & edit
                </Button>
                <Button type="button" onClick={() => setStep("review")}>
                  Continue to review
                </Button>
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                Confirm before sending. This email will go out from the dashboard
                via Resend — no Gmail/Outlook window.
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Recipients</dt>
                  <dd className="font-semibold">{recipientCount} total</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">To</dt>
                  <dd>{to.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">CC</dt>
                  <dd>{cc.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">BCC</dt>
                  <dd>{bcc.join(", ") || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Subject</dt>
                  <dd className="font-medium">{subject}</dd>
                </div>
              </dl>
              <div
                className="rounded-md border bg-white p-5"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("edit")}
                >
                  Back & edit
                </Button>
                <Button type="button" variant="ghost" onClick={resetFlow}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  loading={busy}
                  onClick={() => void sendEmailNow()}
                >
                  <Send className="size-4" />
                  Send email
                </Button>
              </div>
            </div>
          ) : null}

          {step === "result" ? (
            <div className="space-y-4">
              {sendError ? (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <XCircle className="mt-0.5 size-5 text-destructive" />
                  <div>
                    <p className="font-semibold">Email failed to send</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sendError}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-900">
                      Email sent successfully
                    </p>
                    <p className="mt-1 text-sm text-emerald-800/80">
                      Saved against the client
                      {selectedQuoteId ? ` and quote ${selectedQuoteId}` : ""}.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {sendError && lastMessage ? (
                  <Button
                    type="button"
                    loading={busy}
                    onClick={() => void sendEmailNow(lastMessage.id)}
                  >
                    <RefreshCw className="size-4" />
                    Retry send
                  </Button>
                ) : null}
                <Button type="button" variant="outline" onClick={resetFlow}>
                  Compose another
                </Button>
                {sendError ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("edit")}
                  >
                    Back & edit
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Mail className="size-4 text-accent" />
              Brand signature
            </p>
            {brandingQuery.isLoading ? (
              <div className="mt-3">
                <Spinner label="Loading branding" />
              </div>
            ) : brandingQuery.data ? (
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {brandingQuery.data.companyName}
                </p>
                <p>{brandingQuery.data.tagline}</p>
                <p>{brandingQuery.data.contactEmail}</p>
                <p>{brandingQuery.data.contactPhone}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <History className="size-4 text-accent" />
              Email history
            </p>
            {historyQuery.isLoading ? (
              <div className="mt-3">
                <Spinner label="Loading history" />
              </div>
            ) : (historyQuery.data?.length ?? 0) === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Sent emails for this client will appear here.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {(historyQuery.data ?? []).slice(0, 8).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-medium">{item.subject}</p>
                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                          item.status === "sent" &&
                            "bg-emerald-100 text-emerald-800",
                          item.status === "failed" &&
                            "bg-destructive/10 text-destructive",
                          item.status === "draft" &&
                            "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.toRecipients.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.sentAt ?? item.createdAt).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {brandingOpen && brandingQuery.data ? (
        <BrandingDialog
          key={brandingQuery.data.updatedAt ?? "branding"}
          open={brandingOpen}
          onOpenChange={setBrandingOpen}
          initial={brandingQuery.data}
          onSaved={() => {
            void queryClient.invalidateQueries({
              queryKey: ["client-email-branding"],
            });
          }}
        />
      ) : null}
    </div>
  );
}
