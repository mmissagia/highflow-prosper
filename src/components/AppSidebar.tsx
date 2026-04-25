import {
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  GraduationCap,
  TrendingUp,
  Kanban,
  List,
  CalendarDays,
  Megaphone,
  MessageCircle,
  BookOpen,
  Heart,
  ChevronRight,
  CreditCard,
  Sparkles,
  LogOut,
  Plug,
  UsersRound,
  Activity,
  Gauge,
  DollarSign,
  Calendar,
  Shield,
  Settings,
  ShoppingBag,
  Presentation,
  Package,
  RefreshCw,
  Zap,
  LayoutGrid,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
};

type MenuGroup = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
};

type MenuSection = {
  label: string;
  groups: MenuGroup[];
};

const menuGroups: MenuSection[] = [
  {
    label: "Home",
    groups: [
      {
        title: "Home",
        icon: LayoutDashboard,
        items: [
          { title: "Dashboard", url: "/", icon: LayoutDashboard },
        ],
      },
    ],
  },
  {
    label: "CRM",
    groups: [
      {
        title: "CRM",
        icon: Users,
        items: [
          { title: "Pipeline", url: "/crm/pipeline", icon: Kanban },
          { title: "Leads", url: "/crm/leads", icon: List },
        ],
      },
    ],
  },
  {
    label: "Comercial",
    groups: [
      {
        title: "Comercial",
        icon: DollarSign,
        items: [
          { title: "Equipe", url: "/comercial/equipe", icon: UsersRound },
          { title: "Atividades", url: "/comercial/atividades", icon: Activity },
          { title: "Comissões", url: "/comercial/comissoes", icon: DollarSign },
          { title: "Agenda", url: "/comercial/agenda", icon: Calendar },
          { title: "Performance", url: "/comercial/performance", icon: Gauge },
        ],
      },
    ],
  },
  {
    label: "Monetização",
    groups: [
      {
        title: "Monetização",
        icon: TrendingUp,
        items: [
          { title: "Estratégias", url: "/estrategias", icon: Sparkles },
          { title: "Eventos", url: "/monetizacao/eventos", icon: CalendarDays },
          { title: "Produtos & Pitches", url: "/monetizacao/pitches", icon: Package },
          { title: "Checkout HT", url: "/checkout-ht", icon: CreditCard },
          { title: "Assinaturas", url: "/monetizacao/assinaturas", icon: RefreshCw },
        ],
      },
    ],
  },
  {
    label: "Comunicação",
    groups: [
      {
        title: "Comunicação",
        icon: MessageSquare,
        items: [
          { title: "Conversas", url: "/comunicacao/conversas", icon: MessageCircle },
          { title: "Campanhas", url: "/comunicacao/campanhas", icon: Megaphone },
          { title: "Automações", url: "/comunicacao/automacoes", icon: Zap },
          { title: "Mensagens", url: "/comunicacao/editor", icon: BookOpen },
        ],
      },
    ],
  },
  {
    label: "Entrega",
    groups: [
      {
        title: "Entrega",
        icon: GraduationCap,
        items: [
          { title: "Portfólio", url: "/entrega/portfolio", icon: LayoutGrid },
          { title: "Cursos", url: "/entrega/cursos", icon: BookOpen },
          { title: "Mentorias", url: "/entrega/mentorias", icon: Heart },
        ],
      },
    ],
  },
  {
    label: "Configurações",
    groups: [
      {
        title: "Configurações",
        icon: Settings,
        items: [
          { title: "Integrações", url: "/infra/integracoes", icon: Plug },
          { title: "Segurança", url: "/infra/seguranca", icon: Shield },
          { title: "Configurações", url: "/infra/configuracoes", icon: Settings },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();

  const isActiveGroup = (items: { url: string }[]) => {
    return items.some((item) => currentPath === item.url || currentPath.startsWith(item.url + "/"));
  };

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
                <p className="text-xs text-sidebar-foreground/60">Plataforma High-Ticket</p>
              </div>
            )}
          </div>
        </div>

        {menuGroups.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.groups.map((group) => (
                  <Collapsible
                    key={group.title}
                    defaultOpen={isActiveGroup(group.items)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between hover:bg-sidebar-accent">
                          <div className="flex items-center gap-2">
                            <group.icon className="h-4 w-4" />
                            {state === "expanded" && <span>{group.title}</span>}
                          </div>
                          {state === "expanded" && (
                            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild={!item.comingSoon}>
                                {item.comingSoon ? (
                                  <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                                    <item.icon className="h-3.5 w-3.5" />
                                    {state === "expanded" && (
                                      <>
                                        <span>{item.title}</span>
                                        <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
                                          Em breve
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <NavLink
                                    to={item.url}
                                    end
                                    className="hover:bg-sidebar-accent"
                                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                                  >
                                    <item.icon className="h-3.5 w-3.5" />
                                    {state === "expanded" && <span>{item.title}</span>}
                                  </NavLink>
                                )}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* User & Logout */}
        <div className="mt-auto border-t border-sidebar-border p-4">
          {state === "expanded" && user && (
            <p className="text-xs text-sidebar-foreground/60 mb-2 truncate">
              {user.email}
            </p>
          )}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {state === "expanded" && <span>Sair</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
