export const publicRoutes: string[] = [
    "/",   // Homepage must be public so SessionProvider can fetch without redirect loop
]

export const protectedRoutes: string[] = [
    "/",
]

export const authRoutes: string[] = [
    "/auth/sign-in",
]

export const apiAuthPrefix: string = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/";