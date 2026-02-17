import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalContextSelector } from "@/components/GlobalContextSelector";
import { Phone, Mail, MessageCircle, MoreHorizontal, DollarSign, TrendingUp, Users, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

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

const mockLeads = [
  { id: 1, name: "João Silva", stage: "engajado", score: 85, iem: 78, value: 15000, origin: "Meta Ads", lastContact: "2h", pitch: "Mentoria Elite", responsible: "Ana Ribeiro" },
  { id: 2, name: "Maria Santos", stage: "warm", score: 92, iem: 85, value: 25000, origin: "Evento", lastContact: "1d", pitch: "Mastermind", responsible: "Rafael Costa" },
  { id: 3, name: "Pedro Costa", stage: "call-agendada", score: 78, iem: 72, value: 12000, origin: "Indicação", lastContact: "30m", pitch: "Curso Premium", responsible: "Lucas Martins" },
  { id: 4, name: "Ana Oliveira", stage: "lead-frio", score: 45, iem: 0, value: 10000, origin: "Low Ticket", lastContact: "3d", pitch: null, responsible: "Ana Ribeiro" },
  { id: 5, name: "Carlos Mendes", stage: "fechou", score: 98, iem: 92, value: 35000, origin: "Evento", lastContact: "1h", pitch: "Mentoria VIP", responsible: "Mariana Lopes" },
  { id: 6, name: "Lucia Ferreira", stage: "follow-up", score: 88, iem: 80, value: 20000, origin: "Meta Ads", lastContact: "4h", pitch: "Mentoria Elite", responsible: "Rafael Costa" },
];

export default function Pipeline() {
  const getLeadsByStage = (stageId: string) => mockLeads.filter((lead) => lead.stage === stageId);

  const totalValue = mockLeads.reduce((acc, lead) => acc + lead.value, 0);
  const avgScore = Math.round(mockLeads.reduce((acc, lead) => acc + lead.score, 0) / mockLeads.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline CRM</h1>
          <p className="text-muted-foreground">Gerencie seus leads high-ticket</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Filtrar</Button>
          <Button>+ Novo Lead</Button>
        </div>
      </div>

      <GlobalContextSelector />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span><strong className="text-foreground">{mockLeads.length}</strong> leads no contexto atual</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold">{mockLeads.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total Pipeline</p>
              <p className="text-2xl font-bold">R$ {(totalValue / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Score Médio</p>
              <p className="text-2xl font-bold">{avgScore}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {pipelineStages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            const stageValue = stageLeads.reduce((acc, lead) => acc + lead.value, 0);

            return (
              <div key={stage.id} className="w-72 flex-shrink-0">
                <Card className="bg-card/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                        <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">{stageLeads.length}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">R$ {(stageValue / 1000).toFixed(0)}K</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stageLeads.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Inbox className="h-8 w-8 text-muted-foreground/30 mb-2" />
                        <p className="text-xs text-muted-foreground">Nenhum lead nesta etapa</p>
                      </div>
                    )}
                    {stageLeads.map((lead) => (
                      <Link key={lead.id} to={`/crm/lead/${lead.id}`}>
                        <Card className="bg-background hover:bg-muted/50 transition-colors cursor-pointer border-l-4" style={{ borderLeftColor: stage.color.replace("bg-", "var(--") }}>
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {lead.name.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{lead.name}</p>
                                  <p className="text-xs text-muted-foreground">{lead.origin}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="text-xs">Score: {lead.score}</Badge>
                              {lead.iem > 0 && (
                                <Badge variant="outline" className="text-xs text-purple-500 border-purple-500/50">IEM: {lead.iem}</Badge>
                              )}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Responsável: <span className="text-foreground">{lead.responsible}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-success">R$ {(lead.value / 1000).toFixed(0)}K</span>
                              <span className="text-muted-foreground">há {lead.lastContact}</span>
                            </div>

                            {lead.pitch && (
                              <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">{lead.pitch}</Badge>
                            )}

                            <div className="flex gap-1 pt-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Phone className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Mail className="h-3.5 w-3.5" /></Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7"><MessageCircle className="h-3.5 w-3.5" /></Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
