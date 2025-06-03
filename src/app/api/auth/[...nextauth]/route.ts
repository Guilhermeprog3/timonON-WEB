import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { cookies } from "next/headers";
import { api } from "@/app/service/server"

export const handlerAuth = NextAuth({
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
      async authorize(credentials: any) {
        const res = await fetch(`${api}/sessao`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-type": "application/json" },
        })
        const responseJson = await res.json();
        if (res.ok) {
          (await cookies()).set("JWT", responseJson.token);
          return responseJson.token;
        }
        return null;
      },
    })
  ],
});

export { handlerAuth as GET, handlerAuth as POST }
