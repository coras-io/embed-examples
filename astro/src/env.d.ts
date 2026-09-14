/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_HOST?: string;
  readonly PUBLIC_DISTRIBUTOR_ID?: string;
  readonly PUBLIC_ASSETS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
