import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Phone, MessageCircle, Calendar, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";

const activityIcons: Record<string, React.ElementType> = {
  CALL: Phone, WHATSAPP: MessageCircle, FOLLOW_UP: Clock,
  MEETING_SCHEDULED: Calendar, MEETING_DONE: CheckCircle,
  PROPOSAL_SENT: ExternalLink, DEAL_WON: CheckCircle,
  DEAL_LOST: XCircle, NO_SHOW: XCircle,
};

const activityLabels: Record<string, string> = {
  CALL: "Ligação", WHATSAPP: "WhatsApp", FOLLOW_UP: "Follow-up",
  MEETING_SCHEDULED: "Reunião Agendada", MEETING_DONE: "Reunião Realizada",
  PROPOSAL_SENT: "Proposta Enviada", DEAL_WON: "Venda Fechada",
  DEAL_LOST: "Perda", NO_SHOW: "No-show",
};

const statusLabels: Record<string, string> = { planned: "Planejada", done: "Concluída", canceled: "Cancelada" };

export default function Atividades() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState("all");

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["sales_activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_activities")
        .select("*, sales_users(name, role)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filtered = filterType === "all" ? activities : activities.filter((a: any) => a.activity_type === filterType);
  const planned = filtered.filter((a: any) => a.status === "planned");
  const done = filtered.filter((a: any) => a.status === "done");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Atividades Comerciais</h1>
          <p className="text-muted-foreground">Central de atividades da equipe</p>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {Object.entries(activityLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{activities.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">A Fazer</p><p className="text-2xl font-bold text-yellow-500">{activities.filter((a: any) => a.status === "planned").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Concluídas</p><p className="text-2xl font-bold text-green-500">{activities.filter((a: any) => a.status === "done").length}</p></CardContent></Card>
      </div>

      <Card>
        <Tabs defaultValue="planned">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="planned">A Fazer ({planned.length})</TabsTrigger>
              <TabsTrigger value="done">Concluídas ({done.length})</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            {(["planned", "done"] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-8">Carregando atividades</p>
                ) : (tab === "planned" ? planned : done).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma atividade</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Lead</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resultado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tab === "planned" ? planned : done).map((a: any) => {
                        const Icon = activityIcons[a.activity_type] || Clock;
                        return (
                          <TableRow key={a.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="text-sm">{activityLabels[a.activity_type] || a.activity_type}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{a.sales_users?.name || "-"}</TableCell>
                            <TableCell>
                              <Link to={`/crm/lead/${a.lead_id}`} className="text-primary hover:underline text-sm">
                                Lead #{a.lead_id.slice(0, 6)}
                              </Link>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {a.scheduled_at ? new Date(a.scheduled_at).toLocaleDateString("pt-BR") : a.occurred_at ? new Date(a.occurred_at).toLocaleDateString("pt-BR") : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={a.status === "done" ? "default" : a.status === "planned" ? "secondary" : "outline"}>
                                {statusLabels[a.status] || a.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{a.outcome || "-"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
