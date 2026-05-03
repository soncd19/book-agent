import { NextResponse, type NextRequest } from "next/server";

function unauthorized(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MD Truyen Admin"'
    }
  });
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    return new NextResponse("Missing ADMIN_USER or ADMIN_PASSWORD", { status: 503 });
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Basic ")) {
    return unauthorized();
  }

  let user = "";
  let password = "";

  try {
    [user, password] = atob(authorization.slice(6)).split(":");
  } catch {
    return unauthorized("Invalid credentials");
  }

  if (user !== adminUser || password !== adminPassword) {
    return unauthorized("Invalid credentials");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
