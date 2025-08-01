import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/sidebar";
import { Header } from "../components/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PageLayout from "./Page_Layout";
import SessionProviderWrapper from "../components/SessionProviderWrapper";

const PrivateLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const { name, role } = session.user;

  if (!role) {
    console.error("PERMISSÃO (ROLE) NÃO ENCONTRADA NA SESSÃO. REDIRECIONANDO PARA LOGIN.");
    redirect("/");
  }

  return (
    <SessionProviderWrapper>
      <SidebarProvider>
        <div className="flex min-h-screen min-w-full">
          <AppSidebar userName={name ?? 'Usuário'} userRole={role} />
          <div className="flex w-full flex-col">
            <Header />
            <main className="flex-1 bg-slate-50 p-6">
              <PageLayout userRole={role}>
                {children}
              </PageLayout>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProviderWrapper>
  );
};

export default PrivateLayout;