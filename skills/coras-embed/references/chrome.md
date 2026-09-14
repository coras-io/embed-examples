<!-- Generated from apps/docs/src/content/docs/reference/chrome.mdx by scripts/sync-skill-references.mjs. Do not edit. -->

# Chrome
The `chrome` option controls the navbar and footer that `mount()` renders around
the page. By default `mount()` renders only the page. Set `chrome` to add the
Coras navbar and footer, supply your own elements per slot, or mix the two.

`update({ chrome })` replaces the chrome on an already-mounted app.

## Type

```ts
type CorasChrome = false | "managed" | CorasChromeOptions;

type CorasChromeOptions = {
  navbar?: CorasNavbar;
  footer?: CorasFooter;
};

type CorasNavbar =
  | false // no navbar
  | "managed" // Coras default navbar
  | CorasManagedNavbar // Coras navbar + host slots/props
  | HTMLElement // your element
  | (() => HTMLElement | Promise<HTMLElement>); // factory

type CorasFooter =
  | false // no footer
  | "managed" // Coras default footer
  | CorasManagedFooter // Coras footer (no host slots)
  | HTMLElement // your element
  | (() => HTMLElement | Promise<HTMLElement>); // factory

type CorasManagedNavbar = {
  use: "managed";
  slots?: Partial<Record<CorasNavbarSlotName, HTMLElement>>;
  props?: CorasNavbarProps;
};

type CorasManagedFooter = {
  use: "managed";
};

// Region names, RTL-safe (logical start/end).
type CorasNavbarSlotName =
  | "brand"
  | "nav"
  | "actions-start"
  | "actions-end"
  | "search";

// Feature toggles; an omitted key keeps the navbar default (control shown).
type CorasNavbarProps = {
  searchOnly?: boolean; // mode, not a toggle (see searchOnly)
  showLanguageSelector?: boolean;
  showCurrencySelector?: boolean;
  showBasket?: boolean;
  showSearch?: boolean;
  logoHref?: string; // link the logo at your main site instead of the landing page
};
```

## Top-level values

`chrome` accepts one of three values.

| Value                | Result                                             |
| -------------------- | -------------------------------------------------- |
| omitted or `false`   | No chrome. The page renders alone.                 |
| `"managed"`          | Coras default navbar and footer.                   |
| `CorasChromeOptions` | Set the `navbar` and `footer` slots independently. |

```ts
mount({ container, page, config }); // no chrome (default)
mount({ container, page, config, chrome: "managed" }); // Coras navbar + footer
mount({ container, page, config, chrome: false }); // explicit none
```

```ts
mount({
  container,
  page,
  config,
  chrome: { navbar: "managed", footer: false },
});
```

An omitted `navbar` or `footer` key inside `CorasChromeOptions` defaults to
`false` (that slot is not rendered).

