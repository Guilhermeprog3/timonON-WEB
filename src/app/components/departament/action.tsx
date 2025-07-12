"use server"

import { api } from "@/app/service/server"
import { Departament } from "@/app/types/user"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function getDepartaments(): Promise<Departament[]> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return []

  try {
    const response = await api.get("/departments", {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Falha ao buscar departamentos:", error)
    return []
  }
}

export async function createDepartment(name: string): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return { success: false, message: "Token não encontrado." }

  try {
    const response = await api.post("/department",{ name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    revalidatePath("/departments")
    return { success: true, message: "Departamento criado com sucesso!" }
  } catch (error: any) {
    console.error("Falha ao criar departamento:", error)
    return { success: false, message: error.response?.data?.message || "Erro ao criar departamento." }
  }
}

export async function updateDepartment(id: number, name: string): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return { success: false, message: "Token não encontrado." }

  try {
    const response = await api.patch(
      `/department/${id}`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    revalidatePath("/departments")
    return { success: true, message: "Departamento atualizado com sucesso!" }
  } catch (error: any) {
    console.error("Falha ao atualizar departamento:", error)
    return { success: false, message: error.response?.data?.message || "Erro ao atualizar departamento." }
  }
}

export async function deleteDepartment(id: number): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value
  if (!token) return { success: false, message: "Token não encontrado." }

  try {
    await api.delete(`/department/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    revalidatePath("/departments")
    return { success: true, message: "Departamento deletado com sucesso!" }
  } catch (error: any) {
    console.error("Falha ao deletar departamento:", error)
    return { success: false, message: error.response?.data?.message || "Erro ao deletar departamento." }
  }
}