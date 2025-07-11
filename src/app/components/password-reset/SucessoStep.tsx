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
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-200 text-center">
        <Check className="h-4 w-4 mx-auto mb-2" />
        <AlertTitle className="text-green-800 font-semibold text-center">Recuperação Concluída com Sucesso!</AlertTitle>
        <AlertDescription className="text-green-700 mt-2">
          Sua senha foi alterada com segurança. Agora você pode fazer login com sua nova senha no sistema da Prefeitura
          de Timon.
        </AlertDescription>
      </Alert>

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