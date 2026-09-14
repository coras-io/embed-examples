import {
  mount,
  type CorasApp,
  type CorasNavigateDetail,
  type CorasStateChangeDetail,
} from "@coras-io/embed";
import { buildConfig, chrome, corasUrl, TICKETS_BASE } from "./coras.ts";

const main = document.getElementById("app")!;

let app: CorasApp | null = null;

function inTickets(path: string): boolean {
  return path === TICKETS_BASE || path.startsWith(`${TICKETS_BASE}/`);
}

function teardownCoras(): void {
  if (!app) return;
  app.unmount();
  app = null;
}

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
    strict: true,
    page,
    params,
    config: buildConfig(),
    chrome,
    onNavigate: (intent) => syncCoras(intent, false),
    onStateChange: (state) => syncCoras(state, true),
  });
}

function route(): void {
  const path = location.pathname;
  if (inTickets(path)) renderTickets(location.href);
  else renderHostPage(path);
  syncActiveNav(path);
}

function syncActiveNav(path: string): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "a[data-link]",
  )) {
    const href = link.getAttribute("href") ?? "";
    const active = href === TICKETS_BASE ? inTickets(path) : href === path;
    link.classList.toggle("active", active);
  }
}

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

addEventListener("popstate", route);

route();
