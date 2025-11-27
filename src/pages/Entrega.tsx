import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Users, 
  TrendingUp,
  Calendar,
  CheckCircle,
  PlayCircle,
  FileText,
  Award,
  Video
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cursos = [
  {
    id: 1,
    titulo: "Fundamentos High-Ticket 2024",
    plataforma: "Nutror",
    progresso: 67,
    modulos: 12,
    completados: 8,
    ultimoAcesso: "Há 2 dias"
  },
  {
    id: 2,
    titulo: "Fechamento Avançado",
    plataforma: "Alpaclass",
    progresso: 34,
    modulos: 8,
    completados: 3,
    ultimoAcesso: "Há 5 dias"
  },
];

const mentorias = [
  {
    id: 1,
    programa: "Mentoria Elite 12 Meses",
    mentor: "Carlos Henrique",
    proximoEncontro: "15 Jul às 14h",
    iem: 92,
    tarefasPendentes: 3,
    materiaisNovos: 5
  },
];

const mentorados = [
  {
    id: 1,
    nome: "João Silva",
    programa: "Mentoria Elite 12 Meses",
    iem: 92,
    tarefasCompletas: 18,
    tarefasTotal: 20,
    ultimoEncontro: "12 Jul"
  },
  {
    id: 2,
    nome: "Maria Santos",
    programa: "Aceleração 6 Meses",
    iem: 88,
    tarefasCompletas: 14,
    tarefasTotal: 16,
    ultimoEncontro: "10 Jul"
  },
];

export default function Entrega() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Entrega</h1>
        <p className="text-muted-foreground">Cursos e Mentorias - Experiência Premium</p>
      </div>

      <Tabs defaultValue="cursos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cursos">Meus Cursos</TabsTrigger>
          <TabsTrigger value="mentorias">Minhas Mentorias</TabsTrigger>
          <TabsTrigger value="mentor">Painel do Mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="cursos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cursos.map((curso) => (
              <Card key={curso.id} className="border-2 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="mb-2">{curso.titulo}</CardTitle>
                      <Badge variant="outline">{curso.plataforma}</Badge>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progresso</span>
                      <span className="text-sm font-bold text-primary">{curso.progresso}%</span>
                    </div>
                    <Progress value={curso.progresso} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Módulos</p>
                      <p className="font-bold">{curso.completados}/{curso.modulos}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Último Acesso</p>
                      <p className="font-bold text-sm">{curso.ultimoAcesso}</p>
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Continuar Curso
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentorias" className="space-y-6">
          {mentorias.map((mentoria) => (
            <Card key={mentoria.id} className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-2">{mentoria.programa}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Mentor: <span className="font-medium text-foreground">{mentoria.mentor}</span>
                    </p>
                  </div>
                  <div className="p-4 bg-success/10 rounded-lg border-2 border-success/20">
                    <p className="text-xs text-muted-foreground mb-1">IEM</p>
                    <p className="text-3xl font-bold text-success">{mentoria.iem}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-medium">Próximo Encontro</span>
                  </div>
                  <p className="text-lg font-bold">{mentoria.proximoEncontro}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      <p className="text-sm font-medium">Tarefas Pendentes</p>
                    </div>
                    <p className="text-2xl font-bold">{mentoria.tarefasPendentes}</p>
                  </div>

                  <div className="p-4 border-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <p className="text-sm font-medium">Materiais Novos</p>
                    </div>
                    <p className="text-2xl font-bold">{mentoria.materiaisNovos}</p>
                  </div>

                  <div className="p-4 border-2 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-success" />
                      <p className="text-sm font-medium">Gravações</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Ver Todas
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Acessar Área da Mentoria</Button>
                  <Button variant="outline" className="gap-2">
                    <Video className="w-4 h-4" />
                    Entrar na Sala
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mentor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <p className="text-2xl font-bold mb-1">24</p>
                <p className="text-sm text-muted-foreground">Mentorados Ativos</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 text-success" />
                </div>
                <p className="text-2xl font-bold mb-1">89</p>
                <p className="text-sm text-muted-foreground">IEM Médio</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <p className="text-2xl font-bold mb-1">R$ 445k</p>
                <p className="text-sm text-muted-foreground">Receita Mentorias</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meus Mentorados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentorados.map((mentorado) => (
                <div key={mentorado.id} className="p-4 border-2 rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg">
                        {mentorado.nome.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold">{mentorado.nome}</h3>
                        <p className="text-sm text-muted-foreground">{mentorado.programa}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="p-2 bg-success/10 rounded-lg border border-success/20 inline-block">
                        <p className="text-xs text-muted-foreground">IEM</p>
                        <p className="text-xl font-bold text-success">{mentorado.iem}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Tarefas</p>
                      <p className="font-bold">{mentorado.tarefasCompletas}/{mentorado.tarefasTotal}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Último Encontro</p>
                      <p className="font-bold text-sm">{mentorado.ultimoEncontro}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button size="sm" variant="outline">Ver Detalhes</Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
