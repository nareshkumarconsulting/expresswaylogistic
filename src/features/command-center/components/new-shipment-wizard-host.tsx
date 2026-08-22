"use client";

import { useQuery } from "@tanstack/react-query";
import { NewShipmentWizard } from "@/features/command-center/components/new-shipment-wizard";
import type { Forwarder } from "@/types";

async function fetchForwarders(): Promise<Forwarder[]> {
  const res = await fetch("/api/forwarders");
  const json = (await res.json()) as { success: boolean; data: Forwarder[] };
  if (!res.ok || !json.success) return [];
  return json.data;
}

export function NewShipmentWizardHost() {
  const { data: forwarders = [] } = useQuery({
    queryKey: ["forwarders"],
    queryFn: fetchForwarders,
    staleTime: 60_000,
  });

  return <NewShipmentWizard forwarders={forwarders} />;
}
