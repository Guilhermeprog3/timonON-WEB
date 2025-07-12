"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AdminData } from "./types";
import { Admin, Departament } from "@/app/types/user";

export async function getAdminData(): Promise<AdminData | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.accessToken) {
    console.error("ID do usuário ou token de acesso não encontrado na sessão.");
    return null;
  }
  
  try {
    const [adminRes, deptsRes] = await Promise.all([
      fetch(`https://infra-timon-on.onrender.com/admin/${session.user.id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
      }),
      fetch(`https://infra-timon-on.onrender.com/departments`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
      })
    ]);

    if (!adminRes.ok) {
      const texto = await adminRes.text();
      console.error(`Erro ao buscar dados do admin (ID: ${session.user.id}):`, texto);
      return null;
    }

    const adminData: Admin = await adminRes.json();
    const departments: Departament[] = deptsRes.ok ? await deptsRes.json() : [];

    const department = departments.find(d => d.id === adminData.departmentId) || null;

    const result: AdminData = {
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      role: adminData.role,
      department: department ? { id: department.id, name: department.name } : null,
    };
    
    return result;
    
  } catch (error) {
    console.error("Erro inesperado ao buscar dados do admin:", error);
    return null;
  }
}