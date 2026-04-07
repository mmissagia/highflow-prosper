import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Megaphone, Search, Plus, Mail, MessageCircle, Send, Eye, TrendingUp, PenTool } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { EditorContent } from "@/pages/comunicacao/EditorMensagens";

const mockCampaigns = [
  {
    id: 1,
    name: "Lançamento Mentoria Elite",
    channel: "WhatsApp",
    status: "Ativa",
    sent: 1250,
    opened: 980,
    clicked: 450,
    converted: 35,
    revenue: 420000,
  },
  {
    id: 2,
    name: "Follow-up Evento",
    channel: "Email",
    status: "Ativa",
    sent: 890,
    opened: 520,
    clicked: 180,
    converted: 12,
    revenue: 144000,
  },
  {
    id: 3,
    name: "Carrinho Abandonado",
    channel: "WhatsApp",
    status: "Pausada",
    sent: 320,
    opened: 290,
    clicked: 120,
    converted: 28,
    revenue: 84000,
  },
  {
    id: 4,
    name: "Upsell Mastermind",
    channel: "SMS",
    status: "Rascunho",
    sent: 0,
    opened: 0,
    clicked: 0,
    converted: 0,
    revenue: 0,
  },
];

const channelIcons: Record<string, any> = {
  WhatsApp: MessageCircle,
  Email: Mail,
  SMS: Send,
};

const statusColors: Record<string, string> = {
  Ativa: "bg-green-500",
  Pausada: "bg-yellow-500",
  Rascunho: "bg-slate-500",
  Concluída: "bg-blue-500",
};

export default function Campanhas() {
  const [editorOpen, setEditorOpen] = useState(false);

  const totalSent = mockCampaigns.reduce((acc, c) => acc + c.sent, 0);
  const totalConverted = mockCampaigns.reduce((acc, c) => acc + c.converted, 0);
  const totalRevenue = mockCampaigns.reduce((acc, c) => acc + c.revenue, 0);
  const avgConversion = totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas de comunicação multicanal</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setEditorOpen(true)}>
            <PenTool className="h-4 w-4 mr-2" />
            Novo Editor
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <MetricCard title="Total Enviados" value={totalSent.toLocaleString()} icon={Send} />
        <MetricCard title="Conversões" value={totalConverted.toString()} icon={TrendingUp} trend={{ value: 22, isPositive: true }} />
        <MetricCard title="Taxa Conversão" value={`${avgConversion}%`} icon={Megaphone} />
        <MetricCard title="Receita Gerada" value={`R$ ${(totalRevenue / 1000).toFixed(0)}K`} icon={TrendingUp} trend={{ value: 35, isPositive: true }} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Todas as Campanhas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar campanha..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => {
              const ChannelIcon = channelIcons[campaign.channel] || Send;
              const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(0) : 0;
              const clickRate = campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(0) : 0;

              return (
                <Card key={campaign.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <ChannelIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge className={`${statusColors[campaign.status]} text-white`}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{campaign.channel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Abertura</span>
                            <span className="font-medium">{openRate}%</span>
                          </div>
                          <Progress value={Number(openRate)} className="h-1.5" />
                        </div>

                        <div className="w-32">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Cliques</span>
                            <span className="font-medium">{clickRate}%</span>
                          </div>
                          <Progress value={Number(clickRate)} className="h-1.5" />
                        </div>

                        <div className="text-center">
                          <p className="text-xl font-bold text-green-500">{campaign.converted}</p>
                          <p className="text-xs text-muted-foreground">Conversões</p>
                        </div>

                        <div className="text-center">
                          <p className="text-xl font-bold text-primary">
                            R$ {(campaign.revenue / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-muted-foreground">Receita</p>
                        </div>

                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
        <SheetContent side="right" className="sm:max-w-[900px] w-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Editor de Mensagens</SheetTitle>
            <SheetDescription>Crie e edite mensagens para suas campanhas</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <EditorContent />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
