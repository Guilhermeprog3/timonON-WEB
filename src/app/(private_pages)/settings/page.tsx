import { Settings } from "@/app/components/settings";
import { getAdminData } from "@/app/components/settings/action";

export default async function SettingsPage() {
  const admin = await getAdminData();

  if (!admin) {
    return (
      <div className="text-center text-sm text-red-500 mt-10">
        Erro ao carregar informações do usuário.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Settings admin={admin} />
    </div>
  );
}

