import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { PulsaGlyph } from "@/components/ai/PulsaGlyph";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, List, UsersRound, Activity, Gauge, DollarSign,
  Calendar, FileBarChart, CalendarDays, Target, Sparkles, Megaphone,
  Zap, PenTool, MessageCircle, BookOpen, Heart, UserCog, Crown, Plug,
  Shield, Settings, Plus, CreditCard, Moon, LogOut, Bell, FileText, Smartphone, Filter,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Pesquise destinos ou ações..." />
      <CommandList>
        <CommandEmpty>Nada encontrado para essa busca.</CommandEmpty>

        <CommandGroup heading="Sugeridos">
          <CommandItem onSelect={() => go("/crm/pipeline")}>
            <List className="mr-2 h-4 w-4" />
            <span>Pipeline</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comercial/comissoes")}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Comissões</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações">
          <CommandItem onSelect={() => go("/crm/leads")} keywords={["criar", "novo lead"]}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Criar lead</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/checkout-ht")} keywords={["nova cobranca", "checkout"]}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Nova cobrança</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/infra/integracoes")} keywords={["integracao", "plataforma"]}>
            <Plug className="mr-2 h-4 w-4" />
            <span>Conectar plataforma</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto")} keywords={["pulsa", "ia", "ai", "conversar"]}>
            <PulsaGlyph size="sm" className="mr-2" />
            <span>Conversar com Pulsa</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              onOpenChange(false);
            }}
            keywords={["tema", "dark", "light", "escuro", "claro"]}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Alternar modo escuro</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              signOut();
            }}
            keywords={["logout", "exit", "sair"]}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Performance">
          <CommandItem onSelect={() => go("/")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Visão Geral</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="CRM">
          <CommandItem onSelect={() => go("/crm/pipeline")}>
            <List className="mr-2 h-4 w-4" />
            <span>Pipeline</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/crm/leads")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Lista de Leads</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Comercial">
          <CommandItem onSelect={() => go("/comercial/equipe")}>
            <UsersRound className="mr-2 h-4 w-4" />
            <span>Equipe</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comercial/atividades")}>
            <Activity className="mr-2 h-4 w-4" />
            <span>Atividades</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comercial/performance")}>
            <Gauge className="mr-2 h-4 w-4" />
            <span>Performance</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comercial/comissoes")}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Comissões</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comercial/agenda")}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Agenda</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/performance/relatorios")}>
            <FileBarChart className="mr-2 h-4 w-4" />
            <span>Relatórios</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Monetização">
          <CommandItem onSelect={() => go("/monetizacao/eventos")}>
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Eventos</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/monetizacao/pitches")}>
            <Target className="mr-2 h-4 w-4" />
            <span>Produtos & Pitches</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/estrategias")}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Construtor de Estratégias</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/checkout-ht")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Checkout HT</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Comunicação">
          <CommandItem onSelect={() => go("/comunicacao/campanhas")}>
            <Megaphone className="mr-2 h-4 w-4" />
            <span>Campanhas</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comunicacao/automacoes")}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Automações</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comunicacao/editor")}>
            <PenTool className="mr-2 h-4 w-4" />
            <span>Editor de Mensagens</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/comunicacao/conversas")}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Conversas</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Experiência">
          <CommandItem onSelect={() => go("/entrega/portfolio")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Portfólio</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/entrega/cursos")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Meus Cursos</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/entrega/mentorias")}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Minhas Mentorias</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/entrega/mentor")}>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Painel do Mentor</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/entrega/produtor")}>
            <Crown className="mr-2 h-4 w-4" />
            <span>Painel do Produtor</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Pulsa">
          <CommandItem onSelect={() => go("/ia/copiloto")}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Pulsa Chat</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto/acessos")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Pulsa — Acessos</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto/perfis")}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Pulsa — Perfis</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto/escopo")}>
            <Filter className="mr-2 h-4 w-4" />
            <span>Pulsa — Escopo</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto/alertas")}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Pulsa — Alertas</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto/logs")}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Pulsa — Logs</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/ia/copiloto/simulacao")}>
            <Smartphone className="mr-2 h-4 w-4" />
            <span>Pulsa — Simulação</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Infraestrutura">
          <CommandItem onSelect={() => go("/infra/integracoes")}>
            <Plug className="mr-2 h-4 w-4" />
            <span>Conexões</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/infra/seguranca")}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Segurança</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/infra/configuracoes")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}