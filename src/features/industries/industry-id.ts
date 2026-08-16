export function industryId(name: string) {
  return `industry-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
