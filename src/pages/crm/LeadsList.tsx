import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GlobalContextSelector } from "@/components/GlobalContextSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Plus, Eye, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import LeadSourceSelector from "@/components/crm/LeadSourceSelector";

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

const stageColors: Record<string, string> = {
  "Lead Frio": "bg-slate-500",
  "Engajado": "bg-blue-500",
  "Warm": "bg-yellow-500",
  "Call Agendada": "bg-purple-500",
  "Call Realizada": "bg-indigo-500",
  "Follow-up": "bg-pink-500",
  "Fechou": "bg-green-500",
  "Onboarding": "bg-emerald-500",
};

export default function LeadsList() {
  const hasLeads = mockLeads.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Leads</h1>
          <p className="text-muted-foreground">Visão operacional dos seus leads</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      <GlobalContextSelector />

      <LeadSourceSelector />

      {!hasLeads ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum lead encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Você ainda não tem leads nesse contexto. Clique em "Novo Lead" para adicionar manualmente ou configure uma integração para importar automaticamente.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar leads..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>IEM</TableHead>
                  <TableHead>Valor Potencial</TableHead>
                  <TableHead>Última Interação</TableHead>
                  <TableHead>Próxima Ação</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {lead.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{lead.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.origin}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{lead.responsible}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stageColors[lead.stage] || "bg-gray-500"}`} />
                        <span className="text-sm">{lead.stage}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lead.score >= 80 ? "default" : lead.score >= 60 ? "secondary" : "outline"}>
                        {lead.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.iem > 0 ? (
                        <Badge variant="outline" className="text-purple-500 border-purple-500/50">{lead.iem}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-success">
                      R$ {(lead.valuePotential / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {lead.lastInteraction}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{lead.nextAction}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/crm/lead/${lead.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
