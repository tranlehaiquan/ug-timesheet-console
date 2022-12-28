/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_SERVER: string
  readonly VITE_API_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
