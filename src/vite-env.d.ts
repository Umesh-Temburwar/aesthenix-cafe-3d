/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_APP_TAGLINE?: string;
  readonly VITE_AGENCY_NAME?: string;
  readonly VITE_AGENCY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
