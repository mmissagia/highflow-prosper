import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const pipelineStages = [
  { id: "lead-frio", title: "Lead Frio" },
  { id: "engajado", title: "Engajado" },
  { id: "warm", title: "Warm" },
  { id: "agendou", title: "Agendou" },
  { id: "call-agendada", title: "Call Agendada" },
  { id: "call-realizada", title: "Call Realizada" },
  { id: "follow-up", title: "Follow-up" },
  { id: "fechou", title: "Fechou" },
  { id: "onboarding", title: "Onboarding" },
];

const originOptions = ["Instagram", "Facebook", "LinkedIn", "Indicação", "Evento", "Outro"];

interface CreateLeadDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: (lead: any) => void;
  defaultStage?: string;
}

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  origin: "Instagram",
  stage: "lead-frio",
  dealValue: "",
  pitch: "",
};

export function CreateLeadDrawer({ open, onClose, onCreated, defaultStage }: CreateLeadDrawerProps) {
  const [form, setForm] = useState({ ...emptyForm, stage: defaultStage || "lead-frio" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.phone.trim()) newErrors.phone = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate async
    await new Promise((r) => setTimeout(r, 400));

    const newLead = {
      id: Math.floor(Math.random() * 100000),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || `${form.name.trim().toLowerCase().replace(/\s/g, ".")}@email.com`,
      origin: form.origin,
      stage: form.stage,
      dealValue: Number(form.dealValue) || 0,
      pitch: form.pitch.trim() || null,
      score: 50,
      responsible: "Não atribuído",
      lastContact: new Date().toISOString(),
    };

    onCreated(newLead);
    toast.success(`Lead ${newLead.name} criado com sucesso.`);
    setForm({ ...emptyForm, stage: defaultStage || "lead-frio" });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Novo Lead</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => toast.info("Importação de leads disponível em breve.")}
            >
              <Upload className="h-3.5 w-3.5" />
              Importar Lead
            </Button>
          </div>
          <SheetDescription>Preencha os dados do lead para adicioná-lo ao pipeline.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label>Nome *</Label>
            <Input
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">Nome é obrigatório</p>}
          </div>

          {/* Telefone */}
          <div className="space-y-1.5">
            <Label>Telefone *</Label>
            <Input
              placeholder="(11) 99999-0000"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-xs text-red-500">Telefone é obrigatório</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Origem */}
          <div className="space-y-1.5">
            <Label>Origem</Label>
            <Select value={form.origin} onValueChange={(v) => handleChange("origin", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {originOptions.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Etapa */}
          <div className="space-y-1.5">
            <Label>Etapa</Label>
            <Select value={form.stage} onValueChange={(v) => handleChange("stage", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {pipelineStages.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor estimado */}
          <div className="space-y-1.5">
            <Label>Valor estimado</Label>
            <Input
              type="number"
              placeholder="R$ 0,00"
              value={form.dealValue}
              onChange={(e) => handleChange("dealValue", e.target.value)}
            />
          </div>

          {/* Pitch */}
          <div className="space-y-1.5">
            <Label>Pitch</Label>
            <Input
              placeholder="Nome do pitch associado (opcional)"
              value={form.pitch}
              onChange={(e) => handleChange("pitch", e.target.value)}
            />
          </div>

          <Button className="w-full mt-2" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Criando...</>
            ) : (
              "Criar Lead"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
