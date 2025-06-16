"use server"
import { api } from "@/app/service/server";
import type { Complaint } from "@/app/types/complaint"
import { cookies } from "next/headers";

interface ApiPost {
  id: string;
  title: string;
  creation_date: string;
  status: "Pendente" | "Em Andamento" | "Resolvido";
  category: { id: string; name: string };
}

function mapApiToComplaint(post: ApiPost): Complaint {
  return {
    id: post.id,
    title: post.title,
    category: post.category.name,
    status: post.status,
    date: post.creation_date,
  };
}

export async function getComplaints(): Promise<Complaint[]> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) return [];

  try {
    const response = await api.get("/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (Array.isArray(response.data)) {
        return response.data.map(mapApiToComplaint);
    }
    return [];
  } catch (error) {
    console.error("Falha ao buscar reclamações:", error);
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
    const token = (await cookies()).get("JWT")?.value;
    if (!token) return [];

    try {
        const response = await api.get("/categories", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.map((category: { id: string, name: string }) => category.name);
    } catch (error) {
        console.error("Falha ao buscar as categorias:", error);
        return [];
    }
}