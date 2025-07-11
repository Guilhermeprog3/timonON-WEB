"use server";

import { api } from "@/app/service/server";
import { Banner } from "@/app/types/banner";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

export async function getBanners(): Promise<Banner[]> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) return [];

  try {
    const response = await api.get("/banners", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return [];
    }
    console.error("Falha ao buscar banners:", error);
    return [];
  }
}

export async function createBanner(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) return { success: false, message: "Token não encontrado." };

  try {
    await api.post("/banner", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    revalidatePath("/banners");
    return { success: true, message: "Banner criado com sucesso!" };
  } catch (error: any) {
    console.error("Falha ao criar banner:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Erro ao criar o banner.",
    };
  }
}

export async function deleteBanner(
  id: string
): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) return { success: false, message: "Token não encontrado." };

  try {
    await api.delete(`/banner/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    revalidatePath("/banners");
    return { success: true, message: "Banner deletado com sucesso!" };
  } catch (error: any) {
    console.error("Falha ao deletar banner:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Erro ao deletar o banner.",
    };
  }
}