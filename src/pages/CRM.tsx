import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Plus,
  TrendingUp,
  DollarSign,
  Target,
  Phone,
  Mail,
  MessageSquare,
  QrCode
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stages = [
  { id: "frio", name: "Lead Frio", color: "bg-muted" },
  { id: "engajado", name: "Engajado", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "warm", name: "Warm", color: "bg-orange-100 dark:bg-orange-900" },
  { id: "agendado", name: "Call Agendada", color: "bg-purple-100 dark:bg-purple-900" },
  { id: "fechou", name: "Fechou", color: "bg-success/20" },
];

const mockLeads = [
  {
    id: 1,
    name: "João Silva",
    stage: "warm",
    origem: "Instagram",
    score: 85,
    iem: 92,
    valor: 15000,
    cac: 2800,
    ltv: 24500,
    email: "joao@email.com",
    phone: "(11) 98765-4321"
  },
  {
    id: 2,
    name: "Maria Santos",
    stage: "agendado",
    origem: "Facebook",
    score: 92,
    iem: 88,
    valor: 18500,
    cac: 2200,
    ltv: 28000,
    email: "maria@email.com",
    phone: "(11) 97654-3210"
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    stage: "engajado",
    origem: "LinkedIn",
    score: 78,
    iem: 85,
    valor: 12000,
    cac: 3100,
    ltv: 21000,
    email: "pedro@email.com",
    phone: "(11) 96543-2109"
  },
];

export default function CRM() {
  const [selectedLead, setSelectedLead] = useState<number | null>(null);

  const lead = mockLeads.find(l => l.id === selectedLead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">CRM High-Ticket</h1>
          <p className="text-muted-foreground">Gestão completa do pipeline de vendas</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Lead
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar leads..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline Visual</TabsTrigger>
          <TabsTrigger value="lista">Lista de Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stages.map((stage) => (
              <Card key={stage.id} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {stage.name}
                    <Badge variant="secondary">
                      {mockLeads.filter(l => l.stage === stage.id).length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockLeads
                    .filter(lead => lead.stage === stage.id)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${stage.color}`}
                      >
                        <p className="font-medium mb-1">{lead.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Badge variant="outline" className="text-xs">
                            {lead.origem}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Score: {lead.score}</span>
                          <span className="text-success font-bold">R$ {(lead.valor / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Nome</th>
                      <th className="text-left p-4 font-medium">Etapa</th>
                      <th className="text-left p-4 font-medium">Origem</th>
                      <th className="text-left p-4 font-medium">Score</th>
                      <th className="text-left p-4 font-medium">IEM</th>
                      <th className="text-left p-4 font-medium">Valor</th>
                      <th className="text-left p-4 font-medium">CAC</th>
                      <th className="text-left p-4 font-medium">LTV</th>
                      <th className="text-left p-4 font-medium">CAC/LTV</th>
                      <th className="text-left p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLeads.map((lead) => (
                      <tr key={lead.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4 font-medium">{lead.name}</td>
                        <td className="p-4">
                          <Badge>{stages.find(s => s.id === lead.stage)?.name}</Badge>
                        </td>
                        <td className="p-4">{lead.origem}</td>
                        <td className="p-4">
                          <span className="font-medium text-primary">{lead.score}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-success">{lead.iem}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-success">R$ {lead.valor.toLocaleString()}</span>
                        </td>
                        <td className="p-4">R$ {lead.cac.toLocaleString()}</td>
                        <td className="p-4">R$ {lead.ltv.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="font-bold text-primary">
                            {(lead.ltv / lead.cac).toFixed(2)}x
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLead(lead.id)}
                          >
                            Ver Ficha
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ficha do Lead (Modal simplificado) */}
      {selectedLead && lead && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{lead.name}</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Score</p>
                <p className="text-2xl font-bold text-primary">{lead.score}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">IEM</p>
                <p className="text-2xl font-bold text-success">{lead.iem}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Valor Potencial</p>
                <p className="text-2xl font-bold text-foreground">R$ {lead.valor.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">CAC</p>
                <p className="font-bold">R$ {lead.cac.toLocaleString()}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">LTV</p>
                <p className="font-bold">R$ {lead.ltv.toLocaleString()}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">Relação</p>
                <p className="font-bold text-primary">{(lead.ltv / lead.cac).toFixed(2)}x</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">ROAS Est.</p>
                <p className="font-bold text-success">3.8x</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Contato</p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gap-2">
                <MessageSquare className="w-4 h-4" />
                Enviar Link SUN (WhatsApp)
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Mail className="w-4 h-4" />
                Enviar Link SUN (E-mail)
              </Button>
              <Button variant="outline" className="gap-2">
                <QrCode className="w-4 h-4" />
                QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
