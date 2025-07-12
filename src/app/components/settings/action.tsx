"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AdminData } from "./types";

export async function getAdminData(): Promise<AdminData | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    console.error("ID do usuário não encontrado na sessão.");
    return null;
  }
  if (!session.accessToken) {
    console.error("Token de acesso não encontrado na sessão.");
    return null;
  }
  
  try {
    const res = await fetch(`https://infra-timon-on.onrender.com/admin/${session.user.id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const texto = await res.text();
      console.error(`Erro ao buscar dados do admin (ID: ${session.user.id}):`, texto);
      return null;
    }

    const data = await res.json();
    return data as AdminData;
    
  } catch (error) {
    console.error("Erro inesperado ao buscar dados do admin:", error);
    return null;
  }
}