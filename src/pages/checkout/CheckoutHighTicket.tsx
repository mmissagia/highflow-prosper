import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronDown, Download, Plus, Link2, Eye, Copy, MessageCircle, Pencil, XCircle, X, DollarSign, Clock, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NovaCobrancaDrawer } from "./NovaCobrancaDrawer";
import { NovoLinkProdutoDrawer } from "./NovoLinkProdutoDrawer";
import {
  type Invoice, statusConfig, paymentIcons, mockInvoicesData, formatCurrency, formatDate,
} from "@/data/checkoutData";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/DataTable";
import { MetricGroup, type MetricItem } from "@/components/MetricGroup";

export default function CheckoutHighTicket() {
  const [searchParams] = useSearchParams();
  const leadName = searchParams.get('leadName');
  const action = searchParams.get('action');

  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoicesData);
  const [cobrancaOpen, setCobrancaOpen] = useState(false);
  const [linkProdutoOpen, setLinkProdutoOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(!!leadName);
  const [recentlyCreatedChargeId, setRecentlyCreatedChargeId] = useState<string | null>(null);

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
    setRecentlyCreatedChargeId(newInv.id);
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

  const primaryMetrics: MetricItem[] = [
    {
      id: "faturado",
      title: "Faturado no mês",
      value: formatCurrency(paidTotal),
      icon: DollarSign,
      variant: "success",
    },
    {
      id: "pendente",
      title: "Pendente",
      value: formatCurrency(pendingTotal),
      icon: Clock,
      variant: "warning",
    },
  ];
  const secondaryMetrics: MetricItem[] = [
    { id: "faturas", title: "Faturas geradas", value: totalInvoices, icon: FileText },
    { id: "conversao", title: "Taxa de conversão", value: `${conversionRate}%`, icon: TrendingUp },
  ];

  const columns: DataTableColumn<Invoice>[] = [
    {
      id: "status",
      header: "Status",
      accessor: (inv) => {
        const sc = statusConfig[inv.status];
        return <Badge variant="outline" className={sc.className}>{sc.label}</Badge>;
      },
    },
    {
      id: "cliente",
      header: "Cliente",
      accessor: (inv) => (
        <div>
          <span className="font-medium text-foreground">{inv.clientName}</span>
          <p className="text-xs text-muted-foreground">{inv.clientEmail}</p>
        </div>
      ),
    },
    {
      id: "valor",
      header: "Valor",
      align: "right",
      accessor: (inv) => (
        <span className="font-semibold tabular-nums">{formatCurrency(inv.value)}</span>
      ),
    },
    {
      id: "produto",
      header: "Produto",
      accessor: (inv) => <span className="text-muted-foreground">{inv.description}</span>,
    },
    {
      id: "pagamento",
      header: "Pagamento",
      accessor: (inv) => (
        <TooltipProvider>
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
        </TooltipProvider>
      ),
    },
    {
      id: "vencimento",
      header: "Vencimento",
      accessor: (inv) => (
        <span className="tabular-nums text-muted-foreground">{formatDate(inv.dueDate)}</span>
      ),
    },
    {
      id: "closer",
      header: "Closer",
      expandable: true,
      accessor: (inv) => inv.closerName,
    },
  ];

  const actions: DataTableAction<Invoice>[] = [
    { id: "ver", label: "Ver detalhes", icon: Eye, onClick: () => {} },
    { id: "copy", label: "Copiar link", icon: Copy, onClick: () => {} },
    { id: "wpp", label: "Reenviar WhatsApp", icon: MessageCircle, onClick: () => {} },
    { id: "edit", label: "Editar", icon: Pencil, onClick: () => {} },
    { id: "cancel", label: "Cancelar", icon: XCircle, onClick: () => {}, variant: "destructive" },
  ];

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

      <MetricGroup primary={primaryMetrics} secondary={secondaryMetrics} />

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
          <DataTable<Invoice>
            data={filtered}
            columns={columns}
            actions={actions}
            rowKey={(inv) => inv.id}
            highlightRowId={recentlyCreatedChargeId}
            onHighlightComplete={() => setRecentlyCreatedChargeId(null)}
          />
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
