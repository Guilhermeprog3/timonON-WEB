'use server';

import { Admin, Departament } from "@/app/types/user";
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { api } from "@/app/service/server";
import { AxiosError } from "axios";

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

export async function toggleUserStatus(id: number): Promise<{ success: boolean; message: string }> {
  const token = (await cookies()).get("JWT")?.value;
  if (!token) {
    return { success: false, message: "Token não encontrado." };
  }

  try {
    const response = await api.patch(`/admin/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      revalidatePath("/users");
      return { success: true, message: response.data.message || "Status do usuário atualizado com sucesso!" };
    }

    const errorData = response.data;
    return { success: false, message: errorData.message || "Erro ao alterar o status do usuário." };

  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
        return { success: false, message: error.response.data?.message || "Ocorreu um erro de rede." };
    }
    return { success: false, message: "Ocorreu um erro desconhecido." };
  }
}