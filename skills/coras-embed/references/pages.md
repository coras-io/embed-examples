<!-- Generated from apps/docs/src/content/docs/reference/pages.mdx by scripts/sync-skill-references.mjs. Do not edit. -->

# Pages and params
You can mount six pages. Each page has a typed param shape. All params are
optional; the SDK applies only the keys you pass. Provide params through
`mount({ params })` or `app.update({ params })`.

Dropping a param, or passing it as an empty string, clears it back to the page
default. This matters when you echo `coras:state-change` back into
`app.update()`: a page reports its whole param set, including the fields the
visitor has just cleared.

```ts
import { mount, type CorasPageParamsByPage } from "@coras-io/embed";

mount({ container, page: "landing", config, params: { city: "dublin" } });
```

> `mount()` ignores unknown param keys by default. Pass `strict: true` to reject
>   them: an unknown key then throws `CorasValidationError` with code
>   `unknown_key`. See [Strict mode](/reference/config/#strict-mode).

## `landing`

```ts
type CorasLandingPageParams = {
  country?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  duration?: string;
  price?: string;
  categories?: string;
};
```

| Param                   | Format       | Notes                                                      |
| ----------------------- | ------------ | ---------------------------------------------------------- |
| `country`               | slug         | For example `"ireland"`. Filters listings to this country. |
| `city`                  | slug         | For example `"dublin"`. Narrower than `country`.           |
| `startDate` / `endDate` | `YYYY-MM-DD` | ISO date strings. Range filter.                            |
| `sort`                  | string       | Distributor-defined sort key.                              |
| `duration`              | string       | Distributor-defined duration bucket.                       |
| `price`                 | string       | Distributor-defined price bucket.                          |
| `categories`            | string       | Comma-separated category slugs.                            |

Changing any of these in-page fires `coras:state-change`. Selecting a result
fires `coras:navigate` to `details`.

> Valid values for `sort`, `duration`, `price`, and `categories` depend on the
>   inventory configured for your `distributorId`. Read them from the filters the
>   landing page renders rather than hard-coding them.

## `search`

```ts
type CorasSearchPageParams = {
  search?: string;
  startDate?: string;
};
```

| Param       | Format       | Notes                 |
| ----------- | ------------ | --------------------- |
| `search`    | string       | Free-text query.      |
| `startDate` | `YYYY-MM-DD` | Optional date filter. |

Changing `search` or `startDate` in-page fires `coras:state-change`. Selecting a
result fires `coras:navigate` to `details`.

## `details`

```ts
type CorasDetailsPageParams = {
  id?: string; // public attraction id (maps to internal `attraction-id`)
  date?: string; // YYYY-MM-DD
};
```

| Param  | Format       | Notes                                                                                                   |
| ------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| `id`   | string       | Public attraction id. Required for the page to render content. Must be a non-empty string when present. |
| `date` | `YYYY-MM-DD` | Selected date. Defaults to today.                                                                       |

Date changes fire `coras:state-change`. A successful booking fires
`coras:reservation-created`, and the page navigates to `payment`.

> You get the `id` from the params of the `coras:navigate` event emitted when a
>   user selects a result on the landing or search page - route straight to it, no
>   independent lookup needed.

## `payment`

```ts
type CorasPaymentPageParams = {
  metadata?: Record<string, string>; // arbitrary client data; stored and echoed back
};
```

| Param      | Format                   | Notes                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metadata` | `Record<string, string>` | Arbitrary client key/value data forwarded to and stored by the API, then returned when the order is read back (for example a user id, analytics ids, or a loyalty-card number). Coras does not interpret it. Every value must be a string. This is host context, not shareable URL state, so the `@coras-io/embed/url` helpers do not round-trip it. Supply it to `mount()` directly. |

The page fires `coras:payment-status` with `succeeded` or `failed`, or with
`pending` when the charge succeeded but the API had not confirmed the
transaction within the polling budget (the customer is shown a "confirming
your payment" state and the `reference` lets you reconcile it later). There is
no cancelled status: cancelling returns the form to its editable state rather
than emitting.

## `help`

```ts
type CorasHelpPageParams = {
  content?: string; // e.g. "faq-attractions", "contact", "privacy-policy"
};
```

| Param     | Format | Notes                                                                                              |
| --------- | ------ | -------------------------------------------------------------------------------------------------- |
| `content` | string | Help content identifier. Switching tabs in-page fires `coras:state-change` with the new `content`. |

The `content` values shown above (`faq-attractions`, `contact`,
`privacy-policy`) are illustrative, not exhaustive - for example there are
further FAQ topics such as `faq-music`. `content` is an open string; the
available identifiers depend on the help content configured for your
`distributorId`.

External links inside help content fire `coras:navigate` with `href`.

## `suggestion-widget`

A standalone recommendations embed. It is not a routable page; mount it directly
in the host page.

```ts
type CorasSuggestionWidgetParams = {
  limit?: number; // > 0
  showExploreCard?: boolean;
  country?: string;
  city?: string;
};
```

| Param              | Format     | Notes                                                                                                |
| ------------------ | ---------- | ---------------------------------------------------------------------------------------------------- |
| `limit`            | number > 0 | Maximum number of suggestions to render. Must be a positive number when present.                     |
| `showExploreCard`  | boolean    | Append an "explore" card that links to the full landing page. On by default; set `false` to hide it. |
| `country` / `city` | slug       | Geographic scope for suggestions, and the explore card's image and target.                           |

Selecting a suggestion fires `coras:navigate` to `details` or `landing`.

## `chrome-only`

The managed chrome around a page you own, with no Coras page inside it. Mount it
for your own routes so they carry the same navbar, footer and basket as the
embedded ones, instead of a second navbar you keep in step by hand. It takes no
params and is not routable: your router owns the URL, and `buildCorasUrl` rejects
it.

Your markup goes in `content`, an element you create and render into. Hold one
element for the life of the mount and the SDK re-parents it as pages change, so
whatever you have drawn into it survives.

```ts
const content = document.createElement("div");

const app = mount({
  container,
  page: "chrome-only",
  config,
  chrome: { navbar: { use: "managed" }, footer: "managed" },
  content,
});

// Your own route later, in the same mount: the chrome is untouched.
app.update({ page: "details", params: { id } });
```

Unlike a Coras page, the content region carries no width, padding or spacing of
its own: it is yours to lay out, full-bleed if you want it.

`content` is ignored by every other page, so one mount can alternate between
your routes and embedded ones without rebuilding the chrome's configuration.

## Validation

Pass `strict: true` to reject unknown param keys. Without it, `mount()` ignores
them.

```ts
import { CorasValidationError } from "@coras-io/embed";

try {
  mount({
    container,
    page: "details",
    config,
    params: { id: "abc", oops: 1 },
    strict: true,
  });
} catch (e) {
  if (e instanceof CorasValidationError) {
    e.code; // "unknown_key"
    e.field; // "params.oops"
  }
}
```

Shape errors throw regardless of strict mode. For example, an empty
`details.id` or a non-positive `suggestion-widget.limit` throws
`CorasValidationError` with code `invalid_page_params`.

See [Config](/reference/config/#error-codes) for the full error-code list.
