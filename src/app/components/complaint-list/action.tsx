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
  neighborhood: { id: string; name: string };
}

function mapPostToComplaint(post: ApiPost): Complaint {
  return {
    id: post.id,
    title: post.title,
    category: post.category.name,
    status: post.status,
    date: post.creation_date,
  };
}

async function getAuthToken(): Promise<string | undefined> {
    return (await cookies()).get("JWT")?.value;
}

export async function getComplaintsByFilters(filters: {
  search?: string;
  status?: string;
  category?: string;
}): Promise<Complaint[]> {
    const token = await getAuthToken();
    if (!token) return [];

    let endpoint = "/posts";
    const params: Record<string, string | number> = {
        page: 1,
        pageSize: 20,
    };

    if (filters.category && filters.category !== 'all') {
        endpoint = `/category/posts-by-name`;
        params.name = filters.category;
    } else {
        if (filters.search) {
            params.description = filters.search;
        }
        if (filters.status && filters.status !== 'all') {
            params.status = filters.status;
        }
    }

    try {
        const response = await api.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        if (endpoint === '/category/posts-by-name') {
            const categoryData = response.data[0];
            const posts = categoryData?.posts || [];
            return posts.map(mapPostToComplaint);
        }

        return response.data.map(mapPostToComplaint);

    } catch (error) {
        console.error(`Falha ao buscar reclamações com filtros (${endpoint}):`, error);
        return [];
    }
}

export async function getComplaints(): Promise<Complaint[]> {
    return getComplaintsByFilters({});
}

export async function getCategories(): Promise<string[]> {
    const token = await getAuthToken();
    if (!token) return [];

    try {
        const response = await api.get("/category", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.map((category: { id: string, name: string }) => category.name);
    } catch (error) {
        console.error("Falha ao buscar as categorias:", error);
        return [];
    }
}