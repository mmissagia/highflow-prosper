import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalContextSelector } from "@/components/GlobalContextSelector";
import { Search, Filter, Download, Plus, Eye, Inbox, MessageCircle, Mail, Users, Plug, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LeadSourceSelector from "@/components/crm/LeadSourceSelector";
import { CreateLeadDrawer } from "@/components/crm/CreateLeadDrawer";
import { useState } from "react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

const mockLeads = [
  { id: 1, name: "João Silva", origin: "Meta Ads", responsible: "Ana Ribeiro", stage: "Engajado", score: 85, iem: 78, valuePotential: 15000, lastInteraction: "2h atrás", nextAction: "Follow-up WhatsApp" },
  { id: 2, name: "Maria Santos", origin: "Evento", responsible: "Rafael Costa", stage: "Warm", score: 92, iem: 85, valuePotential: 25000, lastInteraction: "1d atrás", nextAction: "Enviar proposta" },
  { id: 3, name: "Pedro Costa", origin: "Indicação", responsible: "Lucas Martins", stage: "Call Agendada", score: 78, iem: 72, valuePotential: 12000, lastInteraction: "30min", nextAction: "Confirmar call" },
  { id: 4, name: "Ana Oliveira", origin: "Low Ticket", responsible: "Ana Ribeiro", stage: "Lead Frio", score: 45, iem: 0, valuePotential: 10000, lastInteraction: "3d atrás", nextAction: "Qualificar" },
  { id: 5, name: "Carlos Mendes", origin: "Evento", responsible: "Mariana Lopes", stage: "Fechou", score: 98, iem: 92, valuePotential: 35000, lastInteraction: "1h atrás", nextAction: "Onboarding" },
  { id: 6, name: "Lucia Ferreira", origin: "Meta Ads", responsible: "Rafael Costa", stage: "Follow-up", score: 88, iem: 80, valuePotential: 20000, lastInteraction: "4h atrás", nextAction: "Recontato" },
  { id: 7, name: "Roberto Almeida", origin: "Instagram", responsible: "Lucas Martins", stage: "Call Realizada", score: 75, iem: 65, valuePotential: 18000, lastInteraction: "6h atrás", nextAction: "Enviar proposta" },
  { id: 8, name: "Fernanda Lima", origin: "Instagram", responsible: "Mariana Lopes", stage: "Onboarding", score: 95, iem: 88, valuePotential: 45000, lastInteraction: "2h atrás", nextAction: "Boas-vindas" },
];

type Lead = (typeof mockLeads)[number];

const STAGE_COLORS: Record<string, string> = {
  "Lead Frio": "bg-slate-400",
  "Engajado": "bg-blue-400",
  "Warm": "bg-yellow-400",
  "Call Agendada": "bg-purple-500",
  "Call Realizada": "bg-indigo-400",
  "Follow-up": "bg-pink-400",
  "Fechou": "bg-green-500",
  "Onboarding": "bg-emerald-400",
};
const CRITICAL_STAGES = new Set(["Call Agendada", "Fechou"]);

export default function LeadsList() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const hasLeads = mockLeads.length > 0;

  const filteredLeads = mockLeads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns: DataTableColumn<Lead>[] = [
    {
      id: "lead",
      header: "Lead",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {row.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      id: "etapa",
      header: "Etapa",
      accessor: (row) => {
        const isCritical = CRITICAL_STAGES.has(row.stage);
        return (
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isCritical ? STAGE_COLORS[row.stage] : "bg-muted-foreground/40")} />
            <span className={cn("text-sm", isCritical && "font-medium")}>{row.stage}</span>
          </div>
        );
      },
    },
    {
      id: "valor",
      header: "Valor Potencial",
      align: "right",
      accessor: (row) => (
        <span className="font-medium text-success tabular-nums">
          R$ {row.valuePotential.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      id: "proxima-acao",
      header: "Próxima Ação",
      accessor: (row) => (
        <Badge variant="secondary" className="text-xs">{row.nextAction || "—"}</Badge>
      ),
    },
    {
      id: "ultima-interacao",
      header: "Última Interação",
      accessor: (row) => (
        <span className="text-sm text-muted-foreground">{row.lastInteraction}</span>
      ),
    },
    { id: "origem", header: "Origem", expandable: true, accessor: (row) => row.origin },
    { id: "responsavel", header: "Responsável", expandable: true, accessor: (row) => row.responsible },
    { id: "score", header: "Score", expandable: true, accessor: (row) => row.score },
    { id: "iem", header: "IEM", expandable: true, accessor: (row) => `${row.iem}%` },
  ];

  const actions: DataTableAction<Lead>[] = [
    {
      id: "ver",
      label: "Abrir ficha",
      icon: Eye,
      onClick: (row) => navigate(`/crm/lead/${row.id}`),
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      onClick: (row) => navigate(`/comunicacao/conversas?lead=${row.id}`),
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      onClick: () => {
        /* placeholder */
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Lista de Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão operacional dos seus leads</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      <GlobalContextSelector />

      <LeadSourceSelector />

      {!hasLeads ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState
              icon={Users}
              title="Seu CRM ainda não tem leads"
              description="Conecte um produto Eduzz, importe um CSV, ou cadastre o primeiro lead manualmente."
              primaryCta={{
                label: "Conectar produto",
                icon: Plug,
                onClick: () => navigate("/conexoes"),
              }}
              secondaryAction={
                <span className="inline-flex items-center gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => {
                      /* placeholder importar CSV */
                    }}
                  >
                    <Upload className="h-3.5 w-3.5 mr-1" />
                    Importar CSV
                  </Button>
                  <span aria-hidden="true">·</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Adicionar lead
                  </Button>
                </span>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar leads..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable<Lead>
              data={filteredLeads}
              columns={columns}
              actions={actions}
              onRowClick={(row) => navigate(`/crm/lead/${row.id}`)}
              rowKey={(row) => String(row.id)}
              emptyState={{
                icon: Users,
                title: "Seu CRM ainda não tem leads",
                description: "Conecte um produto Eduzz, importe um CSV, ou cadastre o primeiro lead manualmente.",
                cta: (
                  <Button onClick={() => navigate("/conexoes")}>
                    <Plug className="h-4 w-4 mr-2" />
                    Conectar produto
                  </Button>
                ),
                secondaryAction: (
                  <span className="inline-flex items-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => {
                        /* placeholder importar CSV */
                      }}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Importar CSV
                    </Button>
                    <span aria-hidden="true">·</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => setCreateOpen(true)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Adicionar lead
                    </Button>
                  </span>
                ),
              }}
            />
          </CardContent>
        </Card>
      )}
      <CreateLeadDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => setCreateOpen(false)}
      />
    </div>
  );
}
