"use server"

import { api } from "@/app/service/server";
import type { ComplaintDetailsData, Status } from "@/app/types/complaint";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function normalizeStatus(status: string): Status {
    if (!status) return "Pendente";
    const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return normalized as Status;
}

function mapApiToComplaintDetails(data: any): ComplaintDetailsData {
    if (!data) {
        throw new Error("Tentativa de mapear dados de reclamação indefinidos.");
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: normalizeStatus(data.status),
        category: data.category?.name,
        creation_date: data.createdAt,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        photo_url: data.publicUrl,
        citizen: {
            name: data.user?.name,
            email: data.user?.email,
            cpf: data.user?.cpf,
        },
        updates: (data.updates || []).map((update: any) => ({
            id: update.id,
            timestamp: update.update_date,
            status: normalizeStatus(update.status),
            comment: update.comment,
            userName: update.user?.name,
        })),
    };
}


export async function getComplaintById(id: string): Promise<ComplaintDetailsData | null> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) return null;

    try {
        const response = await api.get(`/post/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return mapApiToComplaintDetails(response.data);
    } catch (error) {
        console.error("Falha ao buscar detalhes da reclamação:", error);
        return null;
    }
}

export async function markAsInProgress(id: string, comment: string) {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) throw new Error("Token não encontrado.");

    await api.put(`/post/${id}/in-progress`, { comment }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    revalidatePath(`/complaints/${id}`);
}

export async function markAsResolved(id: string, comment: string) {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) throw new Error("Token não encontrado.");

    await api.put(`/post/${id}/complete`, { comment }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    revalidatePath(`/complaints/${id}`);
}