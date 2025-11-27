/// <reference types="dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_API_BASE_URL?: string;
  }
}

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
