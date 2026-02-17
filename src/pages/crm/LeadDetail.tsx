import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import LeadComercialTab from "@/components/crm/LeadComercialTab";
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  BookOpen,
  Heart,
  QrCode,
  Send,
  Sparkles,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { MetricCard } from "@/components/MetricCard";
import { GlobalContextSelector } from "@/components/GlobalContextSelector";

const leadData = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "+55 11 99999-9999",
  stage: "Engajado",
  score: 85,
  iem: 78,
  origin: "Meta Ads",
  cac: 150,
  ltv: 15000,
  cacLtv: 100,
  roas: 10,
  createdAt: "15/01/2024",
  lastInteraction: "2h atrás",
  pitch: "Mentoria Elite",
  events: [
    { id: 1, name: "Imersão High-Ticket", date: "20/01/2024", status: "Confirmado" },
    { id: 2, name: "Workshop Vendas", date: "25/01/2024", status: "Pendente" },
  ],
  purchases: [
    { id: 1, product: "Ebook Vendas", value: 97, date: "10/01/2024", status: "Pago" },
    { id: 2, product: "Mini-curso", value: 297, date: "12/01/2024", status: "Pago" },
  ],
  courses: [
    { id: 1, name: "Fundamentos de Vendas", progress: 75 },
    { id: 2, name: "Copywriting Avançado", progress: 30 },
  ],
  mentorships: [
    { id: 1, name: "Mentoria Elite 2024", iem: 78, nextSession: "28/01/2024" },
  ],
  timeline: [
    { id: 1, action: "Comprou Ebook", date: "10/01/2024 14:30", type: "purchase" },
    { id: 2, action: "Inscrito no evento", date: "15/01/2024 10:00", type: "event" },
    { id: 3, action: "Abriu email campanha", date: "16/01/2024 09:15", type: "email" },
    { id: 4, action: "Respondeu pesquisa Blinket", date: "18/01/2024 16:45", type: "engagement" },
    { id: 5, action: "Call agendada", date: "19/01/2024 11:00", type: "call" },
  ],
  aiSuggestions: {
    nextAction: "Enviar lembrete do evento via WhatsApp",
    bestPitch: "Mentoria Elite - maior fit com perfil",
    bestChannel: "WhatsApp (taxa de resposta: 85%)",
  },
};

export default function LeadDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/crm/pipeline">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Ficha do Lead</h1>
          <p className="text-muted-foreground">Visualização completa e ações contextuais</p>
        </div>
      </div>

      <GlobalContextSelector />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Header do Lead */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {leadData.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{leadData.name}</h2>
                    <p className="text-muted-foreground">{leadData.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{leadData.stage}</Badge>
                      <Badge variant="outline">Score: {leadData.score}</Badge>
                      <Badge variant="outline" className="text-purple-500 border-purple-500/50">
                        IEM: {leadData.iem}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="icon">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard title="CAC" value={`R$ ${leadData.cac}`} icon={DollarSign} trend={{ value: 5, isPositive: true }} />
            <MetricCard title="LTV Estimado" value={`R$ ${(leadData.ltv / 1000).toFixed(0)}K`} icon={TrendingUp} trend={{ value: 12, isPositive: true }} />
            <MetricCard title="CAC/LTV" value={`${leadData.cacLtv}%`} icon={TrendingUp} />
            <MetricCard title="ROAS" value={`${leadData.roas}x`} icon={DollarSign} trend={{ value: 8, isPositive: true }} />
          </div>

          {/* Tabs de Conteúdo */}
          <Card>
            <Tabs defaultValue="timeline">
              <CardHeader>
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="comercial">Comercial</TabsTrigger>
                  <TabsTrigger value="purchases">Histórico SUN</TabsTrigger>
                  <TabsTrigger value="events">Eventos</TabsTrigger>
                  <TabsTrigger value="courses">Cursos</TabsTrigger>
                  <TabsTrigger value="mentorships">Mentorias</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="timeline" className="space-y-4">
                  {leadData.timeline.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="comercial">
                  <LeadComercialTab leadId={id || "1"} />
                </TabsContent>

                <TabsContent value="purchases" className="space-y-4">
                  {leadData.purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{purchase.product}</p>
                        <p className="text-sm text-muted-foreground">{purchase.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">R$ {purchase.value}</p>
                        <Badge variant="outline" className="text-green-500">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                  {leadData.events.map((event) => (
                    <Link key={event.id} to={`/eventos/detalhe/${event.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={event.status === "Confirmado" ? "default" : "secondary"}>
                            {event.status}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                  {leadData.courses.map((course) => (
                    <div key={course.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <p className="font-medium">{course.name}</p>
                        </div>
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="mentorships" className="space-y-4">
                  {leadData.mentorships.map((mentorship) => (
                    <Link key={mentorship.id} to={`/entrega/mentorias/${mentorship.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <Heart className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium">{mentorship.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Próxima sessão: {mentorship.nextSession}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-500 border-purple-500/50">
                            IEM: {mentorship.iem}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar Direita */}
        <div className="space-y-6">
          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2">
                <Send className="h-4 w-4" />
                Enviar Link SUN (WhatsApp)
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Enviar Link SUN (E-mail)
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <QrCode className="h-4 w-4" />
                Gerar QR Code SUN
              </Button>
              <Separator />
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Inscrever em Evento
              </Button>
            </CardContent>
          </Card>

          {/* Sugestões IA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Sugestões da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próxima Ação</p>
                <p className="text-sm">{leadData.aiSuggestions.nextAction}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Melhor Pitch</p>
                <p className="text-sm">{leadData.aiSuggestions.bestPitch}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Melhor Canal</p>
                <p className="text-sm">{leadData.aiSuggestions.bestChannel}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responsável + Handoff */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">AR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Ana Ribeiro</p>
                  <Badge variant="outline" className="text-xs">SDR</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3 rotate-180" />
                <span>Handoff para Closer</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-success/10 text-success">RC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Rafael Costa</p>
                  <Badge variant="outline" className="text-xs">Closer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefone</span>
                <span>{leadData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Origem</span>
                <Badge variant="outline">{leadData.origin}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Criado em</span>
                <span>{leadData.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última interação</span>
                <span>{leadData.lastInteraction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pitch associado</span>
                <Badge>{leadData.pitch}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
