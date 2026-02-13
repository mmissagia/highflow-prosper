import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import LeadSourceSelector from "@/components/crm/LeadSourceSelector";

const mockLeads = [
  { id: 1, name: "João Silva", origin: "Meta Ads", stage: "Engajado", score: 85, iem: 78, totalPurchased: 5000, cac: 150, ltv: 15000, cacLtv: 100, roas: 10, lastInteraction: "2h atrás" },
  { id: 2, name: "Maria Santos", origin: "Evento Blinket", stage: "Warm", score: 92, iem: 85, totalPurchased: 12000, cac: 200, ltv: 35000, cacLtv: 175, roas: 17.5, lastInteraction: "1d atrás" },
  { id: 3, name: "Pedro Costa", origin: "Indicação", stage: "Call Agendada", score: 78, iem: 72, totalPurchased: 0, cac: 50, ltv: 12000, cacLtv: 240, roas: 24, lastInteraction: "30min" },
  { id: 4, name: "Ana Oliveira", origin: "Low Ticket SUN", stage: "Lead Frio", score: 45, iem: 0, totalPurchased: 97, cac: 30, ltv: 10000, cacLtv: 333, roas: 33.3, lastInteraction: "3d atrás" },
  { id: 5, name: "Carlos Mendes", origin: "Blinket", stage: "Fechou", score: 98, iem: 92, totalPurchased: 35000, cac: 180, ltv: 50000, cacLtv: 277, roas: 27.7, lastInteraction: "1h atrás" },
  { id: 6, name: "Lucia Ferreira", origin: "Meta Ads", stage: "Follow-up", score: 88, iem: 80, totalPurchased: 8000, cac: 120, ltv: 20000, cacLtv: 166, roas: 16.6, lastInteraction: "4h atrás" },
  { id: 7, name: "Roberto Almeida", origin: "YouTube Ads", stage: "Call Realizada", score: 75, iem: 65, totalPurchased: 2500, cac: 90, ltv: 18000, cacLtv: 200, roas: 20, lastInteraction: "6h atrás" },
  { id: 8, name: "Fernanda Lima", origin: "Instagram", stage: "Onboarding", score: 95, iem: 88, totalPurchased: 25000, cac: 160, ltv: 45000, cacLtv: 281, roas: 28.1, lastInteraction: "2h atrás" },
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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Lista de Leads</h1>
          <p className="text-muted-foreground">Visualize todos os leads com métricas detalhadas</p>
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

      <LeadSourceSelector />

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
                <TableHead>Etapa</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>IEM</TableHead>
                <TableHead>Total Comprado</TableHead>
                <TableHead>CAC</TableHead>
                <TableHead>LTV</TableHead>
                <TableHead>CAC/LTV</TableHead>
                <TableHead>ROAS</TableHead>
                <TableHead>Última Interação</TableHead>
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
                      <Badge variant="outline" className="text-purple-500 border-purple-500/50">
                        {lead.iem}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-green-500">
                    R$ {lead.totalPurchased.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    R$ {lead.cac}
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {lead.ltv.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.cacLtv >= 200 ? "default" : lead.cacLtv >= 100 ? "secondary" : "destructive"}>
                      {lead.cacLtv.toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-primary">
                    {lead.roas.toFixed(1)}x
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {lead.lastInteraction}
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
    </div>
  );
}
