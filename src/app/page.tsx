"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, SignInResponse } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
})

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")

    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message)
      return
    }

    const res: SignInResponse | undefined = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setErrorMsg("Credenciais incorretas")
    } else {
      router.push("/home")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <Card className="w-full max-w-md border border-yellow-500">
        <CardHeader className="space-y-1 text-center rounded-t-lg border-b-4 border-yellow-500 bg-[#291F75] text-white p-6">
          <div className="flex justify-center mb-4 h-20 relative">
            <Image
              src="/assets/prefeitura-logo.png"
              alt="Logo da Prefeitura"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-3xl">Login</CardTitle>
          <CardDescription className="text-yellow-400 text-lg">
            Insira seu email e senha
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 pb-6 bg-white px-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            {errorMsg && (
              <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="mt-4 w-full">
              Entrar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center bg-white pb-6">
          <Link href="/reset" className="text-md text-[#291F75] hover:underline">
            Esqueci minha senha
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}