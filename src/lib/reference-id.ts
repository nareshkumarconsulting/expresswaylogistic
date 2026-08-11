export function createQuoteReferenceId(): string {
  return `QW-${Date.now().toString(36).toUpperCase()}`;
}

export function createAppointmentReferenceId(): string {
  return `AP-${Date.now().toString(36).toUpperCase()}`;
}
