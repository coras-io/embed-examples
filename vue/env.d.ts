/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Coras API origin. Defaults to the public sandbox backend. */
  readonly VITE_API_HOST?: string;
  /** Distributor id. Defaults to the shared example distributor. */
  readonly VITE_DISTRIBUTOR_ID?: string;
  /** SDK shared-asset base. Defaults to the public Coras CDN (`…/shared`). */
  readonly VITE_ASSETS_URL?: string;
  /** Comma-separated extra hosts allowed by the dev server. */
  readonly VITE_ALLOWED_HOSTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
