"use server"

import { api } from "@/app/service/server";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  try {
    const { data } = await api.post("/restore/send", { email });
    return {
      success: true,
      message: data.message || "Código de recuperação enviado com sucesso!",
    };
  } catch (error: any) {
    console.error("Erro ao solicitar recuperação de senha:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível enviar o código. Verifique o e-mail e tente novamente.",
    };
  }
}

export async function validateResetCode(email: string, code: string): Promise<ActionResult> {
  try {
    const { data } = await api.post("/restore/confirm", { email, code });
    if (data.valid) {
      return { success: true, message: "Código validado com sucesso." };
    }
    return { success: false, message: "Código inválido ou expirado." };
  } catch (error: any) {
    console.error("Erro ao validar código de recuperação:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível validar o código.",
    };
  }
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<ActionResult> {
  try {
    const { data } = await api.patch("/user", {
      email,
      code,
      newPassword,
    });
    return {
      success: true,
      message: data.message || "Senha alterada com sucesso!",
    };
  } catch (error: any) {
    console.error("Erro ao redefinir a senha:", error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || "Não foi possível alterar a senha.",
    };
  }
}
