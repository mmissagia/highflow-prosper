import { useEffect, useMemo, useState } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLeadDuplicateCheck } from "@/hooks/useLeadDuplicateCheck";
import type { UnifiedLead } from "@/types/lead";

export interface ValidState {
  isValid: boolean;
  draft: { name: string; email: string | null; phone: string | null } | null;
  duplicateBlocking: UnifiedLead | null;
}

interface LeadInlineCreateFormProps {
  initialQuery: string;
  closerUserId: string;
  closerName: string;
  pipelineValue: number | null;
  pitch: string | null;
  onCancel: () => void;
  onUseExisting?: (lead: UnifiedLead) => void;
  onValidChange: (state: ValidState) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const onlyDigits = (s: string) => s.replace(/\D/g, "");

function detectField(q: string): { name: string; email: string; phone: string } {
  const trimmed = q.trim();
  if (trimmed.includes("@")) return { name: "", email: trimmed, phone: "" };
  if (onlyDigits(trimmed).length >= 6) return { name: "", email: "", phone: trimmed };
  return { name: trimmed, email: "", phone: "" };
}

export default function LeadInlineCreateForm({
  initialQuery,
  closerName,
  onCancel,
  onUseExisting,
  onValidChange,
}: LeadInlineCreateFormProps) {
  const initial = useMemo(() => detectField(initialQuery), [initialQuery]);
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);

  const [touched, setTouched] = useState<{ name: boolean; email: boolean; phone: boolean }>({
    name: false, email: false, phone: false,
  });

  const { duplicate, isChecking } = useLeadDuplicateCheck(email, phone);

  const nameTrim = name.trim();
  const nameValid = nameTrim.length >= 1;
  const emailNorm = email.trim().toLowerCase();
  const phoneDigits = onlyDigits(phone);
  const emailFormatValid = emailNorm.length === 0 || EMAIL_RE.test(emailNorm);
  const phoneFormatValid = phoneDigits.length === 0 || phoneDigits.length >= 8;
  const hasContact = (emailNorm.length > 0 && emailFormatValid) || (phoneDigits.length > 0 && phoneFormatValid);

  const isValid =
    nameValid &&
    hasContact &&
    emailFormatValid &&
    phoneFormatValid &&
    duplicate === null &&
    !isChecking;

  useEffect(() => {
    onValidChange({
      isValid,
      draft: isValid
        ? {
            name: nameTrim,
            email: emailNorm.length > 0 ? emailNorm : null,
            phone: phoneDigits.length > 0 ? phoneDigits : null,
          }
        : null,
      duplicateBlocking: duplicate,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, nameTrim, emailNorm, phoneDigits, duplicate]);

  return (
    <div className="border rounded-md p-4 bg-muted/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-help">
              <Lock className="h-3.5 w-3.5" />
              <span>Closer responsável: <span className="font-medium text-foreground">{closerName}</span></span>
            </div>
          </TooltipTrigger>
          <TooltipContent>Definido no campo acima</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {duplicate && (
        <div className="rounded-md border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-3 text-sm space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Já existe lead com este contato:{" "}
              <strong>{duplicate.name}</strong>{" "}
              ({duplicate.stage}, atribuído a {duplicate.responsible ?? "sem responsável"}). Use o lead existente.
            </p>
          </div>
          {onUseExisting && (
            <Button
              size="sm"
              variant="outline"
              className="bg-white dark:bg-transparent"
              onClick={() => onUseExisting(duplicate)}
            >
              Usar lead existente
            </Button>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="inline-name">Nome</Label>
        <Input
          id="inline-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Nome completo do lead"
        />
        {touched.name && !nameValid && (
          <p className="text-destructive text-xs">Informe o nome do lead.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inline-email">Email</Label>
        <Input
          id="inline-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="email@exemplo.com"
        />
        {touched.email && email.length > 0 && !emailFormatValid && (
          <p className="text-destructive text-xs">Formato de email inválido.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inline-phone">Telefone</Label>
        <Input
          id="inline-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          placeholder="(11) 99999-9999"
        />
        {touched.phone && phone.length > 0 && !phoneFormatValid && (
          <p className="text-destructive text-xs">Telefone precisa ter pelo menos 8 dígitos.</p>
        )}
      </div>

      {!hasContact && (touched.email || touched.phone) && (
        <p className="text-destructive text-xs">Informe ao menos email ou telefone.</p>
      )}

      <div className="flex justify-start pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel} className="text-muted-foreground">
          Cancelar criação
        </Button>
      </div>
    </div>
  );
}