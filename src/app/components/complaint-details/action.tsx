"use server"

import { api } from "@/app/service/server";
import type { ComplaintDetailsData } from "@/app/types/complaint";
import { cookies } from "next/headers";

function mapApiToComplaintDetails(data: any): ComplaintDetailsData {
    if (!data) {
        throw new Error("Tentativa de mapear dados de reclamação indefinidos.");
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        category: data.category?.name,
        creation_date: data.creation_date,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        photo_url: data.photo_url,
        citizen: {
            name: data.user?.name,
            email: data.user?.email,
            cpf: data.user?.cpf,
        },
        updates: (data.updates || []).map((update: any) => ({
            id: update.id,
            timestamp: update.update_date,
            status: update.status,
            comment: update.comment,
            userName: update.user?.name,
        })),
    };
}


export async function getComplaintById(id: string): Promise<ComplaintDetailsData | null> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) {
        console.error("Token não encontrado.");
        return null;
    }

    try {
        const response = await api.get(`/post/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const complaintData = response.data;
        if (!complaintData) {
            console.error("Dados da reclamação não encontrados na resposta da API.");
            return null;
        }
        return mapApiToComplaintDetails(complaintData);
    } catch (error) {
        console.error("Falha ao buscar detalhes da reclamação:", error);
        return null;
    }
}