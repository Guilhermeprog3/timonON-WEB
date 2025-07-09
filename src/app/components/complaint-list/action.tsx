"use server"

import { api } from "@/app/service/server"
import type { Complaint } from "@/app/types/complaint"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth"

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
  const session = await getServerSession();
  const token = (await cookies()).get("JWT")?.value;

  const user = session?.user;

  if (!token || !user) {
    console.error("getComplaints: Sessão ou token não encontrados.");
    return [];
  }

  let url = "/posts"; 

  if (user.role === "ADMIN" && user.departmentId) {
    url = `/posts/department/${user.departmentId}`;
    console.log(`Usuário ADMIN. Buscando reclamações para o departamento: ${user.departmentId}`);
  } else if (user.role === 'SUPERADMIN') {
    console.log("Usuário SUPERADMIN. Buscando todas as reclamações.");
  }

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (Array.isArray(response.data)) {
        return response.data.map(mapApiToComplaint);
    }
    
    console.warn("getComplaints: A resposta da API não foi um array.", response.data);
    return [];
  } catch (error) {
    console.error("Falha ao buscar reclamações:", error);
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
            headers: { Authorization: `Bearer ${token}` }
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
