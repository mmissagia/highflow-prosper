import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Lock, Shield, AlertCircle, Check, Pencil, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type PayType = "pix" | "cartao" | "tmb";

interface PaymentLine {
  id: string;
  type: PayType;
  value: number;
  installments: number;
  firstDue?: string;
}

interface PaymentLinkRow {
  id: string;
  lead_name: string;
  lead_email: string | null;
  lead_phone: string | null;
  description: string;
  value: number;
  payment_lines: PaymentLine[];
  closer_name: string | null;
  closer_initials: string | null;
  status: "pending" | "paid" | "expired" | "cancelled";
  paid_method: string | null;
}

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

const methodLabel: Record<PayType, string> = {
  pix: "Pix",
  cartao: "Cartão Z2Pay",
  tmb: "Boleto TMB",
};

const methodIcon: Record<PayType, string> = {
  pix: "🟢",
  cartao: "💳",
  tmb: "📄",
};

function HighFlowMark() {
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600" />
      <span className="text-lg font-semibold tracking-tight text-foreground">HighFlow</span>
    </div>
  );
}

function PageFooter() {
  return (
    <div className="mt-6 space-y-2 text-center text-xs text-muted-foreground">
      <p>
        Pagamento processado por{" "}
        <span style={{ color: "#7C3AED" }} className="font-semibold">Z2Pay</span> — TMB — PIX
      </p>
      <div className="flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1"><Lock className="h-3 w-3" /> SSL</span>
        <span className="inline-flex items-center gap-1"><Shield className="h-3 w-3" /> Ambiente seguro</span>
      </div>
    </div>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-[560px] px-4 py-8">
        <HighFlowMark />
        {children}
        <PageFooter />
      </div>
    </div>
  );
}

function StateCard({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}

function CustomerFields({
  data, onChange, prefilled,
}: {
  data: { name: string; cpf: string; email: string; phone: string };
  onChange: (v: typeof data) => void;
  prefilled: { name: boolean; email: boolean; phone: boolean };
}) {
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const lock = (k: string, isPrefilled: boolean) => isPrefilled && !editing[k];
  const renderEdit = (k: string) => (
    <button
      type="button"
      className="text-xs text-muted-foreground hover:text-foreground"
      onClick={() => setEditing((s) => ({ ...s, [k]: true }))}
    >
      <Pencil className="inline h-3 w-3" /> editar
    </button>
  );
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Nome completo</Label>
          {prefilled.name && !editing.name && renderEdit("name")}
        </div>
        <Input value={data.name} readOnly={lock("name", prefilled.name)} onChange={(e) => onChange({ ...data, name: e.target.value })} />
      </div>
      <div className="space-y-1">
        <Label>CPF</Label>
        <Input value={data.cpf} placeholder="000.000.000-00" onChange={(e) => onChange({ ...data, cpf: e.target.value })} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>E-mail</Label>
          {prefilled.email && !editing.email && renderEdit("email")}
        </div>
        <Input type="email" value={data.email} readOnly={lock("email", prefilled.email)} onChange={(e) => onChange({ ...data, email: e.target.value })} />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Celular</Label>
          {prefilled.phone && !editing.phone && renderEdit("phone")}
        </div>
        <Input value={data.phone} readOnly={lock("phone", prefilled.phone)} onChange={(e) => onChange({ ...data, phone: e.target.value })} />
      </div>
    </div>
  );
}

function CardFields() {
  return <CardFieldsInner />;
}

function CardFieldsInner() {
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Número do cartão</Label>
        <Input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="0000 0000 0000 0000" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Validade</Label>
          <Input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/AA" />
        </div>
        <div className="space-y-1">
          <Label>CVV</Label>
          <Input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} placeholder="000" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Nome impresso no cartão</Label>
        <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
      </div>
    </div>
  );
}

