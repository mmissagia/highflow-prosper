import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Phone, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";

const activityLabels: Record<string, string> = {
  CALL: "Ligação", WHATSAPP: "WhatsApp", FOLLOW_UP: "Follow-up",
  MEETING_SCHEDULED: "Reunião Agendada", MEETING_DONE: "Reunião Realizada",
  PROPOSAL_SENT: "Proposta Enviada", DEAL_WON: "Venda Fechada",
  DEAL_LOST: "Perda", NO_SHOW: "No-show",
};

export default function Agenda() {
  const { user } = useAuth();
  const [filterUser, setFilterUser] = useState("all");

  const { data: salesUsers = [] } = useQuery({
    queryKey: ["sales_users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales_users").select("id, name").eq("status", "active");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: planned = [], isLoading } = useQuery({
    queryKey: ["sales_activities_planned", filterUser],
    queryFn: async () => {
      let query = supabase
        .from("sales_activities")
        .select("*, sales_users(name, role)")
        .eq("status", "planned")
        .order("scheduled_at", { ascending: true });
      if (filterUser !== "all") query = query.eq("sales_user_id", filterUser);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const today = new Date().toISOString().split("T")[0];
  const todayActivities = planned.filter((a: any) => a.scheduled_at?.startsWith(today));
  const futureActivities = planned.filter((a: any) => !a.scheduled_at?.startsWith(today));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agenda Comercial</h1>
          <p className="text-muted-foreground">Atividades planejadas da equipe</p>
        </div>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Profissional" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {salesUsers.map((su: any) => (
              <SelectItem key={su.id} value={su.id}>{su.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Hoje</p><p className="text-2xl font-bold">{todayActivities.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Próximas</p><p className="text-2xl font-bold">{futureActivities.length}</p></CardContent></Card>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-8">Carregando atividades</p>
      ) : planned.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Nenhuma atividade agendada</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {todayActivities.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Hoje</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {todayActivities.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{activityLabels[a.activity_type] || a.activity_type}</p>
                        <p className="text-sm text-muted-foreground">{a.sales_users?.name} • {a.scheduled_at ? new Date(a.scheduled_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                      </div>
                    </div>
                    <Link to={`/crm/lead/${a.lead_id}`}>
                      <Button variant="outline" size="sm">Ver Lead</Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {futureActivities.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Próximas</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {futureActivities.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{activityLabels[a.activity_type] || a.activity_type}</p>
                        <p className="text-sm text-muted-foreground">{a.sales_users?.name} • {a.scheduled_at ? new Date(a.scheduled_at).toLocaleDateString("pt-BR") : ""}</p>
                      </div>
                    </div>
                    <Link to={`/crm/lead/${a.lead_id}`}>
                      <Button variant="outline" size="sm">Ver Lead</Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
