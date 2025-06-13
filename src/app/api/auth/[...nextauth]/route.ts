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

        try {
            const res = await fetch(`https://infra-timon-on.onrender.com/admin/login`, {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-type": "application/json" },
            });
            
            if (!res.ok) {
              console.error("Falha no login com o backend:", res.status);
              return null;
            }

            const responseJson = await res.json();
            
            if (responseJson.token) {
              (await cookies()).set("JWT", responseJson.token);
              
              return {
                id: credentials.email,
                email: credentials.email,
              };
            }
        } catch (error) {
            console.error("Erro na função authorize:", error);
            return null;
        }

        return null;
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
});

export { handlerAuth as GET, handlerAuth as POST }