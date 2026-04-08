import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalContextSelector } from "@/components/GlobalContextSelector";
import { DollarSign, TrendingUp, Users, Inbox, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLeadStageOverrides, useUpdateLeadStage } from "@/hooks/useLeadStage";
import { LeadCard, type LeadData } from "@/components/crm/LeadCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CreateLeadDrawer } from "@/components/crm/CreateLeadDrawer";

const pipelineStages = [
  { id: "lead-frio", title: "Lead Frio", color: "bg-slate-500" },
  { id: "engajado", title: "Engajado", color: "bg-blue-500" },
  { id: "warm", title: "Warm", color: "bg-yellow-500" },
  { id: "agendou", title: "Agendou", color: "bg-orange-500" },
  { id: "call-agendada", title: "Call Agendada", color: "bg-purple-500" },
  { id: "call-realizada", title: "Call Realizada", color: "bg-indigo-500" },
  { id: "follow-up", title: "Follow-up", color: "bg-pink-500" },
  { id: "fechou", title: "Fechou", color: "bg-green-500" },
  { id: "onboarding", title: "Onboarding", color: "bg-emerald-500" },
];

const initialLeads: LeadData[] = [
  {
    id: 1, name: "Rafael Mendonça", stage: "engajado", origin: "Instagram", score: 85,
    dealValue: 18000, responsible: "Carlos Lima",
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Mentoria Elite 12 meses", phone: "11991234567", email: "rafael@email.com",
  },
  {
    id: 2, name: "Fernanda Alves", stage: "call-agendada", origin: "Indicação", score: 62,
    dealValue: 12000, responsible: "Ana Souza",
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Imersão Presencial", phone: "21987654321", email: "fernanda@email.com",
  },
  {
    id: 3, name: "Thiago Correia", stage: "warm", origin: "Facebook", score: 38,
    dealValue: 8500, responsible: "Carlos Lima",
    lastContact: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: null, phone: "31976543210", email: "thiago@email.com",
  },
  {
    id: 4, name: "Juliana Martins", stage: "lead-frio", origin: "LinkedIn", score: 91,
    dealValue: 24000, responsible: "Ana Souza",
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Mastermind Anual", phone: "41965432109", email: "juliana@email.com",
  },
  {
    id: 5, name: "Bruno Figueiredo", stage: "fechou", origin: "Instagram", score: 77,
    dealValue: 15000, responsible: "Carlos Lima",
    lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pitch: "Mentoria Elite 12 meses", phone: "51954321098", email: "bruno@email.com",
  },
  {
    id: 6, name: "Lucia Ferreira", stage: "follow-up", origin: "Meta Ads", score: 88,
    dealValue: 20000, responsible: "Rafael Costa",
    lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    pitch: "Mentoria Elite", phone: "11998887766", email: "lucia@email.com",
  },
];

export default function Pipeline() {
  const [leads, setLeads] = useState(initialLeads);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const { data: stageOverrides, isLoading: stagesLoading } = useLeadStageOverrides();
  const updateLeadStage = useUpdateLeadStage();

  const getEffectiveStage = (lead: LeadData): string =>
    stageOverrides?.get(String(lead.id)) ?? lead.stage;

  const getLeadsByStage = (stageId: string) =>
    leads.filter((lead) => getEffectiveStage(lead) === stageId);

  const totalValue = leads.reduce((acc, lead) => acc + lead.dealValue, 0);
  const avgScore = Math.round(leads.reduce((acc, lead) => acc + lead.score, 0) / leads.length);

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData("leadId", String(leadId));
    setDraggingId(leadId);
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = Number(e.dataTransfer.getData("leadId"));
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const currentStage = getEffectiveStage(lead);
    if (currentStage === stageId) return;

    updateLeadStage.mutate({ leadId: String(leadId), stage: stageId });

    if (stageId === "fechou") {
      toast({
        title: "🎉 Lead fechado!",
        description: `${lead.name} foi movido para Fechou. Deseja gerar a cobrança agora?`,
        action: (
          <Link to="/checkout-ht">
            <Button size="sm" className="mt-2 transition-colors duration-150">Gerar Cobrança</Button>
          </Link>
        ),
      });
    }
    setDraggingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleLeadCreated = (novoLead: LeadData) => {
    setLeads((prev) => [novoLead, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pipeline CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus leads high-ticket</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="transition-colors duration-150">Filtrar</Button>
          <Button className="transition-colors duration-150" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Novo Lead
          </Button>
        </div>
      </div>

      <GlobalContextSelector />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span><strong className="text-foreground">{leads.length}</strong> leads no contexto atual</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card transition-all duration-150 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Leads</p><p className="text-2xl font-bold">{leads.length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-card transition-all duration-150 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10"><DollarSign className="h-6 w-6 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Valor Total Pipeline</p><p className="text-2xl font-bold">R$ {(totalValue / 1000).toFixed(0)}K</p></div>
          </CardContent>
        </Card>
        <Card className="bg-card transition-all duration-150 hover:shadow-md">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10"><TrendingUp className="h-6 w-6 text-accent" /></div>
            <div><p className="text-sm text-muted-foreground">Score Médio</p><p className="text-2xl font-bold">{avgScore}%</p></div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {pipelineStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            const stageValue = stageLeads.reduce((acc, lead) => acc + lead.dealValue, 0);

            return (
              <div
                key={stage.id}
                className="w-72 flex-shrink-0"
                onDrop={(e) => handleDrop(e, stage.id)}
                onDragOver={handleDragOver}
              >
                <Card className="bg-card/50 transition-all duration-150">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
                      </div>
                      {!stagesLoading && (
                        <Badge variant="secondary" className="text-xs">{stageLeads.length}</Badge>
                      )}
                    </div>
                    {!stagesLoading && (
                      <p className="text-xs text-muted-foreground">R$ {(stageValue / 1000).toFixed(0)}K</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stagesLoading && (
                      <>
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-32 w-full rounded-lg" />
                        ))}
                      </>
                    )}

                    {!stagesLoading && stageLeads.length === 0 && (
                      <EmptyState
                        icon={Inbox}
                        title="Nenhum lead aqui"
                        description="Arraste um lead para esta etapa ou crie um novo."
                        size="sm"
                      />
                    )}

                    {!stagesLoading && stageLeads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        draggingId={draggingId}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <CreateLeadDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleLeadCreated}
      />
    </div>
  );
}
