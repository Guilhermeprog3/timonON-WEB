"use server";

import { api } from "@/app/service/server";
import { cookies } from "next/headers";

type Status = "Pendente" | "Em Andamento" | "Resolvido";

function normalizeStatus(status: string): Status {
    if (!status) return "Pendente";
    const lowerCaseStatus = status.toLowerCase();
    if (lowerCaseStatus.includes("andamento")) return "Em Andamento";
    if (lowerCaseStatus.includes("resolvido")) return "Resolvido";
    return "Pendente";
}

type DashboardData = {
  total: number;
  pendentes: number;
  andamento: number;
  resolvidas: number;
  recentes: {
    id: string;
    title: string;
    status: Status;
    address: string;
    createdAt: string;
  }[];
  mostReported: {
    id: string;
    title: string;
    complaints: number;
    address: string;
  }[];
};

interface ApiPost {
  id: string;
  title: string;
  status: string;
  neighborhood?: string;
  createdAt: string;
  complaints?: number;
  address: string;
}

export async function getDashboardData(): Promise<DashboardData> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) return { total: 0, pendentes: 0, andamento: 0, resolvidas: 0, recentes: [], mostReported: [] };

  try {
    const [postsResponse, mostReportedResponse] = await Promise.all([
        api.get<ApiPost[]>("/posts", {
            headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<ApiPost[]>("/posts/complaints", {
            headers: { Authorization: `Bearer ${token}` },
        })
    ]);

    const posts = postsResponse.data;
    const mostReportedData = mostReportedResponse.data;

    const total = posts.length;
    const pendentes = posts.filter((p) => normalizeStatus(p.status) === "Pendente").length;
    const andamento = posts.filter((p) => normalizeStatus(p.status) === "Em Andamento").length;
    const resolvidas = posts.filter((p) => normalizeStatus(p.status) === "Resolvido").length;

    const recentes = posts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((post) => ({
        id: post.id,
        title: post.title,
        status: normalizeStatus(post.status),
        address: post.address,
        createdAt: post.createdAt,
      }));
      
    const mostReported = mostReportedData
      .slice(0, 10)
      .map((post) => ({
        id: post.id,
        title: post.title,
        complaints: post.complaints ?? 0,
        address: post.address,
    }));


    return { total, pendentes, andamento, resolvidas, recentes, mostReported };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return { total: 0, pendentes: 0, andamento: 0, resolvidas: 0, recentes: [], mostReported: [] };
  }
}