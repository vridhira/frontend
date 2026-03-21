const FALLBACK_BACKEND_URL = "http://localhost:9000"

const BACKEND_URL_ENV_KEYS = [
  "MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
  "NEXT_PUBLIC_BACKEND_URL",
  "BACKEND_URL",
  "NEXT_PUBLIC_API_URL",
] as const

type BackendUrlResolution = {
  url: string
  source: string
}

const normalizeBackendUrl = (value: string) => {
  return value.replace(/\/+$/, "")
}

export const resolveBackendUrl = (): BackendUrlResolution => {
  for (const key of BACKEND_URL_ENV_KEYS) {
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

export const getBackendUrl = () => resolveBackendUrl().url
