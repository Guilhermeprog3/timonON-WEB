"use server";

import { api } from "@/app/service/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDepartaments } from "../departament/action";

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
  const session = await getServerSession(authOptions);
  const token = (await cookies()).get("JWT")?.value;

  if (!token || !session?.user) {
    return { total: 0, pendentes: 0, andamento: 0, resolvidas: 0, recentes: [], mostReported: [] };
  }
  
  const user = session.user;
  let postsUrl = "/posts";
  let mostReportedUrl = "/posts/complaints";

  if (user.role === "ADMIN" && user.departmentId) {
    const departments = await getDepartaments();
    const department = departments.find(d => d.id === user.departmentId);
    if(department) {
        postsUrl = `/departments/posts-by-name?name=${department.name}`;
        console.log(`Usuário ADMIN. Buscando dados do dashboard para o departamento: ${department.name}`);
    } else {
        console.error(`Departamento com ID ${user.departmentId} não encontrado.`);
        return { total: 0, pendentes: 0, andamento: 0, resolvidas: 0, recentes: [], mostReported: [] };
    }
  } else if (user.role === 'SUPERADMIN') {
    console.log("Usuário SUPERADMIN. Buscando todos os dados do dashboard.");
  }


  try {
    const [postsResponse, mostReportedResponse] = await Promise.all([
        api.get<ApiPost[]>(postsUrl, {
            headers: { Authorization: `Bearer ${token}` },
        }),
        api.get<ApiPost[]>(mostReportedUrl, {
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