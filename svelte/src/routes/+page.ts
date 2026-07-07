import { redirect } from "@sveltejs/kit";
import { getCurrency, getLocale } from "@coras-io/embed/helpers";

// The root path carries no locale/currency. Detect them from the browser and
// redirect to the canonical `/:locale/:currency` landing URL the SDK expects.
// Runs on the client (`ssr = false`), where `navigator` is available.
export const load = () => {
  const locale = getLocale();
  const currency = getCurrency(locale);
  redirect(307, `/${locale}/${currency}`);
};
