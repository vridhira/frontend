import { NextRequest, NextResponse } from "next/server"

/**
 * MINIMAL middleware - no API calls, no fetching, just pass through
 * Regions will be loaded client-side by pages
 */
export function middleware(request: NextRequest) {
  // Pass through all requests - no routing logic, no region fetching
  // The pages will handle region selection when they load
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
