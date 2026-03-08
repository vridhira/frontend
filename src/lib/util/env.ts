export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
}

export const getBackendURL = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "https://localhost:9000"
}
