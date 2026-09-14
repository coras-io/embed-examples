import { redirect } from "@sveltejs/kit";
import { getCurrency, getLocale } from "@coras-io/embed/helpers";

export const load = () => {
  const locale = getLocale();
  const currency = getCurrency(locale);
  redirect(307, `/${locale}/${currency}`);
};
