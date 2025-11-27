import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  MapPin,
  Clock,
  QrCode,
  Target
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const eventos = [
  {
    id: 1,
    nome: "Imersão High-Ticket Pro",
    data: "15-17 Jul",
    local: "São Paulo - SP",
    inscritos: 247,
    checkIns: 198,
    receita: 450000,
    pitches: 3,
    conversao: 32
  },
  {
    id: 2,
    nome: "Workshop Fechamento 6 Fig",
    data: "22-23 Jul",
    local: "Online (Zoom)",
    inscritos: 189,
    checkIns: 156,
    receita: 320000,
    pitches: 2,
    conversao: 28
  },
];

const pitches = [
  {
    id: 1,
    nome: "Mentoria Elite 12 Meses",
    tipo: "Pitch Principal",
    preco: 18500,
    vendas: 42,
    receita: 777000,
    conversao: 21
  },
  {
    id: 2,
    nome: "Aceleração 6 Meses",
    tipo: "Pitch 2",
    preco: 12000,
    vendas: 38,
    receita: 456000,
    conversao: 19
  },
  {
    id: 3,
    nome: "VIP Day + Follow-up",
    tipo: "Pitch 3",
    preco: 8500,
    vendas: 28,
    receita: 238000,
    conversao: 14
  },
];

export default function Eventos() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Eventos & Pitches</h1>
          <p className="text-muted-foreground">Integração Blinket + Checkout SUN</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {eventos.map((evento) => (
          <Card key={evento.id} className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2">{evento.nome}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {evento.data}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {evento.local}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {evento.pitches} pitches
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Inscritos</p>
                  </div>
                  <p className="text-xl font-bold">{evento.inscritos}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-success" />
                    <p className="text-xs text-muted-foreground">Check-ins</p>
                  </div>
                  <p className="text-xl font-bold">{evento.checkIns}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-success" />
                    <p className="text-xs text-muted-foreground">Receita</p>
                  </div>
                  <p className="text-xl font-bold text-success">
                    R$ {(evento.receita / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <p className="text-sm font-medium">Conversão Total</p>
                  <p className="text-xs text-muted-foreground">Todos os pitches</p>
                </div>
                <p className="text-2xl font-bold text-primary">{evento.conversao}%</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Ver Detalhes</Button>
                <Button className="flex-1">Editar Pitches</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pitches Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lista" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lista">Todos os Pitches</TabsTrigger>
              <TabsTrigger value="links">Links SUN</TabsTrigger>
              <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
            </TabsList>

            <TabsContent value="lista" className="space-y-4">
              {pitches.map((pitch) => (
                <Card key={pitch.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{pitch.nome}</h3>
                        <Badge variant="secondary">{pitch.tipo}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          R$ {pitch.preco.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">valor</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Vendas</p>
                        <p className="text-xl font-bold">{pitch.vendas}</p>
                      </div>
                      <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                        <p className="text-xs text-muted-foreground mb-1">Receita</p>
                        <p className="text-xl font-bold text-success">
                          R$ {(pitch.receita / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-xs text-muted-foreground mb-1">Conversão</p>
                        <p className="text-xl font-bold text-primary">{pitch.conversao}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <QrCode className="w-4 h-4" />
                        Gerar QR Code
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Links SUN
                      </Button>
                      <Button size="sm" className="ml-auto">
                        Editar Pitch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    Lista de todos os links SUN gerados para os pitches
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qrcodes" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center py-8">
                    Galeria de QR Codes dos pitches para impressão e exibição
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
