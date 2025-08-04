// src/middleware.ts (or ./middleware.ts if not using src/)
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - public files
     */
    "/((?!_next|.*\\..*|favicon.ico).*)",
  ],
};