function MethodForm({
  line,
  customer,
  setCustomer,
  prefilled,
  onPay,
  isPaying,
}: {
  line: PaymentLine;
  customer: { name: string; cpf: string; email: string; phone: string };
  setCustomer: (c: typeof customer) => void;
  prefilled: { name: boolean; email: boolean; phone: boolean };
  onPay: (method: PayType) => void;
  isPaying: boolean;
}) {
  const installmentValue = line.value / Math.max(1, line.installments);

  if (line.type === "cartao") {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-muted/50 p-3 text-sm">
          <p className="font-medium">
            {line.installments}x {formatCurrency(installmentValue)}
          </p>
          <p className="text-xs text-muted-foreground">Total {formatCurrency(line.value)}</p>
          <span className="mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "#7C3AED15", color: "#7C3AED" }}>
            Z2Pay — TMB — PIX
          </span>
        </div>
        <CustomerFields data={customer} onChange={setCustomer} prefilled={prefilled} />
        <CardFields />
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPaying} onClick={() => onPay("cartao")}>
          {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Pagar {formatCurrency(line.value)}
        </Button>
      </div>
    );
  }

  if (line.type === "pix") {
    return <PixForm line={line} customer={customer} setCustomer={setCustomer} prefilled={prefilled} onPay={onPay} isPaying={isPaying} />;
  }

  // tmb
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3 text-sm">
        <p className="font-medium">{line.installments}x {formatCurrency(installmentValue)}</p>
        <p className="text-xs text-muted-foreground">Boleto financiado via TMB — análise rápida</p>
      </div>
      <CustomerFields data={customer} onChange={setCustomer} prefilled={prefilled} />
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPaying} onClick={() => onPay("tmb")}>
        {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Gerar boletos {formatCurrency(line.value)}
      </Button>
    </div>
  );
}

