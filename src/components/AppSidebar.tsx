import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  GraduationCap,
  TrendingUp
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "CRM", url: "/crm", icon: Users },
  { title: "Eventos & Pitches", url: "/eventos", icon: Calendar },
  { title: "Comunicação", url: "/comunicacao", icon: MessageSquare },
  { title: "Entrega", url: "/entrega", icon: GraduationCap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {state === "expanded" && (
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">HighFlow</h1>
                <p className="text-xs text-sidebar-foreground/60">High-Ticket Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
