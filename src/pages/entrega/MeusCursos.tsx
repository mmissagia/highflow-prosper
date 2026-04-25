import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  CheckCircle,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow, subDays, subHours } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MetricCard } from "@/components/MetricCard";
import { toast } from "@/hooks/use-toast";

type Platform = "Nutror" | "Alpaclass" | "Weve";

interface Course {
  id: number;
  name: string;
  platform: Platform;
  progress: number;
  totalModules: number;
  completedModules: number;
  enrolled: number;
  revenue: number;
  lastSync: Date;
}

const courses: Course[] = [
  { id: 1, name: "Fundamentos de Vendas High-Ticket", platform: "Nutror", progress: 68, totalModules: 12, completedModules: 8, enrolled: 342, revenue: 171000, lastSync: subHours(new Date(), 6) },
  { id: 2, name: "Copywriting para Conversão", platform: "Alpaclass", progress: 85, totalModules: 8, completedModules: 7, enrolled: 189, revenue: 94500, lastSync: subHours(new Date(), 12) },
  { id: 3, name: "Estratégias de Lançamento", platform: "Nutror", progress: 45, totalModules: 10, completedModules: 5, enrolled: 412, revenue: 123600, lastSync: subHours(new Date(), 6) },
  { id: 4, name: "Mindset do Empreendedor", platform: "Weve", progress: 92, totalModules: 6, completedModules: 6, enrolled: 56, revenue: 28000, lastSync: subDays(new Date(), 1) },
  { id: 5, name: "Comunicação Persuasiva", platform: "Weve", progress: 34, totalModules: 8, completedModules: 3, enrolled: 78, revenue: 39000, lastSync: subHours(new Date(), 3) },
];

const platformOptions: Array<"Todas" | Platform> = ["Todas", "Nutror", "Alpaclass", "Weve"];

function formatCurrencyShort(value: number) {
  if (value >= 1000) return `R$ ${Math.round(value / 1000)}K`;
  return `R$ ${value}`;
}

export default function MeusCursos() {
  const navigate = useNavigate();
  const [platformFilter, setPlatformFilter] = useState<"Todas" | Platform>("Todas");

  const filtered = useMemo(
    () => (platformFilter === "Todas" ? courses : courses.filter((c) => c.platform === platformFilter)),
    [platformFilter],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cursos Conectados</h1>
        <p className="text-muted-foreground">
          Performance dos seus cursos em Nutror, Alpaclass e Weve
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Cursos Ativos" value={5} icon={BookOpen} variant="primary" />
        <MetricCard title="Total de Alunos" value={999} icon={Users} />
        <MetricCard
          title="Taxa de Conclusão Média"
          value="62%"
          icon={CheckCircle}
          trend={{ value: 4, isPositive: true }}
          variant="green"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {platformOptions.map((opt) => (
          <Button
            key={opt}
            size="sm"
            variant={platformFilter === opt ? "default" : "outline"}
            onClick={() => setPlatformFilter(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <Progress value={course.progress} className="h-2 rounded-none" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-snug">{course.name}</h3>
                  <Badge variant="outline" className="mt-1">{course.platform}</Badge>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-primary">{course.progress}%</p>
                  <p className="text-xs text-muted-foreground">Conclusão média</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <BookOpen className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {course.completedModules}/{course.totalModules}
                  </p>
                  <p className="text-xs text-muted-foreground">Módulos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{course.enrolled}</p>
                  <p className="text-xs text-muted-foreground">Alunos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{formatCurrencyShort(course.revenue)}</p>
                  <p className="text-xs text-muted-foreground">Receita</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Último sync:{" "}
                {formatDistanceToNow(course.lastSync, { addSuffix: true, locale: ptBR })}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Ver no {course.platform}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Filtro por produto em breve",
                      description: `Em breve você poderá ver os leads de "${course.name}".`,
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