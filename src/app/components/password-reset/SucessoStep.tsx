"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CheckCircle2, LogIn, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SuccessStep() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <div className="rounded-full bg-green-100 p-4 animate-pulse">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <div className="absolute -top-1 -right-1 rounded-full bg-secondary p-1">
            <Shield className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      <Alert className="bg-green-50 border-green-200 text-center">
        <Check className="h-4 w-4 mx-auto mb-2" />
        <AlertTitle className="text-green-800 font-semibold text-center">Recuperação Concluída com Sucesso!</AlertTitle>
        <AlertDescription className="text-green-700 mt-2">
          Sua senha foi alterada com segurança. Agora você pode fazer login com sua nova senha no sistema da Prefeitura
          de Timon.
        </AlertDescription>
      </Alert>

      <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 space-y-2">
        <h3 className="font-medium text-primary flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Dicas de Segurança
        </h3>
        <ul className="text-sm text-primary/80 space-y-1">
          <li>• Mantenha sua senha segura e não a compartilhe</li>
          <li>• Use uma senha forte com letras, números e símbolos</li>
          <li>• Faça logout sempre que terminar de usar o sistema</li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Você será redirecionado automaticamente em <span className="font-bold text-primary">{countdown}</span>{" "}
          segundos
        </p>
        <div className="w-full bg-secondary/20 rounded-full h-2 mt-2">
          <div
            className="bg-secondary h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${((10 - countdown) / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      <Button
        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        onClick={() => router.push("/")}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Ir para o Login Agora
      </Button>
    </div>
  )
}
