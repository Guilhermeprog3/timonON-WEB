import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/sidebar";
import { Header } from "../components/header/index"; 

const PrivateLayout = async ({ children }: { children: ReactNode }) => {
  const token = (await cookies()).get("JWT")?.value;

  if (!token) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className=" z-10">
         <Header />
      </div>
     

      <div className="flex flex-1">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 bg-slate-50 p-6">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default PrivateLayout;