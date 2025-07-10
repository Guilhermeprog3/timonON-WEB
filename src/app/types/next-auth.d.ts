// src/app/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      departmentId: number | null;
    } & DefaultSession["user"];
    accessToken: string; // ✅ incluído
  }

  interface User extends DefaultUser {
    role: string;
    departmentId: number | null;
    accessToken: string; // ✅ incluído
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    departmentId: number | null;
    accessToken: string; // ✅ incluído
  }
}
