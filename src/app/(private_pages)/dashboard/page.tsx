import { Dashboard } from "@/app/components/dashboard";
import { getDashboardData } from "@/app/components/dashboard/action";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <Dashboard data={data} />
    </div>
  );
}
