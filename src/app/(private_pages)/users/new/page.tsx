import { FormAddUsuario } from '@/app/components/user/FormAddUsuario'; 
import { getUsersWithDepartments } from '@/app/components/user/action';

export default async function NewUserPage() {
  const { departamentos } = await getUsersWithDepartments();

  return (
    <FormAddUsuario departamentos={departamentos} />
  );
}