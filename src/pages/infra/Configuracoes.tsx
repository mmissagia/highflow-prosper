import { Settings, Workflow, Plug, Globe, Palette, Plus, ExternalLink, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const mockPipelines = [
  { name: "High Ticket Padrão", stages: ["Novo Lead", "Qualificação", "Reunião Agendada", "Proposta Enviada", "Negociação", "Fechado"], sla: "48h por etapa" },
  { name: "Evento → Mentoria", stages: ["Inscrito", "Participou", "Interessado", "Call Agendada", "Proposta", "Fechado"], sla: "24h por etapa" },
];

const mockIntegrations = [
  { name: "WhatsApp Business", status: "connected", icon: "💬" },
  { name: "Google Calendar", status: "connected", icon: "📅" },
  { name: "Meta Ads", status: "disconnected", icon: "📢" },
  { name: "E-mail (SMTP)", status: "disconnected", icon: "📧" },
  { name: "CRM Externo", status: "disconnected", icon: "🔗" },
];

export default function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Personalize pipelines, integrações, preferências e branding da sua operação.</p>
      </div>

      <Tabs defaultValue="operacao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operacao" className="gap-1.5"><Workflow className="h-4 w-4" /> Operação</TabsTrigger>
          <TabsTrigger value="integracoes" className="gap-1.5"><Plug className="h-4 w-4" /> Integrações e Canais</TabsTrigger>
          <TabsTrigger value="preferencias" className="gap-1.5"><Globe className="h-4 w-4" /> Preferências</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5"><Palette className="h-4 w-4" /> Conta e Branding</TabsTrigger>
        </TabsList>

        {/* ── Operação ── */}
        <TabsContent value="operacao" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Configure seus pipelines, campos customizados e templates de cadência.</p>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Novo pipeline</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {mockPipelines.map((p) => (
              <Card key={p.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{p.name}</CardTitle>
                  <CardDescription>SLA: {p.sla}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stages.map((s, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs">
                        <Badge variant="secondary">{s}</Badge>
                        {i < p.stages.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3">Editar etapas</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campos customizados de Lead</CardTitle>
              <CardDescription>Adicione campos específicos da sua operação aos leads.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">Nenhum campo customizado criado ainda.</p>
              <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Criar campo</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Templates de Cadência</CardTitle>
              <CardDescription>Defina sequências de follow-up reutilizáveis.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">Nenhum template de cadência criado.</p>
              <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Criar template</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Integrações e Canais ── */}
        <TabsContent value="integracoes" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Conecte suas ferramentas e canais de comunicação.</p>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/conexoes")}>
              <ExternalLink className="h-4 w-4" /> Ver todas as integrações
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {mockIntegrations.map((int) => (
              <Card key={int.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{int.icon}</span>
                      <span className="font-medium text-sm">{int.name}</span>
                    </div>
                    <Badge variant={int.status === "connected" ? "default" : "outline"} className="text-xs">
                      {int.status === "connected" ? "Conectado" : "Desconectado"}
                    </Badge>
                  </div>
                  <Button variant={int.status === "connected" ? "ghost" : "outline"} size="sm" className="w-full">
                    {int.status === "connected" ? "Testar conexão" : "Conectar"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Preferências do Negócio ── */}
        <TabsContent value="preferencias" className="space-y-4">
          <p className="text-sm text-muted-foreground">Defina as preferências gerais da sua operação.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fuso horário</Label>
                  <Input defaultValue="America/Sao_Paulo (GMT-3)" readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Moeda padrão</Label>
                  <Input defaultValue="BRL (R$)" readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Impostos padrão</Label>
                  <Input placeholder="Ex: ISS 5%" className="bg-muted" readOnly />
                </div>
                <p className="text-xs text-muted-foreground">Configurações de localização estarão disponíveis em breve.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comissionamento Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Comissão padrão de Closer (%)</Label>
                  <Input defaultValue="10" readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Comissão padrão de SDR (%)</Label>
                  <Input defaultValue="2" readOnly className="bg-muted" />
                </div>
                <p className="text-xs text-muted-foreground">Regras de comissionamento customizáveis em breve.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Conta e Branding ── */}
        <TabsContent value="branding" className="space-y-4">
          <p className="text-sm text-muted-foreground">Personalize a identidade visual da sua operação.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Identidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da operação</Label>
                  <Input defaultValue="HighFlow" readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Domínio personalizado</Label>
                  <Input placeholder="app.suaempresa.com.br" readOnly className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">Logo</div>
                    <Button variant="outline" size="sm" disabled>Alterar logo</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Personalização de branding estará disponível em breve.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipe</CardTitle>
                <CardDescription>Gerencie os membros da sua operação.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">Acesse o módulo Comercial para gerenciar sua equipe.</p>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/comercial/equipe")}>
                  <ArrowRight className="h-4 w-4" /> Ir para Equipe
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
