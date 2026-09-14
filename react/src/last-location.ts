const STORAGE_KEY = "coras-last-location";

export type LastLocation = { country?: string; city?: string };

export function getLastLocation(): LastLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastLocation;
    return parsed.country || parsed.city ? parsed : null;
  } catch {
    return null;
  }
}

export function setLastLocation(value: LastLocation): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage disabled; the stored hint is optional.
  }
}

export function withStoredLocation(
  params: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const current = params ?? {};
  if (current.country || current.city) return current;
  const stored = getLastLocation();
  return stored ? { ...current, ...stored } : current;
}
