'use server';

import { Admin, Departament } from "@/app/types/user";
import { cookies } from 'next/headers';


export async function getUsersWithDepartments(): Promise<{
  users: Admin[];
  departamentos: Departament[];
}> {

  

  const token = (await cookies()).get("JWT")?.value;
  console.log('TOKENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN', token);
  console.log('TOKEN', token);

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
  console.log('USERS', users);
  
  const departamentos = await deptsRes.json();

  return {
    users,
    departamentos: departamentos
    
  };
}
