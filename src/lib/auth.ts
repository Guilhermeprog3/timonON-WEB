import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { Admin } from "@/app/types/user";

// Coloque o objeto authOptions aqui e exporte-o
export const authOptions: AuthOptions = {
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        try {
          const res = await fetch(`https://infra-timon-on.onrender.com/admin/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) return null;

          const responseJson = await res.json();
          const userAdmin: Admin = responseJson?.admin;
          const userToken: string = responseJson?.token?.token;

          if (userToken && userAdmin) {
            cookies().set("JWT", userToken);

            return {
              id: userAdmin.id.toString(),
              name: userAdmin.name,
              email: userAdmin.email,
              role: userAdmin.role,
              departmentId: userAdmin.departmentId,
              accessToken: userToken,
            };
          }
        } catch {
          return null;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.departmentId = user.departmentId;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.departmentId = token.departmentId;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};