"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { validateResetCode } from "./action"

const codeSchema = z.object({
  code: z
    .string()
    .min(4, { message: "O código deve ter 4 dígitos" })
    .max(4, { message: "O código deve ter 4 dígitos" })
    .regex(/^\d+$/, { message: "O código deve conter apenas números" }),
})

interface CodeStepProps {
  email: string
  tokenId: string
  onSuccess: (verifiedCode: string) => void
  onBack: () => void
}

export function CodeStep({ email, tokenId, onSuccess, onBack }: CodeStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const form = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(values: z.infer<typeof codeSchema>) {
    setIsLoading(true)
    setError(undefined)

    const response = await validateResetCode(tokenId, values.code);

    if (response.success) {
      onSuccess(values.code);
    } else {
      setError(response.message);
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="bg-secondary/20 border-secondary text-center py-3">
        <AlertDescription className="text-primary/90 text-sm flex items-center justify-center flex-wrap gap-x-1.5">
          <span>Código enviado para:</span>
          <strong>{email}</strong>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Verificação</FormLabel>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Digite o código de 4 dígitos"
                      className="pl-10 border-secondary/50 focus-visible:ring-secondary text-center tracking-widest font-mono"
                      maxLength={4}
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" className="w-full sm:w-auto border-secondary/50" onClick={onBack} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Verificar Código"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}