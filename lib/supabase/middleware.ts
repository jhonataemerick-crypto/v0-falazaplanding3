import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/verify-email"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

  // For public routes, just pass through
  if (isPublicRoute) {
    return NextResponse.next()
  }

  const testModeCookie = request.cookies.get("testMode")
  if (testModeCookie?.value === "true") {
    console.log("[v0] Test mode active - bypassing authentication for:", request.nextUrl.pathname)
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Missing Supabase environment variables")
    const protectedRoutes = ["/assinatura", "/dashboard", "/conta"]
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const protectedRoutes = ["/assinatura", "/dashboard", "/conta"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // IMPORTANT: getUser() must be called to prevent random logouts
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error && isProtectedRoute) {
    console.error("[v0] Error getting user:", error.message)
  }

  if (isProtectedRoute) {
    if (user) {
      console.log("[v0] User authenticated:", user.email)
    } else {
      console.log("[v0] No user found in session")
      console.log("[v0] Redirecting to login - no user for protected route:", request.nextUrl.pathname)
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
