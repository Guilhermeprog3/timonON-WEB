"use client"

interface ProgressIndicatorProps {
  currentStep: "email" | "verification" | "password" | "success"
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = ["email", "verification", "password", "success"]
  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="flex justify-between mb-6 px-2">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              index <= currentIndex
                ? "text-white"
                : "bg-gray-200 text-gray-600 border border-gray-300"
            }`}
            style={{
              backgroundColor: index <= currentIndex ? '#291F75' : 'transparent',
              borderColor: index <= currentIndex ? '#EFAE0C' : '#D1D5DB'
            }}
          >
            {index + 1}
          </div>
          <div
            className={`text-xs mt-1 ${
              index <= currentIndex ? "font-medium" : "text-gray-500"
            }`}
            style={{ color: index <= currentIndex ? '#291F75' : '#6B7280' }}
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