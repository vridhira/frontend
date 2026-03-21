/**
 * Build-time aware fetch utility
 * Uses shorter timeouts during build to allow graceful fallback to dynamic rendering
 */

const PRODUCTION_TIMEOUT = 30000 // 30s in production
const BUILD_TIMEOUT = 5000 // 5s during build

const isBuildTime = (): boolean => {
  return !!(
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === "phase-3lib" // Next.js build phase
  )
}

export const getBuildTimeout = (): number => {
  return isBuildTime() ? BUILD_TIMEOUT : PRODUCTION_TIMEOUT
}

export const withBuildTimeout = async <T>(
  fetchPromise: Promise<T>,
  operation: string = "fetch"
): Promise<T> => {
  const timeout = getBuildTimeout()
  
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `${operation} timeout after ${timeout}ms during ${
            isBuildTime() ? "build" : "runtime"
          }`
        )
      )
    }, timeout)

    fetchPromise
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}
