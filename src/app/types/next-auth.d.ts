import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      departmentId: number | null;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User extends DefaultUser {
    role: string;
    departmentId: number | null;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    departmentId: number | null;
    accessToken: string;
  }
}