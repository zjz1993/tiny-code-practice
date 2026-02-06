import { TCommonLayoutAndPageProps } from "@/types/index";
import { FC } from "react";
import "./adminGlobals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";

const AdminLayout: FC<TCommonLayoutAndPageProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-[48px] border-b border-border/50 flex items-center px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};
export default AdminLayout;
