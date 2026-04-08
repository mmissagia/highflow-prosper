import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronDown, Download, Plus, Link2, Eye, Copy, MessageCircle, Pencil, XCircle, X } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { NovaCobrancaDrawer } from "./NovaCobrancaDrawer";
import { NovoLinkProdutoDrawer } from "./NovoLinkProdutoDrawer";
import {
  type Invoice, statusConfig, paymentIcons, mockInvoicesData, formatCurrency, formatDate,
} from "@/data/checkoutData";

export default function CheckoutHighTicket() {
  const [searchParams] = useSearchParams();
  const leadName = searchParams.get('leadName');
  const action = searchParams.get('action');

  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoicesData);
  const [cobrancaOpen, setCobrancaOpen] = useState(false);
  const [linkProdutoOpen, setLinkProdutoOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(!!leadName);

  useEffect(() => {
    if (action === 'cobranca') {
      setCobrancaOpen(true);
    }
  }, [action]);

  const addInvoice = useCallback((data: Omit<Invoice, "id" | "status">) => {
    const newInv: Invoice = {
      ...data,
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      status: "pendente",
    };
    setInvoices((prev) => [newInv, ...prev]);
  }, [invoices.length]);

  const filtered = invoices.filter(
    (i) =>
      i.clientName.toLowerCase().includes(search.toLowerCase()) ||
      i.clientEmail.toLowerCase().includes(search.toLowerCase())
  );

  const paidTotal = invoices.filter((i) => i.status === "paga").reduce((s, i) => s + i.value, 0);
  const pendingTotal = invoices.filter((i) => i.status === "pendente" || i.status === "enviada").reduce((s, i) => s + i.value, 0);
  const totalInvoices = invoices.length;
  const paidCount = invoices.filter((i) => i.status === "paga").length;
  const conversionRate = totalInvoices > 0 ? ((paidCount / totalInvoices) * 100).toFixed(1) : "0";
  const filteredTotal = filtered.reduce((s, i) => s + i.value, 0);

  return (
    <div className="space-y-6">
      {/* Lead banner */}
      {leadName && bannerVisible && (
        <Alert className="border-primary/30 bg-primary/5">
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm font-medium">Criando cobrança para <strong>{leadName}</strong></span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setBannerVisible(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Checkout High Ticket</h1>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%)" }}
          >
            <span className="text-base">💳</span>
            Z2Pay — É High Ticket
          </div>
        </div>
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
            <Input placeholder="Procurar por nome ou email do cliente" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Mais filtros <ChevronDown className="ml-1 h-3 w-3" /></Button>
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
              <Button variant="outline" size="sm">Ações em lote <ChevronDown className="ml-1 h-3 w-3" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Reenviar selecionados</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Cancelar selecionados</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Exportar dados</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setCobrancaOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Nova Cobrança
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLinkProdutoOpen(true)}>
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
                      <Badge variant="outline" className={sc.className}>{sc.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium text-foreground">{inv.clientName}</span>
                        <p className="text-xs text-muted-foreground">{inv.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{formatCurrency(inv.value)}</TableCell>
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
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{inv.closerInitials}</span>
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
                              <Button variant="ghost" size="icon" className="h-7 w-7"><Icon className="h-3.5 w-3.5" /></Button>
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
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
            <span>
              {filtered.length} cobranças no valor total de{" "}
              <span className="font-semibold text-foreground">{formatCurrency(filteredTotal)}</span> de{" "}
              {invoices.length} cobranças existentes.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Drawers */}
      <NovaCobrancaDrawer
        open={cobrancaOpen}
        onOpenChange={setCobrancaOpen}
        onInvoiceCreated={(data) => addInvoice(data)}
      />
      <NovoLinkProdutoDrawer
        open={linkProdutoOpen}
        onOpenChange={setLinkProdutoOpen}
        onLinkCreated={(data) => addInvoice(data)}
      />
    </div>
  );
}

function MetricMini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className="border-border/60">
      <CardContent className="px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-lg font-bold tabular-nums ${accent ? "text-amber-500" : "text-foreground"}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
