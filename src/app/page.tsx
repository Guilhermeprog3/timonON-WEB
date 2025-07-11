"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, SignInResponse } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { z } from "zod"
import { LogIn, Loader2, Eye, EyeOff } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")
    setIsLoading(true)

    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message)
      setIsLoading(false)
      return
    }

    try {
      const res: SignInResponse | undefined = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setErrorMsg("Credenciais inválidas. Verifique seu e-mail e senha.")
      } else if (res?.ok) {
        // Redirecionado para /dashboard em vez de /home
        router.push("/dashboard")
      } else {
        setErrorMsg("Ocorreu um erro inesperado. Tente novamente mais tarde.")
      }
    } catch (error) {
      setErrorMsg("Ocorreu um erro de conexão. Verifique sua internet.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg border-2 border-yellow-400 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="space-y-2 text-center rounded-t-lg border-b-4 border-yellow-500 bg-[#291F75] text-white p-6">
          <div className="flex justify-center mb-3 h-24 relative">
            <Image
              src="/assets/prefeitura-logo.png"
              alt="Logo da Prefeitura"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold">Bem-vindo</CardTitle>
          <CardDescription className="text-yellow-300 text-base">
            Acesse o painel de administração
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-6 bg-white px-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu.email@timon.ma.gov.br"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Esconder senha" : "Mostrar senha"}
                  </span>
                </Button>
              </div>
            </div>
            
            {errorMsg && (
              <Alert variant="destructive">
                <AlertTitle>Falha na autenticação</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="mt-2 w-full h-11 text-base" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center bg-gray-50 py-4 border-t">
          <Link href="/reset" className="text-sm text-[#291F75] hover:underline font-medium">
            Esqueceu sua senha?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}