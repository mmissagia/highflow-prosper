import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { DollarSign, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

const statusLabels: Record<string, string> = { estimated: "Estimada", approved: "Aprovada", paid: "Paga" };
const statusColors: Record<string, "default" | "secondary" | "outline"> = { estimated: "secondary", approved: "default", paid: "outline" };

export default function Comissoes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["commission_records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commission_records")
        .select("*, sales_users(name, role), deals(amount_value, lead_id, stage)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("commission_records").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission_records"] });
      toast.success("Status atualizado");
    },
  });

  const filtered = filterStatus === "all" ? records : records.filter((r: any) => r.status === filterStatus);
  const totalEstimated = records.filter((r: any) => r.status === "estimated").reduce((a: number, r: any) => a + Number(r.commission_value), 0);
  const totalApproved = records.filter((r: any) => r.status === "approved").reduce((a: number, r: any) => a + Number(r.commission_value), 0);
  const totalPaid = records.filter((r: any) => r.status === "paid").reduce((a: number, r: any) => a + Number(r.commission_value), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Comissões</h1>
          <p className="text-muted-foreground">Gestão de comissões da equipe comercial</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="estimated">Estimadas</SelectItem>
            <SelectItem value="approved">Aprovadas</SelectItem>
            <SelectItem value="paid">Pagas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-yellow-500/10"><Clock className="h-6 w-6 text-yellow-500" /></div><div><p className="text-sm text-muted-foreground">Estimadas</p><p className="text-2xl font-bold">R$ {totalEstimated.toLocaleString()}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-primary/10"><CheckCircle className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Aprovadas</p><p className="text-2xl font-bold">R$ {totalApproved.toLocaleString()}</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-lg bg-green-500/10"><DollarSign className="h-6 w-6 text-green-500" /></div><div><p className="text-sm text-muted-foreground">Pagas</p><p className="text-2xl font-bold text-green-500">R$ {totalPaid.toLocaleString()}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Registros de Comissão</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Carregando comissões</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma comissão registrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Valor Deal</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.sales_users?.name || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{r.sales_users?.role || "-"}</Badge></TableCell>
                    <TableCell>R$ {Number(r.deals?.amount_value || 0).toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-green-500">R$ {Number(r.commission_value).toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{r.period_month}</TableCell>
                    <TableCell><Badge variant={statusColors[r.status]}>{statusLabels[r.status]}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {r.status === "estimated" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatusMutation.mutate({ id: r.id, status: "approved" })}>Aprovar</Button>
                        )}
                        {r.status === "approved" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatusMutation.mutate({ id: r.id, status: "paid" })}>Pagar</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
