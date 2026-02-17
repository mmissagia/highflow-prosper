import { Shield, Users, ClipboardList, AlertTriangle, UserPlus, Download, ToggleLeft, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const mockUsers = [
  { name: "Lucas Martins", email: "lucas@empresa.com", role: "Admin", modules: ["CRM", "Comercial", "Monetização", "Relatórios"], scope: "Todos" },
  { name: "Ana Ribeiro", email: "ana@empresa.com", role: "SDR", modules: ["CRM", "Comercial"], scope: "Evento: Blanket" },
  { name: "Rafael Costa", email: "rafael@empresa.com", role: "Closer", modules: ["CRM", "Comercial", "Monetização"], scope: "Todos" },
  { name: "Mariana Lopes", email: "mariana@empresa.com", role: "Gestor", modules: ["CRM", "Comercial", "Relatórios", "Experiência"], scope: "Todos" },
];

const mockAudit = [
  { date: "17/02/2026 14:32", user: "Lucas Martins", action: "Alterou comissão", entity: "Rafael Costa — 10% → 12%" },
  { date: "17/02/2026 11:05", user: "Ana Ribeiro", action: "Exportou leads", entity: "Lista de Leads (142 registros)" },
  { date: "16/02/2026 19:48", user: "Rafael Costa", action: "Moveu lead", entity: "João Silva → Proposta Enviada" },
  { date: "16/02/2026 09:12", user: "Mariana Lopes", action: "Criou automação", entity: "Follow-up 48h sem resposta" },
];

const mockAlerts = [
  { title: "Taxa de chargeback elevada", description: "3 chargebacks nos últimos 7 dias (acima do limite de 1%)", severity: "error" as const },
  { title: "Tentativas de pagamento falhando", description: "12 tentativas de cartão recusadas hoje", severity: "warn" as const },
  { title: "Login de localização incomum", description: "Lucas Martins acessou de IP desconhecido às 03:22", severity: "warn" as const },
];

const roleColors: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Gestor: "bg-accent/50 text-accent-foreground",
  Closer: "bg-secondary text-secondary-foreground",
  SDR: "bg-muted text-muted-foreground",
  Financeiro: "bg-primary/10 text-primary",
  Suporte: "bg-muted text-muted-foreground",
};

export default function Seguranca() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Segurança
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie acessos, permissões, auditoria e alertas de risco da sua operação.</p>
      </div>

      <Tabs defaultValue="acessos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="acessos" className="gap-1.5"><Users className="h-4 w-4" /> Acessos e Permissões</TabsTrigger>
          <TabsTrigger value="auditoria" className="gap-1.5"><ClipboardList className="h-4 w-4" /> Auditoria</TabsTrigger>
          <TabsTrigger value="risco" className="gap-1.5"><AlertTriangle className="h-4 w-4" /> Risco e Alertas</TabsTrigger>
        </TabsList>

        {/* ── Acessos e Permissões ── */}
        <TabsContent value="acessos" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Controle quem acessa cada módulo e com qual escopo.</p>
            <Button size="sm" className="gap-1.5"><UserPlus className="h-4 w-4" /> Convidar usuário</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Módulos</TableHead>
                    <TableHead>Escopo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleColors[u.role]}>{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {u.modules.map((m) => (
                            <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.scope}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Editar permissões</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Auditoria ── */}
        <TabsContent value="auditoria" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Histórico de ações realizadas na plataforma.</p>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Exportar auditoria</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data / Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAudit.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{a.date}</TableCell>
                      <TableCell className="font-medium">{a.user}</TableCell>
                      <TableCell>{a.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.entity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Risco e Alertas ── */}
        <TabsContent value="risco" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {mockAlerts.map((alert, i) => (
              <Card key={i} className={alert.severity === "error" ? "border-destructive/40" : "border-border"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${alert.severity === "error" ? "text-destructive" : "text-yellow-500"}`} />
                    {alert.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regras de Segurança</CardTitle>
              <CardDescription>Ative ou desative regras de proteção da operação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Exigir aprovação para alterar comissões</p>
                  <p className="text-xs text-muted-foreground">Alterações de comissão precisam de aprovação de um Admin.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Bloquear exportação para roles não-admin</p>
                  <p className="text-xs text-muted-foreground">Apenas Admins podem exportar dados de leads e relatórios.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    Integração antifraude
                    <Badge variant="outline" className="text-xs">Em breve</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">Conecte serviços de análise de risco e prevenção a chargebacks.</p>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
