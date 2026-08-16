"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { FormField } from "@/components/molecules/form-field";
import { StateAlert } from "@/components/molecules/state-alert";
import { QUOTE_RESPONSE_STATEMENT } from "@/constants/entity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  quoteFormSchema,
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPES,
  CONTAINER_SIZE_LABELS,
  CONTAINER_SIZES,
  CONTAINER_TYPE_LABELS,
  CONTAINER_TYPES,
  type QuoteFormValues,
} from "@/features/contact/schemas";
import {
  firstErrorFieldPath,
  scheduleScrollToFormField,
} from "@/lib/form-errors";

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      company: "",
      companyAddress: "",
      email: "",
      phone: "",
      origin: "",
      destination: "",
      serviceType: undefined,
      productType: undefined,
      totalPackages: undefined,
      approxWeight: "",
      containerSize: undefined,
      containerType: undefined,
      valueInr: undefined,
      message: "",
    },
  });

  const onInvalid = (formErrors: FieldErrors<QuoteFormValues>) => {
    scheduleScrollToFormField(firstErrorFieldPath(formErrors), {
      form: formRef.current,
    });
  };

  const onSubmit = async (values: QuoteFormValues) => {
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as {
        success: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Unable to submit quote request");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  };

  return (
    <form
      ref={formRef}
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      aria-busy={status === "loading"}
    >
      {status === "success" ? (
        <StateAlert
          variant="success"
          title="Quote request received"
          description={QUOTE_RESPONSE_STATEMENT}
        />
      ) : null}
      {status === "error" ? (
        <StateAlert
          variant="error"
          title="Submission failed"
          description={errorMessage ?? undefined}
          onRetry={() => setStatus("idle")}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Name"
          htmlFor="name"
          required
          error={errors.name?.message}
        >
          <Input {...register("name")} placeholder="John Doe" autoComplete="name" />
        </FormField>
        <FormField
          label="Company"
          htmlFor="company"
          required
          error={errors.company?.message}
        >
          <Input {...register("company")} placeholder="Acme Industries" />
        </FormField>
      </div>

      <FormField
        label="Company Address"
        htmlFor="companyAddress"
        required
        error={errors.companyAddress?.message}
      >
        <Textarea
          {...register("companyAddress")}
          placeholder="Street, city, state, PIN code"
        />
      </FormField>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Email"
          htmlFor="email"
          required
          error={errors.email?.message}
        >
          <Input
            type="email"
            {...register("email")}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </FormField>
        <FormField
          label="Phone"
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <Input
            type="tel"
            {...register("phone")}
            placeholder="+91 98736 93160"
            autoComplete="tel"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Origin City/Port"
          htmlFor="origin"
          required
          error={errors.origin?.message}
        >
          <Input {...register("origin")} placeholder="e.g. Mumbai" />
        </FormField>
        <FormField
          label="Destination City/Port"
          htmlFor="destination"
          required
          error={errors.destination?.message}
        >
          <Input {...register("destination")} placeholder="e.g. Dubai" />
        </FormField>
      </div>

      <FormField
        label="Service Type"
        htmlFor="serviceType"
        required
        error={errors.serviceType?.message}
      >
        <Controller
          control={control}
          name="serviceType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="serviceType" aria-invalid={Boolean(errors.serviceType)}>
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="air">Air Freight</SelectItem>
                <SelectItem value="ocean-fcl">Ocean Freight (FCL)</SelectItem>
                <SelectItem value="ocean-lcl">Ocean Freight (LCL)</SelectItem>
                <SelectItem value="consolidation">Consolidation</SelectItem>
                <SelectItem value="door-to-door">Door-to-Door</SelectItem>
                <SelectItem value="customs">Customs Clearance</SelectItem>
                <SelectItem value="warehousing">Warehousing</SelectItem>
                <SelectItem value="project-cargo">Project Cargo</SelectItem>
                <SelectItem value="cargo-insurance">Cargo Insurance</SelectItem>
                <SelectItem value="exim-advisory">EXIM Advisory</SelectItem>
                <SelectItem value="packing">Packing & Handling</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Product Type"
          htmlFor="productType"
          required
          error={errors.productType?.message}
        >
          <Controller
            control={control}
            name="productType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="productType"
                  aria-invalid={Boolean(errors.productType)}
                >
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {PRODUCT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField
          label="Total Packages"
          htmlFor="totalPackages"
          required
          error={errors.totalPackages?.message}
        >
          <Input
            id="totalPackages"
            type="number"
            min={1}
            step={1}
            {...register("totalPackages")}
            placeholder="e.g. 10"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Approx Weight"
          htmlFor="approxWeight"
          required
          error={errors.approxWeight?.message}
        >
          <Input
            {...register("approxWeight")}
            placeholder="e.g. 500 kg or 2.5 MT"
          />
        </FormField>
        <FormField
          label="Value (INR)"
          htmlFor="valueInr"
          required
          error={errors.valueInr?.message}
        >
          <Input
            id="valueInr"
            type="number"
            min={1}
            step={1}
            {...register("valueInr")}
            placeholder="e.g. 150000"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Container Size"
          htmlFor="containerSize"
          error={errors.containerSize?.message}
        >
          <Controller
            control={control}
            name="containerSize"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger
                  id="containerSize"
                  aria-invalid={Boolean(errors.containerSize)}
                >
                  <SelectValue placeholder="Select container size" />
                </SelectTrigger>
                <SelectContent>
                  {CONTAINER_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {CONTAINER_SIZE_LABELS[size]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField
          label="Container Type"
          htmlFor="containerType"
          error={errors.containerType?.message}
        >
          <Controller
            control={control}
            name="containerType"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger
                  id="containerType"
                  aria-invalid={Boolean(errors.containerType)}
                >
                  <SelectValue placeholder="Select container type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTAINER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {CONTAINER_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <FormField
        label="Message / Cargo Details"
        htmlFor="message"
        required
        error={errors.message?.message}
      >
        <Textarea
          {...register("message")}
          placeholder="Weight, dimensions, special requirements..."
        />
      </FormField>

      <Button
        type="submit"
        className="h-12 w-full text-lg"
        rounded="none"
        loading={status === "loading"}
      >
        <Send className="size-5" />
        Request Quote
      </Button>
    </form>
  );
}
