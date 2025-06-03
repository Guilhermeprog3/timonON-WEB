// /context/UserContext.tsx

"use client"

import React, { createContext, PropsWithChildren, useContext, useState } from "react"
import { api } from "@/app/service/server"

type UserContextProps = {
  login: (email: string, password: string) => Promise<void>
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>
  validateResetCode: (code: string, email: string) => Promise<boolean>
  resetPassword: (
    code: string,
    email: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>
  userToken: string | null
}

export const UserContext = createContext<UserContextProps>({} as UserContextProps)

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userToken, setUserToken] = useState<string | null>(null)

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data } = await api.post("/auth/login", { email, password })
      if (!data.success) {
        throw new Error(data.message || "Falha no login")
      }
      // Exemplo: armazena o token no localStorage e no state
      localStorage.setItem("token", data.token)
      setUserToken(data.token)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || "Erro ao tentar logar")
    }
  }

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.post("/auth/forget-password", { email })
      return {
        success: data.success,
        message: data.message,
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao solicitar recuperação.",
      }
    }
  }

  const validateResetCode = async (code: string, email: string): Promise<boolean> => {
    try {
      const { data } = await api.post("/auth/verify-code", { email, code })
      if (!data.success || !data.valid) throw new Error(data.message)
      return true
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Código inválido.")
    }
  }

  const resetPassword = async (
    code: string,
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.post("/auth/reset-password", {
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
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao redefinir a senha.",
      }
    }
  }

  return (
    <UserContext.Provider
      value={{
        login,
        forgotPassword,
        validateResetCode,
        resetPassword,
        userToken,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
