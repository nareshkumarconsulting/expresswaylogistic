export function processStepId(title: string) {
  return `step-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
