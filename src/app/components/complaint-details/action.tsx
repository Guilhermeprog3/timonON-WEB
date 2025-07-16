"use server"

import { api } from "@/app/service/server";
import type { ComplaintDetailsData, Status, Comment } from "@/app/types/complaint";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { AxiosError } from "axios";

interface ApiUpdate {
  id: string;
  update_date: string;
  status: string;
  comment: string;
  user?: { name: string };
}

interface ApiResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  category?: { name: string };
  department?: { name: string };
  createdAt: string;
  updatedAt: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  publicUrl: string | null;
  comment?: string | null;
  user?: {
    name: string;
    email: string;
    cpf: string;
    imageUrl?: string;
  };
  updates?: ApiUpdate[];
}


function normalizeStatus(status: string): Status {
    if (!status) return "Pendente";
    const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    if (normalized === "Em andamento") return "Em Andamento";
    if (normalized === "Resolvido") return "Resolvido";
    return "Pendente";
}

function mapApiToComplaintDetails(data: ApiResponse, comments: Comment[]): ComplaintDetailsData {
    if (!data) {
        throw new Error("Tentativa de mapear dados de reclamação indefinidos.");
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: normalizeStatus(data.status),
        category: data.category?.name ?? 'Não categorizado',
        department: data.department?.name ?? 'Não informado',
        creation_date: data.createdAt,
        updatedAt: data.updatedAt,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        photo_url: data.publicUrl,
        comment: data.comment,
        citizen: {
            name: data.user?.name ?? 'Não informado',
            email: data.user?.email ?? 'Não informado',
            cpf: data.user?.cpf ?? 'Não informado',
        },
        updates: (data.updates || []).map((update: ApiUpdate) => ({
            id: update.id,
            timestamp: update.update_date,
            status: normalizeStatus(update.status),
            comment: update.comment,
            userName: update.user?.name ?? 'Sistema',
        })),
        comments,
    };
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) return [];

    try {
        const response = await api.get<{ comments: Comment[] }>(`/comments/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        return response.data.comments;
    } catch (error) {
        console.error("Falha ao buscar comentários:", error);
        return [];
    }
}

export async function getComplaintById(id: string): Promise<ComplaintDetailsData | null> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) return null;

    try {
        const [complaintResponse, commentsResponse] = await Promise.all([
            api.get<ApiResponse>(`/post/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            getCommentsByPostId(id),
        ]);
        return mapApiToComplaintDetails(complaintResponse.data, commentsResponse);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {

            return null;
        }

        console.error("Falha ao buscar detalhes da reclamação:", error);
        return null;
    }
}

function handleApiError(error: unknown): { message: string } {
    if (error instanceof AxiosError && error.response) {
        return { message: error.response.data?.message || "Ocorreu um erro desconhecido." };
    }
    return { message: "Ocorreu um erro de rede ou servidor." };
}

export async function markAsInProgress(id: string, comment: string) {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) throw new Error("Token não encontrado.");
    try {
        await api.patch(`/post/${id}/in-progress`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath(`/complaintDetails/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error).message);
    }
}

export async function markAsResolved(id: string, comment: string) {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) throw new Error("Token não encontrado.");
    try {
        await api.patch(`/post/${id}/complete`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath(`/complaintDetails/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error).message);
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

export async function createComment(postId: string, text: string): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) {
    return { success: false, message: "Token não encontrado." };
  }

  if (!text.trim()) {
      return { success: false, message: "O comentário não pode estar vazio." };
  }

  try {
    await api.post(`/comments/${postId}`, { text }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    revalidatePath(`/complaintDetails/${postId}`);
    return { success: true, message: "Comentário adicionado com sucesso!" };

  } catch (error: unknown) {
    console.error("Falha ao criar comentário:", error);
    if (error instanceof AxiosError && error.response) {
      return { success: false, message: error.response?.data?.message || "Ocorreu um erro ao adicionar o comentário." };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}