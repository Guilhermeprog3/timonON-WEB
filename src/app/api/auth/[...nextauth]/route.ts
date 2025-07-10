import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { Admin } from "@/app/types/user";

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
            (await cookies()).set("JWT", userToken);

            return {
              id: userAdmin.id.toString(),
              name: userAdmin.name,
              email: userAdmin.email,
              role: userAdmin.role,
              departmentId: userAdmin.departmentId,
              accessToken: userToken, // ✅ ESSENCIAL para tipagem estendida
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
        token.role = user.role;
        token.departmentId = user.departmentId;
        token.accessToken = user.accessToken; // ✅ para manter na session
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.departmentId = token.departmentId;
      }
      session.accessToken = token.accessToken; // ✅ para acesso no client
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };