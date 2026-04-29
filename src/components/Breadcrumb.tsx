import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BREADCRUMB_MAP: Record<string, Array<{ label: string; href?: string }>> = {
  "/crm/pipeline":         [{ label: "CRM", href: "/crm/pipeline" }, { label: "Pipeline" }],
  "/crm/leads":            [{ label: "CRM", href: "/crm/pipeline" }, { label: "Lista de Leads" }],
  "/comercial/equipe":     [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Equipe" }],
  "/comercial/atividades": [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Atividades" }],
  "/comercial/produtividade": [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Performance" }],
  "/comercial/performance":   [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Performance" }],
  "/comercial/comissoes":  [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Comissões" }],
  "/comercial/agenda":     [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Agenda" }],
  "/comercial/relatorios": [{ label: "Comercial", href: "/comercial/equipe" }, { label: "Relatórios" }],
  "/performance/relatorios": [{ label: "Performance" }, { label: "Relatórios" }],
  "/monetizacao/eventos":  [{ label: "Monetização" }, { label: "Eventos" }],
  "/monetizacao/pitches":  [{ label: "Monetização" }, { label: "Produtos & Pitches" }],
  "/monetizacao/assinaturas": [{ label: "Monetização" }, { label: "Assinaturas" }],
  "/estrategias":          [{ label: "Monetização" }, { label: "Estratégias" }],
  "/checkout-ht":          [{ label: "Monetização" }, { label: "Checkout HT" }],
  "/comunicacao/campanhas":  [{ label: "Comunicação" }, { label: "Campanhas" }],
  "/comunicacao/automacoes": [{ label: "Comunicação" }, { label: "Automações" }],
  "/comunicacao/editor":     [{ label: "Comunicação" }, { label: "Editor de Mensagens" }],
  "/comunicacao/conversas":  [{ label: "Comunicação" }, { label: "Conversas" }],
  "/entrega/portfolio":  [{ label: "Experiência" }, { label: "Portfólio" }],
  "/entrega/cursos":     [{ label: "Experiência" }, { label: "Meus Cursos" }],
  "/entrega/mentorias":  [{ label: "Experiência" }, { label: "Minhas Mentorias" }],
  "/entrega/mentor":     [{ label: "Experiência" }, { label: "Painel do Mentor" }],
  "/entrega/produtor":   [{ label: "Experiência" }, { label: "Painel do Produtor" }],
  "/infra/integracoes":  [{ label: "Infraestrutura" }, { label: "Conexões" }],
  "/infra/seguranca":    [{ label: "Infraestrutura" }, { label: "Segurança" }],
  "/infra/configuracoes":[{ label: "Infraestrutura" }, { label: "Configurações" }],
  "/ia/copiloto":          [{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Chat" }],
  "/ia/copiloto/acessos":  [{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Acessos" }],
  "/ia/copiloto/perfis":   [{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Perfis" }],
  "/ia/copiloto/escopo":   [{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Escopo" }],
  "/ia/copiloto/alertas":  [{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Alertas" }],
  "/ia/copiloto/logs":     [{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Logs" }],
  "/ia/copiloto/simulacao":[{ label: "Pulsa", href: "/ia/copiloto" }, { label: "Simulação" }],
};

interface BreadcrumbProps {
  className?: string;
}

export function Breadcrumb({ className }: BreadcrumbProps) {
  const { pathname } = useLocation();

  let items = BREADCRUMB_MAP[pathname];
  if (!items) {
    if (pathname.startsWith("/crm/lead")) {
      items = [{ label: "CRM", href: "/crm/pipeline" }, { label: "Ficha do Lead" }];
    } else if (pathname.startsWith("/monetizacao/eventos/detalhe")) {
      items = [{ label: "Monetização" }, { label: "Eventos", href: "/monetizacao/eventos" }, { label: "Detalhes" }];
    } else if (pathname.startsWith("/monetizacao/pitches/")) {
      items = [{ label: "Monetização" }, { label: "Pitch Editor" }];
    } else if (pathname.startsWith("/entrega/mentorias/")) {
      items = [{ label: "Experiência" }, { label: "Minhas Mentorias" }];
    }
  }

  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "flex items-center gap-1 text-xs text-muted-foreground",
        className
      )}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
          {item.href && i < items!.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                i === items!.length - 1 && "text-foreground font-medium"
              )}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}