"use client"

interface ProgressIndicatorProps {
  currentStep: "email" | "verification" | "password" | "success"
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = ["email", "verification", "password", "success"]
  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="flex justify-between mb-8 px-2">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center flex-1">
          <div className="w-full flex items-center">
            {index > 0 && <div className={`flex-1 h-0.5 ${index <= currentIndex ? 'bg-primary' : 'bg-gray-200'}`}></div>}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300 ${
                index <= currentIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-200 text-gray-600 border border-gray-300"
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length -1 && <div className={`flex-1 h-0.5 ${index < currentIndex ? 'bg-primary' : 'bg-gray-200'}`}></div>}
          </div>
          <div
            className={`text-xs mt-2 text-center transition-colors duration-300 ${
              index <= currentIndex ? "font-medium text-primary" : "text-gray-500"
            }`}
          >
            {step === "email"
              ? "Email"
              : step === "verification"
                ? "Código"
                : step === "password"
                  ? "Senha"
                  : "Concluído"}
          </div>
        </div>
      ))}
    </div>
  )
}