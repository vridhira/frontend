/**
 * Client-side backend URL resolution for use in browser code.
 * Uses NEXT_PUBLIC_ prefixed env vars that are inlined during build.
 */

const FALLBACK_BACKEND_URL = "http://localhost:9000"

const CLIENT_BACKEND_URL_ENV_KEYS = [
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_BACKEND_URL",
  "NEXT_PUBLIC_API_URL",
] as const

type ClientBackendUrlResolution = {
  url: string
  source: string
}

const normalizeBackendUrl = (value: string): string => {
  return value.replace(/\/+$/, "")
}

export const resolveClientBackendUrl = (): ClientBackendUrlResolution => {
  for (const key of CLIENT_BACKEND_URL_ENV_KEYS) {
    const value = process.env[key]

    if (typeof value === "string" && value.trim().length > 0) {
      return {
        url: normalizeBackendUrl(value.trim()),
        source: key,
      }
    }
  }

  return {
    url: FALLBACK_BACKEND_URL,
    source: "fallback",
  }
}

export const getClientBackendUrl = (): string => resolveClientBackendUrl().url
