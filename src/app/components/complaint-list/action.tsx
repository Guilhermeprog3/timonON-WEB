"use server"

import { api } from "@/app/service/server";
import type { Complaint } from "@/app/types/complaint";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDepartaments } from "../departament/action";
import { AxiosError } from "axios";

interface ApiPost {
  id: string;
  title: string;
  createdAt: string;
  status: "Pendente" | "Em Andamento" | "Resolvido";
  category: { id: string; name: string };
}

function mapApiToComplaint(post: ApiPost): Complaint {
  return {
    id: post.id,
    title: post.title,
    category: post.category.name,
    status: post.status,
    date: post.createdAt
  };
}

export async function getComplaints(): Promise<Complaint[]> {
  const session = await getServerSession(authOptions);
  const token = (await cookies()).get("JWT")?.value;

  const user = session?.user;

  if (!token || !user) {
    console.error("getComplaints: Sessão ou token não encontrados.");
    return [];
  }

  let url = "/posts";

  if (user.role === "ADMIN" && user.departmentId) {
    const departments = await getDepartaments();
    const department = departments.find(d => d.id === user.departmentId);

    if (department) {
      url = `/departments/posts-by-name?name=${department.name}`;
    } else {
      console.error(`Departamento com ID ${user.departmentId} não encontrado.`);
      return [];
    }
  } else if (user.role === 'SUPERADMIN') {
  }

  try {
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      params: {
        timestamp: new Date().getTime()
      }
    });
    
    if (Array.isArray(response.data)) {
        return response.data.map(mapApiToComplaint);
    }
    
    console.warn("getComplaints: A resposta da API não foi um array.", response.data);
    return [];
  } catch (error) {
    if (error instanceof AxiosError) {
        console.error("Axios error details em getComplaints:", {
            message: error.message,
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
    } else {
        console.error("Falha ao buscar reclamações:", error);
    }
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) {
        console.error("getCategories: Token não encontrado.");
        return [];
    }

    try {
        const response = await api.get("/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
              'Cache-Control': 'no-cache',
            },
            params: {
              timestamp: new Date().getTime()
            }
        });
        if (Array.isArray(response.data)) {
            return response.data.map((category: { id: string, name: string }) => category.name);
        }
        return [];
    } catch (error) {
        console.error("Falha ao buscar as categorias:", error);
        return [];
    }
}

export async function deleteComplaint(id: string): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) {
    return { success: false, message: "Token não encontrado." };
  }

  try {
    const response = await api.delete(`/destroy/post/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      revalidatePath("/complaint");
      return { success: true, message: "Reclamação deletada com sucesso!" };
    }

    const errorData = await response.data;
    return { success: false, message: errorData.message || "Erro ao deletar a reclamação." };

  } catch (error: unknown) {
    console.error("Falha ao deletar reclamação:", error);
    if (error instanceof AxiosError && error.response) {
      return { success: false, message: error.response?.data?.message || "Ocorreu um erro de rede." };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}