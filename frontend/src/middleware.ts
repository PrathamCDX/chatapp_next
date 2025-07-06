import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  //   return NextResponse.redirect(new URL("/", req.url));
  //   return NextResponse.next();

  if (!token) {
    console.log("No token found");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const encodedSecret = new TextEncoder().encode(secret);
    const jwtRes = await jwtVerify(token!, encodedSecret);
    if (jwtRes.payload.username !== req.nextUrl.pathname.split("/")[2]) {
      console.log("Token does not match the requested username");
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("✅ Token is valid");
    console.log(jwtRes);
    return NextResponse.next();
  } catch (err) {
    console.log("❌ Invalid token:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/", "/user/:userId"],
};
