"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useUser } from "@/app/context/UserContext"

const passwordSchema = z
  .object({
    password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

interface PasswordStepProps {
  email: string
  code: string
  onSuccess: () => void
  onBack: () => void
}

export function PasswordStep({ email, code, onSuccess, onBack }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const { resetPassword } = useUser()

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    setError(undefined)

    try {
      const response = await resetPassword(code, email, values.password)

      if (response.success) {
        onSuccess()
      } else {
        setError(response.message)
      }
    } catch (_error) { // Corrigido
      setError("Ocorreu um erro ao redefinir sua senha. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha"
                      className="pl-10 border-secondary/50 focus-visible:ring-secondary"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      className="pl-10 border-secondary/50 focus-visible:ring-secondary"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Esconder senha" : "Mostrar senha"}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" className="w-full sm:w-auto border-secondary/50" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Nova Senha"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}