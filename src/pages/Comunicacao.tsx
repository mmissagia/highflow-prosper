import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mail, 
  Smartphone,
  Zap,
  Plus,
  TrendingUp,
  Users,
  Send
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const campanhas = [
  {
    id: 1,
    nome: "Convite Evento - Imersão HTK",
    tipo: "WhatsApp",
    status: "Ativa",
    enviados: 1247,
    abertos: 892,
    cliques: 234,
    conversoes: 47
  },
  {
    id: 2,
    nome: "Follow-up Pitch Principal",
    tipo: "E-mail + SMS",
    status: "Ativa",
    enviados: 198,
    abertos: 156,
    cliques: 89,
    conversoes: 28
  },
];

const automacoes = [
  {
    id: 1,
    gatilho: "Inscrição em Evento",
    acao: "Enviar e-mail de boas-vindas + Link SUN",
    status: "Ativa",
    executadas: 247
  },
  {
    id: 2,
    gatilho: "Mudança para 'Warm' no CRM",
    acao: "WhatsApp automático com pitch e QR Code",
    status: "Ativa",
    executadas: 89
  },
  {
    id: 3,
    gatilho: "Abandono Checkout SUN",
    acao: "SMS + WhatsApp de recuperação em 2h",
    status: "Ativa",
    executadas: 34
  },
];

export default function Comunicacao() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Comunicação</h1>
          <p className="text-muted-foreground">WhatsApp, E-mail, SMS, ManyChat e IA</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Campanha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-success" />
              <Badge variant="secondary">Ativo</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">1,247</p>
            <p className="text-sm text-muted-foreground">WhatsApp enviados</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-8 h-8 text-primary" />
              <Badge variant="secondary">Ativo</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">892</p>
            <p className="text-sm text-muted-foreground">E-mails abertos</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="w-8 h-8 text-accent" />
              <Badge variant="secondary">Ativo</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">234</p>
            <p className="text-sm text-muted-foreground">SMS enviados</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-primary" />
              <Badge variant="secondary">IA</Badge>
            </div>
            <p className="text-2xl font-bold mb-1">156</p>
            <p className="text-sm text-muted-foreground">Interações IA 24/7</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campanhas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campanhas">Campanhas</TabsTrigger>
          <TabsTrigger value="automacoes">Automações</TabsTrigger>
          <TabsTrigger value="conversas">Conversas</TabsTrigger>
          <TabsTrigger value="ia">Canal IA</TabsTrigger>
        </TabsList>

        <TabsContent value="campanhas" className="space-y-4">
          {campanhas.map((campanha) => (
            <Card key={campanha.id} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{campanha.nome}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{campanha.tipo}</Badge>
                      <Badge className="bg-success text-white">{campanha.status}</Badge>
                    </div>
                  </div>
                  <Button size="sm">Editar</Button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Send className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Enviados</p>
                    </div>
                    <p className="text-xl font-bold">{campanha.enviados}</p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-primary" />
                      <p className="text-xs text-muted-foreground">Abertos</p>
                    </div>
                    <p className="text-xl font-bold">{campanha.abertos}</p>
                    <p className="text-xs text-muted-foreground">
                      {((campanha.abertos / campanha.enviados) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <p className="text-xs text-muted-foreground">Cliques</p>
                    </div>
                    <p className="text-xl font-bold">{campanha.cliques}</p>
                    <p className="text-xs text-muted-foreground">
                      {((campanha.cliques / campanha.abertos) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-success" />
                      <p className="text-xs text-muted-foreground">Conversões</p>
                    </div>
                    <p className="text-xl font-bold text-success">{campanha.conversoes}</p>
                    <p className="text-xs text-muted-foreground">
                      {((campanha.conversoes / campanha.cliques) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="automacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gatilhos e Automações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {automacoes.map((auto) => (
                <div key={auto.id} className="p-4 border-2 rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-accent" />
                        <h3 className="font-bold">{auto.gatilho}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{auto.acao}</p>
                    </div>
                    <Badge className="bg-success text-white">{auto.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Executadas: <span className="font-bold text-foreground">{auto.executadas}</span> vezes
                    </span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversas do Closer / WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Interface de conversas recentes com botão de envio rápido de link SUN + QR Code
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ia" className="space-y-4">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Canal Inteligente via WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-primary/10 rounded-lg border-2 border-primary/20">
                <h3 className="font-bold mb-2">Mentor ↔ Mentorado ↔ Plataforma</h3>
                <p className="text-sm text-muted-foreground">
                  IA 24/7 respondendo dúvidas, orientando tarefas, gerenciando agenda e fornecendo suporte contínuo aos mentorados
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-1">Interações IA</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-1">Dúvidas Resolvidas</p>
                  <p className="text-2xl font-bold">892</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm font-medium mb-1">Satisfação</p>
                  <p className="text-2xl font-bold text-success">94%</p>
                </div>
              </div>

              <Button className="w-full">
                Configurar Prompts da IA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
