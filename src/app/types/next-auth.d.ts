import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      departmentId: number | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    departmentId: number | null;
  }
}

declare module "next-auth/jwt" {

  interface JWT extends DefaultJWT {
    role: string;
    departmentId: number | null;
  }
}
