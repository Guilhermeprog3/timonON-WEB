import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { cookies } from "next/headers";

const handlerAuth = NextAuth({
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
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) {
            return null;
        }
        const res = await fetch(`https://infra-timon-on.onrender.com/admin/login`, {
          method: "POST",
          body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          }),
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