export default function PublicCheckout() {
  // placeholder to keep diff anchor
  const { linkId } = useParams<{ linkId: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaymentLinkRow | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [customer, setCustomer] = useState({ name: "", cpf: "", email: "", phone: "" });
  const [singleFormDialogOpen, setSingleFormDialogOpen] = useState(false);
  const [overrideLine, setOverrideLine] = useState<PaymentLine | null>(null);

  const [isPaying, setIsPaying] = useState(false);
  const [paidMethod, setPaidMethod] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!linkId) { setNotFound(true); setLoading(false); return; }
      const { data: row, error } = await supabase
        .from("payment_links")
        .select("*")
        .eq("id", linkId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !row) {
        setNotFound(true);
      } else {
        const r = row as unknown as PaymentLinkRow;
        setData(r);
        setCustomer({
          name: r.lead_name && r.lead_name !== "Cliente (link de produto)" ? r.lead_name : "",
          cpf: "",
          email: r.lead_email ?? "",
          phone: r.lead_phone ?? "",
        });
        if (r.status === "paid") setPaidMethod(r.paid_method ?? "—");
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [linkId]);

  const handlePay = async (method: PayType) => {
    if (!data) return;
    setIsPaying(true);
    await new Promise((r) => setTimeout(r, 2000));
    const { error } = await supabase
      .from("payment_links")
      .update({ status: "paid", paid_method: method, paid_at: new Date().toISOString() })
      .eq("id", data.id);
    setIsPaying(false);
    if (!error) {
      setPaidMethod(method);
      setData({ ...data, status: "paid", paid_method: method });
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-3 h-10 w-3/4" />
          <Skeleton className="mt-2 h-12 w-1/2" />
          <Skeleton className="mt-6 h-32 w-full" />
        </div>
      </PageShell>
    );
  }

  if (notFound || !data) {
    return (
      <PageShell>
        <StateCard
          icon={<AlertCircle className="h-6 w-6 text-muted-foreground" />}
          title="Link não encontrado ou expirado"
          hint="Se você espera receber um pagamento, peça um novo link ao responsável."
        />
      </PageShell>
    );
  }

  if (data.status === "expired") {
    return <PageShell><StateCard icon={<AlertCircle className="h-6 w-6 text-muted-foreground" />} title="Este link expirou" /></PageShell>;
  }
  if (data.status === "cancelled") {
    return <PageShell><StateCard icon={<AlertCircle className="h-6 w-6 text-muted-foreground" />} title="Este link foi cancelado" /></PageShell>;
  }

  if (data.status === "paid" || paidMethod) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-border bg-background p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
            <Check className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-lg font-semibold text-foreground">Pagamento confirmado</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{formatCurrency(data.value)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            pago via {methodLabel[(paidMethod || data.paid_method || "pix") as PayType] ?? paidMethod}
          </p>
          {data.lead_email && (
            <p className="mt-4 text-sm text-muted-foreground">
              Você receberá um e-mail em <span className="font-medium text-foreground">{data.lead_email}</span> com os próximos passos.
            </p>
          )}
          <Button variant="outline" className="mt-6" onClick={() => { /* mock */ }}>Voltar</Button>
        </div>
      </PageShell>
    );
  }

  const lines = data.payment_lines ?? [];
  const isComposite = lines.length >= 2;
  const prefilled = {
    name: !!data.lead_name && data.lead_name !== "Cliente (link de produto)",
    email: !!data.lead_email,
    phone: !!data.lead_phone,
  };

  return (
    <PageShell>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        {/* Offer header */}
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Cobrança · #{data.id}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "Plus Jakarta Sans, system-ui, sans-serif" }}>
          {data.description}
        </h2>
        <p className="mt-3 text-4xl font-bold tabular-nums text-foreground">
          {formatCurrency(Number(data.value))}
        </p>
        {data.closer_name && (
          <p className="mt-2 text-xs text-muted-foreground">
            Closer: {data.closer_initials ?? ""} · {data.closer_name}
          </p>
        )}

        <div className="my-6 h-px bg-border" />

        {/* Payment area */}
        {overrideLine ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Pagar com {methodLabel[overrideLine.type]}</h3>
            <MethodForm
              line={overrideLine}
              customer={customer}
              setCustomer={setCustomer}
              prefilled={prefilled}
              onPay={handlePay}
              isPaying={isPaying}
            />
            <button
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => setOverrideLine(null)}
              type="button"
            >
              ← voltar ao plano sugerido
            </button>
          </div>
        ) : !isComposite ? (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Pagar com {lines[0] ? methodLabel[lines[0].type] : "Pix"}
            </h3>
            {lines[0] && (
              <MethodForm
                line={lines[0]}
                customer={customer}
                setCustomer={setCustomer}
                prefilled={prefilled}
                onPay={handlePay}
                isPaying={isPaying}
              />
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 rounded-md border border-violet-500/20 bg-violet-500/5 p-3 text-sm">
              <p className="font-medium text-foreground">💡 Plano sugerido pelo Closer</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {lines.map((l, i) => `${i === 0 ? "Entrada em" : "Saldo em"} ${methodLabel[l.type]}${l.installments > 1 ? ` ${l.installments}x` : ""}`).join(" → ")}
              </p>
            </div>
            <Accordion type="single" collapsible defaultValue={lines[0]?.id} className="space-y-2">
              {lines.map((line, idx) => (
                <AccordionItem key={line.id} value={line.id} className="rounded-md border border-border px-3">
                  <AccordionTrigger className="text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Etapa {idx + 1}</span>
                      <span>{methodIcon[line.type]} {methodLabel[line.type]}</span>
                      <span className="text-xs text-muted-foreground">
                        {line.installments > 1 ? `${line.installments}x ` : ""}{formatCurrency(line.value / Math.max(1, line.installments))}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <MethodForm
                      line={line}
                      customer={customer}
                      setCustomer={setCustomer}
                      prefilled={prefilled}
                      onPay={handlePay}
                      isPaying={isPaying}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <button
              type="button"
              className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline"
              onClick={() => setSingleFormDialogOpen(true)}
            >
              Prefiro pagar tudo em uma forma só
            </button>
          </>
        )}
      </div>

      <Dialog open={singleFormDialogOpen} onOpenChange={setSingleFormDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Escolha uma forma única</DialogTitle>
            <DialogDescription>Substituirá o plano sugerido por uma forma de pagamento integral.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {([
              { type: "cartao" as PayType, label: "Cartão Z2Pay em até 12x", installments: 12 },
              { type: "pix" as PayType, label: "Pix do valor total", installments: 1 },
              { type: "tmb" as PayType, label: "Boleto TMB parcelado", installments: 12 },
            ]).map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  setOverrideLine({
                    id: `override-${opt.type}`,
                    type: opt.type,
                    value: Number(data.value),
                    installments: opt.installments,
                  });
                  setSingleFormDialogOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left text-sm hover:bg-muted/50"
              >
                <span>{methodIcon[opt.type]} {opt.label}</span>
                <span className="text-xs text-muted-foreground">{formatCurrency(Number(data.value))}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}