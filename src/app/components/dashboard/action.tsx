"use server";

import { api } from "@/app/service/server";
import { cookies } from "next/headers";

type DashboardData = {
  total: number;
  pendentes: number;
  andamento: number;
  resolvidas: number;
  recentes: {
    id: string;
    title: string;
    status: "Pendente" | "Em Andamento" | "Resolvido";
    neighborhood: string;
    createdAt: string;
  }[];
};

interface ApiPost {
  id: string;
  title: string;
  status: "Pendente" | "Em Andamento" | "Resolvido";
  neighborhood?: { name: string };
  creation_date: string;
}

export async function getDashboardData(): Promise<DashboardData> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) return { total: 0, pendentes: 0, andamento: 0, resolvidas: 0, recentes: [] };

  try {
    const response = await api.get<ApiPost[]>("/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const posts = response.data;

    const total = posts.length;
    const pendentes = posts.filter((p) => p.status === "Pendente").length;
    const andamento = posts.filter((p) => p.status === "Em Andamento").length;
    const resolvidas = posts.filter((p) => p.status === "Resolvido").length;

    const recentes = posts
      .sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime())
      .slice(0, 5)
      .map((post) => ({
        id: post.id,
        title: post.title,
        status: post.status,
        neighborhood: post.neighborhood?.name ?? "Desconhecido",
        createdAt: post.creation_date,
      }));

    return { total, pendentes, andamento, resolvidas, recentes };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return { total: 0, pendentes: 0, andamento: 0, resolvidas: 0, recentes: [] };
  }
}