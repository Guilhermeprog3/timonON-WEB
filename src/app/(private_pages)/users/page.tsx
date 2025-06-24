import { UserTable } from "@/app/components/user/UserTable";
import { getUsersWithDepartments } from "@/app/components/user/action";

export default async function UsersPage() {
  const data = await getUsersWithDepartments();

  return (
    <div className="space-y-6">
      <UserTable data={data} />
    </div>
  );
}
