// /app/login/page.tsx   (ou onde estiver sua rota “/login”)

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {useUser} from "@/app/context/UserContext"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
      router.push("/home")
    } catch (err: any) {
      setError(err.message)
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
            <label className="flex flex-col">
              <span className="text-gray-700 mb-1">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 mb-1">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Entrar
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center bg-white pb-6">
          <Link
            href="/reset"
            className="text-md text-[#291F75] hover:underline"
          >
            Esqueci minha senha
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
