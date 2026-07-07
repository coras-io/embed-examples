/**
 * Last landing-page location the user looked at, persisted in `localStorage`.
 *
 * The URL stays the source of truth for the current view (shareable, deep
 * linkable, back/forward works). This is purely a fallback so the landing
 * page can restore the previous selection when the user returns via a link
 * that does not carry country/city — instead of falling back to geolocation
 * and silently resetting their choice.
 */

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
    // Storage quota exceeded or disabled — silently skip.
  }
}

/**
 * Seed landing params from the stored last location only when the URL carries
 * neither country nor city. URL-supplied values always win so shared links and
 * back/forward keep working.
 */
export function withStoredLocation(
  params: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const current = params ?? {};
  if (current.country || current.city) return current;
  const stored = getLastLocation();
  return stored ? { ...current, ...stored } : current;
}
