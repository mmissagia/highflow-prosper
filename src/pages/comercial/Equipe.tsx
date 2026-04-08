import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, UserX, UserCheck, Users, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type SalesUser = {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  status: string;
  monthly_goal_value: number | null;
  commission_type: string | null;
  commission_percent: number | null;
  commission_fixed_value: number | null;
  cost_fixed_monthly: number | null;
};

const roleLabels: Record<string, string> = { SDR: "SDR", CLOSER: "Closer", LEADER: "Líder" };

const emptyForm = {
  name: "", role: "SDR", email: "", phone: "", status: "active",
  monthly_goal_value: 0, commission_type: "percent", commission_percent: 0,
  commission_fixed_value: 0, cost_fixed_monthly: 0,
};

export default function Equipe() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: salesUsers = [], isLoading } = useQuery({
    queryKey: ["sales_users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales_users").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as SalesUser[];
    },
    enabled: !!user,
  });

  const upsertMutation = useMutation({
    mutationFn: async (values: typeof form & { id?: string }) => {
      const payload = { ...values, user_id: user!.id };
      if (values.id) {
        const { error } = await supabase.from("sales_users").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sales_users").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales_users"] });
      toast.success(editId ? "Profissional atualizado" : "Profissional cadastrado");
      resetForm();
    },
    onError: () => toast.error("Erro ao salvar"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const newStatus = status === "active" ? "inactive" : "active";
      const { error } = await supabase.from("sales_users").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales_users"] });
      toast.success("Status atualizado");
    },
  });

  const resetForm = () => { setForm(emptyForm); setEditId(null); setOpen(false); };

  const openEdit = (su: SalesUser) => {
    setForm({
      name: su.name, role: su.role, email: su.email || "", phone: su.phone || "",
      status: su.status, monthly_goal_value: su.monthly_goal_value || 0,
      commission_type: su.commission_type || "percent",
      commission_percent: su.commission_percent || 0,
      commission_fixed_value: su.commission_fixed_value || 0,
      cost_fixed_monthly: su.cost_fixed_monthly || 0,
    });
    setEditId(su.id);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }
    upsertMutation.mutate(editId ? { ...form, id: editId } : form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipe Comercial</h1>
          <p className="text-muted-foreground">Gerencie SDRs, Closers e Líderes</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Profissional</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editId ? "Editar" : "Novo"} Profissional</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Função</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SDR">SDR</SelectItem>
                      <SelectItem value="CLOSER">Closer</SelectItem>
                      <SelectItem value="LEADER">Líder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>E-mail</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tipo Comissão</Label>
                  <Select value={form.commission_type} onValueChange={(v) => setForm({ ...form, commission_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentual</SelectItem>
                      <SelectItem value="fixed">Fixo</SelectItem>
                      <SelectItem value="hybrid">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>% Comissão</Label><Input type="number" value={form.commission_percent} onChange={(e) => setForm({ ...form, commission_percent: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Valor Fixo (R$)</Label><Input type="number" value={form.commission_fixed_value} onChange={(e) => setForm({ ...form, commission_fixed_value: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Meta Mensal (R$)</Label><Input type="number" value={form.monthly_goal_value} onChange={(e) => setForm({ ...form, monthly_goal_value: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Custo Fixo Mensal (R$)</Label><Input type="number" value={form.cost_fixed_monthly} onChange={(e) => setForm({ ...form, cost_fixed_monthly: Number(e.target.value) })} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={upsertMutation.isPending}>{editId ? "Salvar" : "Cadastrar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(["SDR", "CLOSER", "LEADER"] as const).map((r) => (
          <Card key={r}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{roleLabels[r]}s</p>
                <p className="text-2xl font-bold">{salesUsers.filter((s) => s.role === r && s.status === "active").length}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Profissionais</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          ) : salesUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum profissional cadastrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Meta Mensal</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesUsers.map((su) => (
                  <TableRow key={su.id}>
                    <TableCell className="font-medium">{su.name}</TableCell>
                    <TableCell><Badge variant="outline">{roleLabels[su.role] || su.role}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{su.email || "-"}</TableCell>
                    <TableCell>R$ {(su.monthly_goal_value || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-sm">
                      {su.commission_type === "percent" && `${su.commission_percent}%`}
                      {su.commission_type === "fixed" && `R$ ${su.commission_fixed_value}`}
                      {su.commission_type === "hybrid" && `${su.commission_percent}% + R$ ${su.commission_fixed_value}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={su.status === "active" ? "default" : "secondary"}>
                        {su.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(su)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleStatusMutation.mutate({ id: su.id, status: su.status })}>
                          {su.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
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
