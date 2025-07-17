"use server"

import { api } from "@/app/service/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { AxiosError } from 'axios';

export interface Category {
  id: number;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return []

  try {
    const response = await api.get("/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Falha ao buscar categorias:", error)
    return []
  }
}

export async function createCategory(name: string): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return { success: false, message: "Token não encontrado." }

  try {
    await api.post("/categories",{ name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    revalidatePath("/categories")
    return { success: true, message: "Categoria criada com sucesso!" }
  } catch (error: unknown) {
    console.error("Falha ao criar categoria:", error)
    if (error instanceof AxiosError && error.response) {
      return { success: false, message: error.response?.data?.message || "Erro ao criar categoria." }
    }
    return { success: false, message: "Ocorreu um erro desconhecido." }
  }
}

export async function updateCategory(id: number, name: string): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return { success: false, message: "Token não encontrado." }

  try {
    await api.patch(
      `/categories/${id}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    revalidatePath("/categories")
    return { success: true, message: "Categoria atualizada com sucesso!" }
  } catch (error: unknown) {
    console.error("Falha ao atualizar categoria:", error)
    if (error instanceof AxiosError && error.response) {
      return { success: false, message: error.response?.data?.message || "Erro ao atualizar categoria." }
    }
    return { success: false, message: "Ocorreu um erro desconhecido." }
  }
}

export async function deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return { success: false, message: "Token não encontrado." }

  try {
    await api.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    revalidatePath("/categories")
    return { success: true, message: "Categoria deletada com sucesso!" }
  } catch (error: unknown) {
    console.error("Falha ao deletar categoria:", error)
    if (error instanceof AxiosError && error.response) {
      return { success: false, message: error.response?.data?.message || "Erro ao deletar categoria." }
    }
    return { success: false, message: "Ocorreu um erro desconhecido." }
  }
}