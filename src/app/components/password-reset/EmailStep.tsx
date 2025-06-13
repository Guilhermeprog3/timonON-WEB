"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useUser } from "@/app/context/UserContext"

const emailSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

interface EmailStepProps {
  onSuccess: (email: string) => void
}

export function EmailStep({ onSuccess }: EmailStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const { forgotPassword } = useUser()

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    setIsLoading(true)
    setError(undefined)
    setSuccess(undefined)

    try {
      const response = await forgotPassword(values.email)

      if (response.success) {
        setSuccess(response.message)
        setTimeout(() => {
          onSuccess(values.email)
        }, 1500)
      } else {
        setError(response.message)
      }
    } catch {
      setError("Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente mais tarde.")
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

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Sucesso</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="seu.email@timon.ma.gov.br"
                      className="pl-10 border-secondary/50 focus-visible:ring-secondary"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar Código de Recuperação"}
          </Button>
        </form>
      </Form>
    </div>
  )
}