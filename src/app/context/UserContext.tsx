"use client"

import React, { createContext, PropsWithChildren, useContext } from "react"
import { api } from "@/app/service/server"
import { AxiosError } from "axios"

type UserContextProps = {
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>
  validateResetCode: (code: string, email: string) => Promise<boolean>
  resetPassword: (code: string, email: string, newPassword: string) => Promise<{ success: boolean; message: string }>
}

export const UserContext = createContext<UserContextProps>({} as UserContextProps)

export const UserProvider = ({ children }: PropsWithChildren) => {
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    console.log(email)
    try {
      const { data } = await api.post("restore/send", { email })
      return {
        success: data.success,
        message: data.message,
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return {
          success: false,
          message: error.response?.data?.message || "Erro ao solicitar recuperação.",
        }
      }
      return { success: false, message: "Ocorreu um erro desconhecido." };
    }
  }

  const validateResetCode = async (code: string, email: string): Promise<boolean> => {
    try {
      const { data } = await api.post("restore/confirm", { email, code })
      if (!data.success || !data.valid) throw new Error(data.message)
      return true
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
          throw new Error(error.response?.data?.message || "Código inválido.");
      }
      throw new Error("Ocorreu um erro desconhecido ao validar o código.");
    }
  }

  const resetPassword = async (
    code: string,
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.patch("user", {
        email,
        code,
        newPassword,
      })
      if (!data.success) {
        return {
          success: false,
          message: data.message,
        }
      }
      return {
        success: true,
        message: data.message,
      }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return {
                success: false,
                message: error.response?.data?.message || "Erro ao redefinir a senha.",
            }
        }
        return { success: false, message: "Ocorreu um erro desconhecido ao redefinir a senha." };
    }
  }

  return (
    <UserContext.Provider
      value={{
        forgotPassword,
        validateResetCode,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)