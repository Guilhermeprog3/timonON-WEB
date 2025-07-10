"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AdminData } from "./types";

export async function getAdminData(): Promise<AdminData | null> {
  const session = await getServerSession(authOptions);

  console.log("Session recebida:", session);
  console.log("Token usado no Authorization:", session?.accessToken);

  if (!session || !session.accessToken) {
    console.error("Sessão inválida ou token ausente.");
    return null;
  }

  try {
    const res = await fetch("https://infra-timon-on.onrender.com/admin", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    console.log("Status da resposta da API:", res.status);

    if (!res.ok) {
      const texto = await res.text();
      console.error("Resposta de erro da API:", texto);
      return null;
    }

    const data = await res.json();
    console.log("Dados recebidos da API:", data);

    if (Array.isArray(data) && data.length > 0) {
      return data[0] as AdminData;
    } else {
      console.error("Resposta da API não contém dados de admin.");
      return null;
    }
  } catch (error) {
    console.error("Erro inesperado ao buscar dados do admin:", error);
    return null;
  }
}
