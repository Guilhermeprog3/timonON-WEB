"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EmailStep } from "@/app/components/password-reset/EmailStep"
import { CodeStep } from "@/app/components/password-reset/CodeStep"
import { PasswordStep } from "@/app/components/password-reset/PasswordStep"
import { SuccessStep } from "@/app/components/password-reset/SucessoStep"
import { ProgressIndicator } from "@/app/components/password-reset/ProgressIndicator"

const PasswordResetPage = () => {
  const [step, setStep] = useState<"email" | "verification" | "password" | "success">("email")
  const [email, setEmail] = useState("")
  const [tokenId, setTokenId] = useState("")
  const [code, setCode] = useState("") 

  const getStepTitle = () => {
    switch (step) {
      case "email": return "Recuperar Senha";
      case "verification": return "Verificar Código";
      case "password": return "Nova Senha";
      case "success": return "Senha Alterada";
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case "email": return "Digite seu email para receber um código de recuperação";
      case "verification": return "Digite o código de verificação enviado para seu email";
      case "password": return "Digite e confirme sua nova senha";
      case "success": return "Sua senha foi alterada com sucesso";
    }
  }

  const goBack = () => {
    if (step === "verification") {
      setStep("email")
    } else if (step === "password") {
      setStep("verification")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-xl overflow-hidden border-2 border-secondary">
        <CardHeader className="space-y-1 text-center bg-primary text-primary-foreground p-6 pt-6">
          <div className="flex justify-center mb-4 h-32 relative">
            <Image 
              src="/assets/prefeitura-logo.png" 
              alt="Logo da Prefeitura" 
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-3xl">{getStepTitle()}</CardTitle>
          <CardDescription className="text-secondary text-lg">{getStepDescription()}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 pb-6 bg-white px-8">
          <ProgressIndicator currentStep={step} />
          
          {step === "email" && (
            <EmailStep 
              onSuccess={(email, receivedTokenId) => {
                setEmail(email)
                setTokenId(receivedTokenId)
                setStep("verification")
              }} 
            />
          )}

          {step === "verification" && (
            <CodeStep 
              email={email}
              tokenId={tokenId}
              onBack={goBack}
              onSuccess={(verifiedCode) => {
                setCode(verifiedCode)
                setStep("password")
              }}
            />
          )}

          {step === "password" && (
            <PasswordStep 
              tokenId={tokenId}
              onBack={goBack}
              onSuccess={() => setStep("success")}
            />
          )}

          {step === "success" && <SuccessStep />}
        </CardContent>
        
        <CardFooter className="flex justify-center bg-gray-50 py-4 border-t">
          {step !== "success" && (
            <Button 
              variant="link" 
              className="px-0 text-md text-primary"
              asChild
            >
              <Link href="/">Voltar para o login</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default PasswordResetPage