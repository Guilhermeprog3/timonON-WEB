import { FormAddUsuario } from '@/app/components/user/FormAddUsuario'; 
import { getUsersWithDepartments } from '@/app/components/user/action'; // ou de onde você puxar os departamentos

export default async function NewUserPage() {
  const { departamentos } = await getUsersWithDepartments();

  return (
    <div className="p-6">
      <FormAddUsuario departamentos={departamentos} />
    </div>
  );
}
