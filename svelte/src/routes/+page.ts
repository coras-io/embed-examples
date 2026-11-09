import { redirect } from "@sveltejs/kit";
import { getLocale } from "@coras-io/embed/helpers";

// The currency is the locale's default, so the URL does not name it.
export const load = () => {
  redirect(307, `/${getLocale().toLowerCase()}`);
};
