"use server"

import { api } from "@/app/service/server";
import { AxiosError } from "axios";

type ActionResult = {
  success: boolean;
  message: string;
};

export async function requestPasswordReset(email: string): Promise<ActionResult & { tokenId?: string }> {
  try {
    const { data } = await api.post("/restore/send", { email });
    if (data.token && data.token.id) {
      return {
        success: true,
        message: data.message || "Código de recuperação enviado com sucesso!",
        tokenId: String(data.token.id)
      };
    }
    return { success: false, message: "Não foi possível obter o token de recuperação." };
  } catch (error: unknown) {
    console.error("Erro ao solicitar recuperação de senha:", error);
    if (error instanceof AxiosError && error.response) {
      return {
        success: false,
        message: error.response?.data?.message || "Não foi possível enviar o código. Verifique o e-mail e tente novamente.",
      };
    }
    return {
        success: false,
        message: "Ocorreu um erro desconhecido.",
    }
  }
}

export async function validateResetCode(tokenId: string, token: string): Promise<ActionResult> {
  try {

    await api.patch("/restore/confirm", { tokenId, token });

    return { success: true, message: "Código validado com sucesso." };

  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error("Erro ao validar código de recuperação:", error.response.data);
      return {
        success: false,
        message: error.response.data?.message || "Não foi possível validar o código. Verifique se está correto.",
      };
    }

    return { success: false, message: "Ocorreu um erro desconhecido ao validar o código." };
  }
}


export async function resetPassword(tokenId: string, newPassword: string): Promise<ActionResult> {
  console.log(newPassword)
  try {
    await api.patch(`/restore/new-password/${tokenId}`, {
       newPassword,
    });
    return {
      success: true,
      message: "Senha alterada com sucesso!",
    };
  } catch (error: unknown) {
    console.error("Erro ao redefinir a senha:", error);
    if (error instanceof AxiosError && error.response) {
      return {
        success: false,
        message: error.response?.data?.message || "Não foi possível alterar a senha.",
      };
    }
    return {
        success: false,
        message: "Ocorreu um erro desconhecido.",
    }
  }
}