`chrome: false` is how you embed Coras pages into an app that already has its own
navbar and footer - Coras renders the page alone, inside your layout. Use
`"managed"` for a standalone Coras site, where Coras owns the whole page. See
[Layout & styling](/getting-started/frameworks/#layout--styling) for the two
modes.

## Slot values

Each slot (`navbar`, `footer`) accepts the same shapes. The footer accepts the
same shapes as the navbar except that its managed object form
(`CorasManagedFooter`) takes no `slots` or `props`.

| Value                                       | Behavior                                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `false`                                     | The slot is not rendered.                                                                                 |
| `"managed"`                                 | The SDK lazy-loads and inserts the Coras element (`coras-navbar` or `coras-footer`) with default content. |
| `{ use: "managed", … }`                     | Coras element with host-projected slot content and, for the navbar, feature toggles.                      |
| `HTMLElement`                               | Your element is used as-is.                                                                               |
| `() => HTMLElement \| Promise<HTMLElement>` | Factory called on each page mount. Return value (or resolved value) is used.                              |

### Managed object: slots and props

`{ use: "managed", slots, props }` renders the Coras navbar with host content
projected into its named slots and optional feature toggles. For each entry in
`slots`, the SDK sets the child's `slot` attribute and appends it to the chrome
element. The SDK applies `props` as element properties on the navbar. A slot
with no host content stays blank.

```ts
const logo = document.createElement("img");
logo.src = "/logo.svg";

mount({
  container,
  page,
  config,
  chrome: {
    navbar: { use: "managed", slots: { brand: logo } },
    footer: "managed",
  },
});
```

The navbar sizes a brand logo by height with intrinsic width, so any aspect
ratio stays crisp - you do not need to style the element yourself. Adjust the
size by setting `--navbar-logo-height` (default `2rem`, smaller below `800px`)
or `--navbar-logo-max-width` (default `11.25rem`) on the navbar.

If you do not slot a `brand` element but set `config.theme.logo`, the managed
navbar renders that URL as the default logo. A slotted `brand` always wins, so
provide one when you need a link wrapper, custom markup, or your own `alt` text.

Use `props` to hide built-in controls, for example when you replace one with
your own slot content. The toggles are element properties, so default-on
controls can be switched off:

```ts
mount({
  container,
  page,
  config,
  chrome: {
    navbar: {
      use: "managed",
      props: {
        showLanguageSelector: false,
        showCurrencySelector: false,
        showSearch: false,
      },
      slots: {
        brand: logo,
        "actions-start": accountMenu, // before the basket
        search: customSearch, // replaces the built-in search
      },
    },
    footer: "managed",
  },
});
```

### Direct element

```ts
const myNav = document.createElement("nav");
myNav.textContent = "Custom nav";
mount({ container, page, config, chrome: { navbar: myNav } });
```

### Factory

The factory runs on each page mount. It can be synchronous or asynchronous. Use
it when the navbar or footer needs per-page state.

```ts
mount({
  container,
  page,
  config,
  chrome: {
    navbar: () => buildNavbar({ currentPage: page }),
  },
});
```

The SDK rebuilds chrome on each page change, so factories run again and the
navbar and footer stay bound to the current page. `update({ chrome })` also
rebuilds chrome, so a factory passed to `update` runs again then.

## Navbar slots

`CorasNavbarSlotName` lists the regions you can fill through
`{ use: "managed", slots: { … } }`. Names describe the region you own, not the
internal control beside it, and use logical `start`/`end` so they stay correct
under right-to-left layout.

The regions lay out from the leading to the trailing edge, with built-in
controls interleaved:

```
[ brand | nav | language/currency | actions-start | basket | actions-end | search ]
```

| Slot            | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `brand`         | Top-leading brand mark, commonly an `<img>` or `<a><img></a>`. |
| `nav`           | Primary navigation, after the brand.                           |
| `actions-start` | Leading edge of the utility cluster, before the basket.        |
| `actions-end`   | Trailing edge of the utility cluster, before search.           |
| `search`        | Replaces the built-in search. Set `props.showSearch: false`.   |

Unspecified slots stay blank. Injected content stays in the top bar on mobile;
only the Coras language, currency, and search controls collapse into the menu
drawer.

`nav`, `actions-start`, and `actions-end` keep whatever width your element asks
for: a control is sized by its own label, and squeezing one wraps that label
inside its own box. When the bar runs out of room, `search` gives the width up
instead, so keep the element you put there flexible and size a control you
cannot afford to lose against the narrowest bar you support.

## Navbar props

`CorasNavbarProps` configures the built-in navbar. An omitted `show*` key keeps
the default, which shows the control.

| Prop                   | Type      | Default | Effect                                                      |
| ---------------------- | --------- | ------- | ----------------------------------------------------------- |
| `searchOnly`           | `boolean` | `false` | Render the minimal navbar (brand + search). See note below. |
| `showLanguageSelector` | `boolean` | `true`  | Show the language selector.                                 |
| `showCurrencySelector` | `boolean` | `true`  | Show the currency selector.                                 |
| `showBasket`           | `boolean` | `true`  | Show the basket.                                            |
| `showSearch`           | `boolean` | `true`  | Show the built-in search.                                   |
| `logoHref`             | `string`  | unset   | Link the brand logo at this URL. See below.                 |

`logoHref` is for a booking site that sits beside a main website. Set it and the
logo becomes a plain link there, the way it behaves on the main site. Leave it
unset and the logo stays a button that emits a `landing` navigation for your
router to handle. Only `https:` and same-origin URLs are honoured; anything else
is ignored. A slotted `brand` element owns its own navigation, so `logoHref`
applies to the default logo only.

```ts
mount({
  container,
  page,
  config,
  chrome: {
    navbar: { use: "managed", props: { logoHref: "https://example.com" } },
    footer: "managed",
  },
});
```

`searchOnly` is a mode, not a toggle. When `true`, it swaps in the minimal brand
and search bar, takes precedence over the `show*` flags, and ignores the `nav`,
`actions-start`, and `actions-end` slots. The `brand` slot is still rendered
(and `search`, being the mode itself). The basket is not shown, so `showBasket`
has no effect in this mode.

## Footer

`coras-footer` has no named slots. The managed footer always renders the Coras
footer menu. Supply your own element through the direct or factory shape if you
need a custom footer.

```ts
// Direct element.
const myFooter = document.createElement("footer");
myFooter.textContent = "© Your Company";
mount({
  container,
  page,
  config,
  chrome: { navbar: "managed", footer: myFooter },
});

// Factory, rebuilt on each page change.
mount({
  container,
  page,
  config,
  chrome: {
    navbar: "managed",
    footer: () => buildFooter({ currentPage: page }),
  },
});
```
