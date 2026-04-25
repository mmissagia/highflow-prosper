import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  ExternalLink,
  BarChart,
} from "lucide-react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Platform = "Nutror" | "Alpaclass" | "Weve";

interface Mentorship {
  id: number;
  name: string;
  platform: Platform;
  mentor: string;
  mentees: number;
  avgIem: number;
  revenue: number;
  nextSession: Date | null;
}

const mentorships: Mentorship[] = [
  { id: 1, name: "Mentoria Elite 12 Meses", platform: "Alpaclass", mentor: "Carlos Ferreira", mentees: 25, avgIem: 78, revenue: 300000, nextSession: addDays(new Date(), 3) },
  { id: 2, name: "Aceleração 6 Meses", platform: "Weve", mentor: "Ana Paula", mentees: 12, avgIem: 91, revenue: 180000, nextSession: addDays(new Date(), 1) },
  { id: 3, name: "Grupo Iniciantes", platform: "Nutror", mentor: "Roberto Lima", mentees: 25, avgIem: 65, revenue: 144000, nextSession: null },
];

const totalMentees = 62;

const iemDistribution = [
  { range: "90-100%", count: 8, color: "bg-green-700" },
  { range: "70-89%", count: 28, color: "bg-green-500" },
  { range: "50-69%", count: 18, color: "bg-yellow-500" },
  { range: "< 50%", count: 8, color: "bg-red-500" },
];

function formatCurrencyShort(value: number) {
  if (value >= 1000) return `R$ ${Math.round(value / 1000)}K`;
  return `R$ ${value}`;
}

function getIemColor(value: number) {
  if (value > 70) return "text-green-600";
  if (value >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getIemBadgeClass(value: number) {
  if (value > 70) return "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30 hover:bg-green-500/20";
  if (value >= 50) return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20";
  return "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 hover:bg-red-500/20";
}

export default function MinhasMentorias() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mentorias Conectadas</h1>
        <p className="text-muted-foreground">
          Performance das suas mentorias em Nutror, Alpaclass e Weve
        </p>
      </div>

      {/* MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Mentorias Ativas" value={3} icon={Heart} variant="primary" />
        <MetricCard title="Total Mentorados" value={62} icon={Users} />
        <Card className="border border-purple-500/20 bg-purple-50 dark:bg-purple-950/20 transition-all hover:shadow-md">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  IEM Médio
                </p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">78%</p>
                <p className="text-xs text-green-600 mt-1.5">↑ 5% vs. mês anterior</p>
              </div>
              <div className="p-2.5 rounded-lg shrink-0 bg-purple-100 dark:bg-purple-900/30">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <MetricCard title="Receita de Mentorias" value="R$ 744K" icon={DollarSign} variant="accent" />
      </div>

      {/* Distribuição de IEM */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Distribuição de Engajamento (IEM)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {iemDistribution.map((item) => (
            <div key={item.range} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.range}</span>
                <span className="text-muted-foreground">{item.count} mentorados</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={cn("h-3 rounded-full transition-all", item.color)}
                  style={{ width: `${(item.count / totalMentees) * 100}%` }}
                />
              </div>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t text-sm">
            <span className="text-green-600 font-medium">58% acima de 70%</span>
            <span className="text-red-600 font-medium">13% em risco (&lt; 50%)</span>
          </div>
        </CardContent>
      </Card>

      {/* Grid de mentorias */}
      <div className="grid grid-cols-1 gap-4">
        {mentorships.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              {/* Linha 1: nome + plataforma */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg leading-snug">{m.name}</h3>
                    <Badge variant="outline">{m.platform}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Mentor: {m.mentor}</p>
                </div>
              </div>

              {/* Linha 3: mini-métricas 2x2 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{m.mentees}</p>
                    <p className="text-xs text-muted-foreground">Mentorados ativos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <Badge variant="outline" className={cn(getIemBadgeClass(m.avgIem))}>
                      {m.avgIem}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">IEM Médio</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{formatCurrencyShort(m.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Receita</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {m.nextSession
                        ? format(m.nextSession, "dd 'de' MMM", { locale: ptBR })
                        : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">Próxima sessão</p>
                  </div>
                </div>
              </div>

              {/* Linha 4: ações */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Ver no {m.platform}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Filtro por produto em breve",
                      description: `Em breve você poderá ver os leads de "${m.name}".`,
                    });
                    navigate("/crm/leads");
                  }}
                >
                  Ver Leads
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}