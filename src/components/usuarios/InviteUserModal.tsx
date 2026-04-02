import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus } from "lucide-react";

const ROLES = ["Produtor", "Gestor Comercial", "SDR", "Closer", "Mentor", "Operações", "Afiliado", "Mentorado"] as const;

const roleDescriptions: Record<string, string> = {
  Produtor: "Acesso completo a todos os módulos",
  "Gestor Comercial": "Dashboard, Pipeline, Leads, Equipe, Produtividade, Comissões, Agenda",
  SDR: "Pipeline (seus leads), Conversas, Agenda pessoal, Atividades",
  Closer: "Pipeline (leads recebidos), Ficha do Lead, Conversas, Agenda, Comissões",
  Mentor: "Painel do Mentor, Mentorias, Agenda de sessões, Comissões",
  Operações: "Eventos, Relatórios, Comissões (visualização), Configurações",
  Afiliado: "Dashboard restrito, Comissões pessoais, Link de indicação",
  Mentorado: "Área do aluno (portal separado), Conteúdo, Agenda",
};

const inviteSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  role: z.string().min(1, "Selecione um papel"),
});

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserModal({ open, onOpenChange }: InviteUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string; role: string }) => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (!userId) throw new Error("Usuário não autenticado");

      // Check if email already exists
      const { data: existing } = await supabase
        .from("users_access")
        .select("id")
        .eq("email", data.email)
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) throw new Error("Este email já possui acesso.");

      const { error } = await supabase.from("users_access").insert({
        name: data.name,
        email: data.email,
        role: data.role,
        status: "Convidado",
        user_id: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_access"] });
      toast.success("Convite enviado com sucesso!");
      resetAndClose();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const resetAndClose = () => {
    setName("");
    setEmail("");
    setRole("");
    setErrors({});
    onOpenChange(false);
  };

  const handleSubmit = () => {
    const result = inviteSchema.safeParse({ name, email, role });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate({ name: result.data.name, email: result.data.email, role: result.data.role });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); else onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar Usuário
          </DialogTitle>
          <DialogDescription>
            Envie um convite de acesso ao HighFlow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="invite-name">Nome completo *</Label>
            <Input
              id="invite-name"
              placeholder="Nome do usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-email">Email *</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label>Papel *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o papel" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
            {role && (
              <div className="rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Acesso:</span> {roleDescriptions[role]}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Enviando..." : "Enviar Convite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
