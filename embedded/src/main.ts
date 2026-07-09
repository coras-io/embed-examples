import {
  mount,
  type CorasApp,
  type CorasNavigateDetail,
  type CorasStateChangeDetail,
} from "@coras-io/embed";
import { buildConfig, chrome, corasUrl, TICKETS_BASE } from "./coras.ts";

// The host's content region. The navbar and footer in index.html are the host's
// own chrome and stay on every route; only this element's contents change. Coras
// renders no navbar or footer of its own - that is what `chrome: false` means.
const main = document.getElementById("app")!;

// One persistent Coras mount, alive only while the tickets sub-tree is showing.
let app: CorasApp | null = null;

// True for the sub-tree Coras owns: `/tickets` and anything under it.
function inTickets(path: string): boolean {
  return path === TICKETS_BASE || path.startsWith(`${TICKETS_BASE}/`);
}

// Tear the mount down when navigating away from the tickets sub-tree.
function teardownCoras(): void {
  if (!app) return;
  app.unmount();
  app = null;
}

// The host's own pages, rendered straight into <main>. A real app would use its
// framework here; this example keeps them as plain markup to stay dependency-free.
function renderHostPage(path: string): void {
  teardownCoras();
  main.innerHTML =
    path === "/about"
      ? `<article class="host-page">
           <h1>About Riverside Live</h1>
           <p>An independent venue on the water. This page is the host app's own
              content - Coras is not involved here.</p>
         </article>`
      : `<article class="host-page">
           <h1>What's on</h1>
           <p>Live music and events all year round.
              <a href="${TICKETS_BASE}" data-link>Browse tickets →</a></p>
         </article>`;
}

// Reflect a Coras navigation intent (a link/selection) or an in-page state
// change (a filter, say) into the host URL under `/tickets`, then back into the
// mount. A navigation pushes a history entry; a state change replaces the
// current one. `update` re-renders without re-emitting, so there is no loop. An
// intent carrying an external `href` opens in a new tab instead.
function syncCoras(
  detail: CorasNavigateDetail | CorasStateChangeDetail,
  replace: boolean,
): void {
  if ("href" in detail && detail.href) {
    window.open(detail.href, "_blank", "noopener,noreferrer");
    return;
  }
  const to = corasUrl.build({ page: detail.page, params: detail.params ?? {} });
  history[replace ? "replaceState" : "pushState"](null, "", to);
  const next = corasUrl.parse(to);
  app?.update({ page: next.page, params: next.params });
}

// Mount Coras into <main> for a tickets URL, or update the live mount in place.
// The mount is created once and kept in sync with the URL via update().
function renderTickets(href: string): void {
  const { page, params } = corasUrl.parse(href);
  if (app) {
    app.update({ page, params });
    return;
  }
  main.replaceChildren();
  const target = document.createElement("div");
  main.append(target);
  app = mount({
    container: target,
    page,
    params,
    config: buildConfig(),
    chrome,
    // A navigation (link/selection) pushes a new URL; an in-page state change
    // (e.g. a filter) replaces the current one. Both reflect back into the mount.
    onNavigate: (intent) => syncCoras(intent, false),
    onStateChange: (state) => syncCoras(state, true),
  });
}

// The host router: tickets URLs render Coras, everything else is a host page.
function route(): void {
  const path = location.pathname;
  if (inTickets(path)) renderTickets(location.href);
  else renderHostPage(path);
  syncActiveNav(path);
}

// Highlight the active top-level nav link (the tickets link stays active across
// the whole sub-tree).
function syncActiveNav(path: string): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "a[data-link]",
  )) {
    const href = link.getAttribute("href") ?? "";
    const active = href === TICKETS_BASE ? inTickets(path) : href === path;
    link.classList.toggle("active", active);
  }
}

// Intercept clicks on the host's own links for client-side navigation. Coras's
// internal links never reach here - they arrive as `onNavigate` intents above.
addEventListener("click", (event) => {
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
    "a[data-link]",
  );
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href) return;
  event.preventDefault();
  if (href !== location.pathname + location.search) {
    history.pushState(null, "", href);
  }
  route();
});

// Back / forward: re-read the URL and re-render the matching view.
addEventListener("popstate", route);

route();
