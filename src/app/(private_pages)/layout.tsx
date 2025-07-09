import { redirect } from "next/navigation"
import { ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/sidebar/sidebar"
import { Header } from "../components/header"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

const PrivateLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/")
    return null;
  }

  const userRole = session.user.role 

  if (!userRole) {
    console.error("PERMISSÃO (ROLE) NÃO ENCONTRADA NA SESSÃO. REDIRECIONANDO PARA LOGIN.");
    redirect("/");
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-full">
        <AppSidebar userRole={userRole} />
        <div className="flex w-full flex-col">
          <Header />
          <main className="flex-1 bg-slate-50 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default PrivateLayout
