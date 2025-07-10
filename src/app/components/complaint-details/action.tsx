"use server"

import { api } from "@/app/service/server";
import type { ComplaintDetailsData, Status } from "@/app/types/complaint";
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
  createdAt: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  publicUrl: string | null;
  user?: {
    name: string;
    email: string;
    cpf: string;
  };
  updates?: ApiUpdate[];
}

function normalizeStatus(status: string): Status {
    if (!status) return "Pendente";
    const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return normalized as Status;
}

function mapApiToComplaintDetails(data: ApiResponse): ComplaintDetailsData {
    if (!data) {
        throw new Error("Tentativa de mapear dados de reclamação indefinidos.");
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: normalizeStatus(data.status),
        category: data.category?.name ?? 'Não categorizado',
        creation_date: data.createdAt,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        photo_url: data.publicUrl,
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
    };
}


export async function getComplaintById(id: string): Promise<ComplaintDetailsData | null> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) return null;

    try {
        const response = await api.get<ApiResponse>(`/post/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return mapApiToComplaintDetails(response.data);
    } catch (error) {
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
        await api.put(`/post/${id}/in-progress`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath(`/complaints/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error).message);
    }
}

export async function markAsResolved(id: string, comment: string) {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) throw new Error("Token não encontrado.");
    try {
        await api.put(`/post/${id}/complete`, { comment }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        revalidatePath(`/complaints/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error).message);
    }
}