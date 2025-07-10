// src/app/components/settings/PasswordResetModal.tsx
"use client"

import { useState } from "react"
import {
  sendResetCode,
  confirmResetCode,
} from "./passwordActions"

interface PasswordResetModalProps {
  open: boolean
  onClose: () => void
  email: string
}

export function PasswordResetModal({ open, onClose, email }: PasswordResetModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [code, setCode] = useState("")
  const [id, setId] = useState("")
  const [newPassword, setNewPasswordState] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  const handleSendCode = async () => {
    setLoading(true)
    setError("")
    const ok = await sendResetCode(email)
    setLoading(false)

    if (ok) setStep(2)
    else setError("Falha ao enviar o código. Tente novamente.")
  }

  const handleConfirmCode = async () => {
    setLoading(true)
    setError("")
    const userId = await confirmResetCode(email, code)
    setLoading(false)

    if (userId) {
      setId(userId)
      setStep(3)
    } else {
      setError("Código inválido ou expirado.")
    }
  }

  const handleSetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch(`https://infra-timon-on.onrender.com/restore/new-password/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      })

      setLoading(false)

      if (res.ok) {
        alert("Senha alterada com sucesso!")
        onClose()
      } else {
        setError("Erro ao salvar nova senha.")
      }
    } catch (error) {
      setLoading(false)
      setError("Erro ao se comunicar com o servidor.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-slate-800">Alterar Senha</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Deseja receber um código de verificação no seu e-mail?
            </p>
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="text-sm text-slate-700 block">
              Digite o código recebido:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleConfirmCode}
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <label className="text-sm text-slate-700 block">Nova senha:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPasswordState(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <label className="text-sm text-slate-700 block">Confirmar nova senha:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
