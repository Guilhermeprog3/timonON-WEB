"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"; // Ícones adicionados
import {
  requestPasswordReset,
  validateResetCode,
  resetPassword
} from "../password-reset/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordResetModalProps {
  open: boolean
  onClose: () => void
  email: string
}

export function PasswordResetModal({ open, onClose, email }: PasswordResetModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [newPassword, setNewPasswordState] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Estados para controlar a visibilidade da senha
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetLocalState = () => {
    setStep(1);
    setCode("");
    setTokenId("");
    setNewPasswordState("");
    setConfirmPassword("");
    setLoading(false);
    setError("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  if (!open) return null;

  const handleSendCode = async () => {
    setLoading(true);
    setError("");
    const response = await requestPasswordReset(email);
    setLoading(false);

    if (response.success && response.tokenId) {
      setTokenId(response.tokenId);
      setStep(2);
    } else {
      setError(response.message || "Falha ao enviar o código. Tente novamente.");
    }
  };

  const handleConfirmCode = async () => {
    setLoading(true);
    setError("");
    const response = await validateResetCode(tokenId, code);
    setLoading(false);

    if (response.success) {
      setStep(3);
    } else {
      setError(response.message || "Código inválido ou expirado.");
    }
  };

  const handleSetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");
    const response = await resetPassword(tokenId, newPassword);
    setLoading(false);

    if (response.success) {
      alert("Senha alterada com sucesso!");
      handleClose();
    } else {
      setError(response.message || "Erro ao salvar nova senha.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-slate-800">Alterar Senha</h2>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            ✕
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Um código de verificação será enviado para o seu e-mail ({email}) para prosseguir com a alteração da senha.
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
              Digite o código de 4 dígitos recebido:
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={4}
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
            <div>
              <label className="text-sm text-slate-700 block">Nova senha:</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPasswordState(e.target.value)}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-slate-700 block">Confirmar nova senha:</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

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