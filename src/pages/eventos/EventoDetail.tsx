import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  QrCode,
  CheckCircle,
  Clock,
  MessageSquare,
  BarChart,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { AIBadge } from "@/components/ai";
import { getEventConversionForecast } from "@/lib/aiMocks";

const eventData = {
  id: 1,
  name: "Imersão High-Ticket 2024",
  date: "20/01/2024",
  time: "09:00 - 18:00",
  location: "São Paulo - SP",
  registrations: 245,
  checkins: 198,
  revenue: 125000,
  cac: 120,
  ltv: 18000,
  roas: 15,
  status: "Ativo",
  pitches: [
    { id: 1, name: "Mentoria Elite", price: 12000, conversions: 15, revenue: 180000 },
    { id: 2, name: "Mastermind VIP", price: 25000, conversions: 5, revenue: 125000 },
    { id: 3, name: "Curso Premium", price: 3000, conversions: 35, revenue: 105000 },
  ],
  attendees: [
    { id: 1, name: "João Silva", checkin: true, engagement: 92 },
    { id: 2, name: "Maria Santos", checkin: true, engagement: 88 },
    { id: 3, name: "Pedro Costa", checkin: false, engagement: 0 },
    { id: 4, name: "Ana Oliveira", checkin: true, engagement: 75 },
    { id: 5, name: "Carlos Mendes", checkin: true, engagement: 95 },
  ],
  preEventEngagement: [
    { type: "Pesquisa", responses: 180, rate: 73 },
    { type: "Enquete tema", responses: 156, rate: 64 },
    { type: "Confirmação", responses: 198, rate: 81 },
  ],
  duringEventEngagement: [
    { type: "Perguntas ao vivo", count: 45 },
    { type: "Reações", count: 320 },
    { type: "QR Code scans", count: 89 },
  ],
};

export default function EventoDetail() {
  const { id } = useParams();
  const checkinRate = ((eventData.checkins / eventData.registrations) * 100).toFixed(0);
  const totalPitchRevenue = eventData.pitches.reduce((acc, p) => acc + p.revenue, 0);
  const forecast = getEventConversionForecast(eventData.name, eventData.registrations);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/eventos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{eventData.name}</h1>
            <Badge className="bg-green-500 text-white">{eventData.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            {eventData.date} • {eventData.time} • {eventData.location}
          </p>
        </div>
        <Button variant="outline">Editar Evento</Button>
      </div>

      <div className="border-l-4 border-l-primary bg-primary/5 rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AIBadge variant="default" />
          <h3 className="text-sm font-semibold text-foreground">{forecast.title}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background/60 border border-border rounded-md p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Previsão de conversão
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {forecast.forecastRange.min}–{forecast.forecastRange.max}
            </p>
            <p className="text-xs text-muted-foreground">vendas esperadas</p>
          </div>
          <div className="bg-background/60 border border-border rounded-md p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
              Receita estimada
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              R$ {(forecast.revenueRange.min / 1000).toFixed(0)}k–{(forecast.revenueRange.max / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground">Confiança: {forecast.confidence}%</p>
          </div>
        </div>

        <div className="pt-3 border-t border-primary/20 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <p className="text-sm font-medium text-foreground">Para maximizar:</p>
          </div>
          <ul className="space-y-1">
            {forecast.recommendations.map((r, i) => (
              <li key={i} className="text-xs text-muted-foreground flex gap-2">
                <span className="text-muted-foreground/60">•</span>
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <MetricCard title="Inscritos" value={eventData.registrations.toString()} icon={Users} />
        <MetricCard title="Check-ins" value={`${eventData.checkins} (${checkinRate}%)`} icon={CheckCircle} />
        <MetricCard title="Receita Total" value={`R$ ${(totalPitchRevenue / 1000).toFixed(0)}K`} icon={DollarSign} trend={{ value: 25, isPositive: true }} />
        <MetricCard title="CAC Médio" value={`R$ ${eventData.cac}`} icon={TrendingUp} />
        <MetricCard title="ROAS" value={`${eventData.roas}x`} icon={BarChart} trend={{ value: 12, isPositive: true }} />
      </div>

      <Tabs defaultValue="pitches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pitches">Pitches</TabsTrigger>
          <TabsTrigger value="attendees">Participantes</TabsTrigger>
          <TabsTrigger value="pre-event">Engajamento Pré</TabsTrigger>
          <TabsTrigger value="during-event">Engajamento Durante</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="pitches" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pitches Configurados</h2>
            <Link to="/eventos/pitch/new">
              <Button>+ Novo Pitch</Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {eventData.pitches.map((pitch) => (
              <Link key={pitch.id} to={`/eventos/pitch/${pitch.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{pitch.name}</h3>
                      <Button variant="outline" size="icon">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço</span>
                        <span className="font-medium">R$ {pitch.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Conversões</span>
                        <span className="font-medium text-green-500">{pitch.conversions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Receita</span>
                        <span className="font-bold text-primary">
                          R$ {(pitch.revenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                    <Button className="w-full">
                      <QrCode className="h-4 w-4 mr-2" />
                      Exibir QR Code
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Participantes ({eventData.registrations})</CardTitle>
                <Badge variant="outline">{eventData.checkins} check-ins</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventData.attendees.map((attendee) => (
                  <Link key={attendee.id} to={`/crm/lead/${attendee.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {attendee.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <div className="flex items-center gap-2">
                            {attendee.checkin ? (
                              <Badge variant="outline" className="text-green-500 border-green-500/50">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Check-in
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                                <Clock className="h-3 w-3 mr-1" />
                                Aguardando
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {attendee.engagement > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Engajamento</p>
                          <p className="font-bold text-primary">{attendee.engagement}%</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pre-event">
          <Card>
            <CardHeader>
              <CardTitle>Engajamento Pré-Evento (Blinket)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {eventData.preEventEngagement.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.responses} respostas ({item.rate}%)
                    </span>
                  </div>
                  <Progress value={item.rate} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="during-event">
          <Card>
            <CardHeader>
              <CardTitle>Engajamento Durante o Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {eventData.duringEventEngagement.map((item, idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-3xl font-bold">{item.count}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversão por Pitch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eventData.pitches.map((pitch) => (
                  <div key={pitch.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{pitch.name}</span>
                      <span className="text-sm">
                        {pitch.conversions} vendas ({((pitch.conversions / eventData.checkins) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={(pitch.conversions / eventData.checkins) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">CAC Médio</span>
                  <span className="font-bold">R$ {eventData.cac}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">LTV Médio</span>
                  <span className="font-bold">R$ {eventData.ltv.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Relação CAC/LTV</span>
                  <span className="font-bold text-green-500">
                    {((eventData.ltv / eventData.cac) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">ROAS</span>
                  <span className="font-bold text-primary">{eventData.roas}x</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
