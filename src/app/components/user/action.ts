'use server';

import { Admin, Departament } from "@/app/types/user";
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function getUsersWithDepartments(): Promise<{
  users: Admin[];
  departamentos: Departament[];
}> {
  const token = (await cookies()).get("JWT")?.value;

  if (!token) {
    return { users: [], departamentos: [] };
  }

  const [usersRes, deptsRes] = await Promise.all([
    fetch('https://infra-timon-on.onrender.com/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }),
    fetch('https://infra-timon-on.onrender.com/departments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    }),
  ]);

  const users = await usersRes.json();
  const departamentos = await deptsRes.json();

  return {
    users,
    departamentos,
  };
}

export async function deactivateUser(id: number): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) {
    return { success: false, message: "Token não encontrado." };
  }

  try {
    const response = await fetch(`https://infra-timon-on.onrender.com/admin/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      revalidatePath("/users");
      return { success: true, message: "Administrador inativado com sucesso!" };
    }

    const errorData = await response.json();
    return { success: false, message: errorData.message || "Erro ao inativar administrador." };

  } catch (error) {
    console.error("Falha ao inativar administrador:", error);
    return { success: false, message: "Ocorreu um erro de rede." };
  }
}

export async function reactivateUser(id: number): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) {
    return { success: false, message: "Token não encontrado." };
  }

  try {
    const response = await fetch(`https://infra-timon-on.onrender.com/admin/activate/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      revalidatePath("/users");
      return { success: true, message: "Administrador reativado com sucesso!" };
    }

    const errorData = await response.json();
    return { success: false, message: errorData.message || "Erro ao reativar administrador." };

  } catch (error) {
    console.error("Falha ao reativar administrador:", error);
    return { success: false, message: "Ocorreu um erro de rede." };
  }
}