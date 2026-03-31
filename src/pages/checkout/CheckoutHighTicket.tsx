import { useState } from "react";
import { Search, Filter, ChevronDown, Download, Plus, Link2, Eye, Copy, MessageCircle, Pencil, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";

type InvoiceStatus = "paga" | "pendente" | "enviada" | "vencida" | "cancelada";
type PaymentMethod = "pix" | "cartao" | "tmb";

interface Invoice {
  id: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  value: number;
  description: string;
  paymentMethods: PaymentMethod[];
  closerName: string;
  closerInitials: string;
  dueDate: string;
}

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  paga: { label: "Paga", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  pendente: { label: "Pendente", className: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  enviada: { label: "Enviada", className: "bg-orange-500/15 text-orange-600 border-orange-500/30" },
  vencida: { label: "Vencida", className: "bg-red-500/15 text-red-600 border-red-500/30" },
  cancelada: { label: "Cancelada", className: "bg-muted text-muted-foreground border-border" },
};

const paymentIcons: Record<PaymentMethod, { icon: string; label: string }> = {
  pix: { icon: "🟢", label: "Pix" },
  cartao: { icon: "💳", label: "Cartão Z2Pay" },
  tmb: { icon: "📄", label: "TMB" },
};

const mockInvoices: Invoice[] = [
  { id: "INV-001", status: "paga", clientName: "João Silva", clientEmail: "joao@email.com", value: 12000, description: "Mentoria Elite", paymentMethods: ["pix"], closerName: "Ana Ribeiro", closerInitials: "AR", dueDate: "2026-03-15" },
  { id: "INV-002", status: "paga", clientName: "Maria Santos", clientEmail: "maria@email.com", value: 25000, description: "Mastermind Premium", paymentMethods: ["pix", "cartao"], closerName: "Rafael Costa", closerInitials: "RC", dueDate: "2026-03-10" },
  { id: "INV-003", status: "paga", clientName: "Pedro Costa", clientEmail: "pedro@email.com", value: 8500, description: "Consultoria 1:1", paymentMethods: ["cartao"], closerName: "Lucas Martins", closerInitials: "LM", dueDate: "2026-03-12" },
  { id: "INV-004", status: "pendente", clientName: "Ana Oliveira", clientEmail: "ana@email.com", value: 50000, description: "Imersão Presencial", paymentMethods: ["pix", "cartao", "tmb"], closerName: "Ana Ribeiro", closerInitials: "AR", dueDate: "2026-04-01" },
  { id: "INV-005", status: "pendente", clientName: "Carlos Mendes", clientEmail: "carlos@email.com", value: 15000, description: "Mentoria Elite", paymentMethods: ["pix"], closerName: "Rafael Costa", closerInitials: "RC", dueDate: "2026-04-05" },
  { id: "INV-006", status: "pendente", clientName: "Fernanda Lima", clientEmail: "fernanda@email.com", value: 32000, description: "Mastermind Premium", paymentMethods: ["pix", "cartao"], closerName: "Lucas Martins", closerInitials: "LM", dueDate: "2026-04-10" },
  { id: "INV-007", status: "pendente", clientName: "Ricardo Alves", clientEmail: "ricardo@email.com", value: 7500, description: "Consultoria 1:1", paymentMethods: ["cartao"], closerName: "Ana Ribeiro", closerInitials: "AR", dueDate: "2026-04-08" },
  { id: "INV-008", status: "enviada", clientName: "Juliana Rocha", clientEmail: "juliana@email.com", value: 18000, description: "Mentoria Elite", paymentMethods: ["pix", "tmb"], closerName: "Rafael Costa", closerInitials: "RC", dueDate: "2026-04-15" },
  { id: "INV-009", status: "enviada", clientName: "Bruno Ferreira", clientEmail: "bruno@email.com", value: 42000, description: "Imersão Presencial", paymentMethods: ["pix", "cartao", "tmb"], closerName: "Lucas Martins", closerInitials: "LM", dueDate: "2026-04-12" },
  { id: "INV-010", status: "vencida", clientName: "Camila Souza", clientEmail: "camila@email.com", value: 3000, description: "Consultoria 1:1", paymentMethods: ["pix"], closerName: "Ana Ribeiro", closerInitials: "AR", dueDate: "2026-03-01" },
  { id: "INV-011", status: "vencida", clientName: "Diego Nunes", clientEmail: "diego@email.com", value: 20000, description: "Mastermind Premium", paymentMethods: ["cartao", "tmb"], closerName: "Rafael Costa", closerInitials: "RC", dueDate: "2026-02-28" },
  { id: "INV-012", status: "cancelada", clientName: "Patrícia Gomes", clientEmail: "patricia@email.com", value: 10000, description: "Mentoria Elite", paymentMethods: ["pix", "cartao"], closerName: "Lucas Martins", closerInitials: "LM", dueDate: "2026-03-20" },
];

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

export default function CheckoutHighTicket() {
  const [search, setSearch] = useState("");

  const filtered = mockInvoices.filter(
    (i) =>
      i.clientName.toLowerCase().includes(search.toLowerCase()) ||
      i.clientEmail.toLowerCase().includes(search.toLowerCase())
  );

  const paidTotal = mockInvoices.filter((i) => i.status === "paga").reduce((s, i) => s + i.value, 0);
  const pendingTotal = mockInvoices.filter((i) => i.status === "pendente" || i.status === "enviada").reduce((s, i) => s + i.value, 0);
  const totalInvoices = mockInvoices.length;
  const paidCount = mockInvoices.filter((i) => i.status === "paga").length;
  const conversionRate = totalInvoices > 0 ? ((paidCount / totalInvoices) * 100).toFixed(1) : "0";

  const filteredTotal = filtered.reduce((s, i) => s + i.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Checkout High Ticket</h1>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)",
            }}
          >
            <span className="text-base">💳</span>
            Z2Pay — É High Ticket
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricMini label="Faturado no mês" value={formatCurrency(paidTotal)} />
          <MetricMini label="Pendente" value={formatCurrency(pendingTotal)} accent />
          <MetricMini label="Faturas geradas" value={String(totalInvoices)} />
          <MetricMini label="Taxa de conversão" value={`${conversionRate}%`} />
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Procurar por nome ou email do cliente"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-1.5 h-3.5 w-3.5" /> Mais filtros <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Forma de pagamento</DropdownMenuItem>
              <DropdownMenuItem>Closer responsável</DropdownMenuItem>
              <DropdownMenuItem>Período</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Ações em lote <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Reenviar selecionados</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancelar selecionados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Exportar dados
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Nova Cobrança
          </Button>
          <Button variant="outline" size="sm">
            <Link2 className="mr-1.5 h-3.5 w-3.5" /> Novo Link de Produto
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Closer</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const sc = statusConfig[inv.status];
                return (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Badge variant="outline" className={sc.className}>
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium text-foreground">{inv.clientName}</span>
                        <p className="text-xs text-muted-foreground">{inv.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(inv.value)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{inv.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {inv.paymentMethods.map((pm) => (
                          <Tooltip key={pm}>
                            <TooltipTrigger asChild>
                              <span className="cursor-default text-base">{paymentIcons[pm].icon}</span>
                            </TooltipTrigger>
                            <TooltipContent>{paymentIcons[pm].label}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {inv.closerInitials}
                        </span>
                        <span className="text-sm">{inv.closerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{formatDate(inv.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {[
                          { icon: Eye, tip: "Ver detalhes" },
                          { icon: Copy, tip: "Copiar link" },
                          { icon: MessageCircle, tip: "Reenviar WhatsApp" },
                          { icon: Pencil, tip: "Editar" },
                          { icon: XCircle, tip: "Cancelar" },
                        ].map(({ icon: Icon, tip }) => (
                          <Tooltip key={tip}>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Icon className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{tip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {/* Footer */}
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>
              {filtered.length} cobranças no valor total de{" "}
              <span className="font-semibold text-foreground">{formatCurrency(filteredTotal)}</span> de{" "}
              {mockInvoices.length} cobranças existentes.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricMini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className="border-border/60">
      <CardContent className="px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-lg font-bold tabular-nums ${accent ? "text-amber-500" : "text-foreground"}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
