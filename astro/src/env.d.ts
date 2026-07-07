/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Coras API origin. Defaults to the public sandbox backend. */
  readonly PUBLIC_API_HOST?: string;
  /** Distributor id. Defaults to the shared example distributor. */
  readonly PUBLIC_DISTRIBUTOR_ID?: string;
  /** SDK shared-asset base. Defaults to the public Coras CDN (`…/shared`). */
  readonly PUBLIC_ASSETS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
