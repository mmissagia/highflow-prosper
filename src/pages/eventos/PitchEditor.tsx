import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  QrCode,
  Copy,
  CreditCard,
  Percent,
  Gift,
  Clock,
  Users,
  Maximize,
  Landmark,
  Download,
  Sparkles,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AIBadge } from "@/components/ai";
import { getOrderBumpRecommendation } from "@/lib/aiMocks";

const pitchData = {
  id: 1,
  name: "Mentoria Elite 2024",
  type: "mentoria",
  description: "Programa de mentoria exclusivo para empreendedores high-ticket",
  price: 12000,
  lots: [
    { id: 1, name: "Lote 1", price: 10000, available: 0, status: "Esgotado" },
    { id: 2, name: "Lote 2", price: 12000, available: 15, status: "Ativo" },
    { id: 3, name: "Lote 3", price: 15000, available: 20, status: "Próximo" },
  ],
  bonuses: [
    { id: 1, name: "Acesso vitalício à comunidade", value: 2000 },
    { id: 2, name: "1 sessão individual", value: 3000 },
    { id: 3, name: "Curso de copywriting", value: 997 },
  ],
  urgency: {
    enabled: true,
    type: "timer",
    duration: 30,
  },
  payments: {
    card: true,
    installments: 12,
    pixInstallments: true,
    boletoInstallments: true,
  },
  sunLinks: [
    { id: 1, type: "Cartão", url: "https://sun.co/mentoria-elite-card", qr: true },
    { id: 2, type: "PIX", url: "https://sun.co/mentoria-elite-pix", qr: true },
    { id: 3, type: "Boleto", url: "https://sun.co/mentoria-elite-boleto", qr: true },
  ],
};

export default function PitchEditor() {
  const { id } = useParams();
  const [showQRFullscreen, setShowQRFullscreen] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [orderBumpEnabled, setOrderBumpEnabled] = useState(false);
  const [orderBumpValue, setOrderBumpValue] = useState(297);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const orderBumpRec = getOrderBumpRecommendation('mindset');

  const pitchId = id || "1";
  const qrUrl = `${window.location.origin}/checkout-ht?pitchId=${pitchId}`;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleShowQR = (url: string) => {
    setSelectedQR(url);
    setShowQRFullscreen(true);
  };

  const handleDownloadQR = () => {
    const svgEl = document.querySelector('#pitch-qrcode svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode-pitch.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/eventos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Editor de Pitch</h1>
          <p className="text-muted-foreground">Configure todos os detalhes do pitch</p>
        </div>
        <Button variant="outline" onClick={() => setQrDialogOpen(true)}>
          <QrCode className="mr-1.5 h-4 w-4" /> Gerar QR Code
        </Button>
        <Button variant="outline">Visualizar</Button>
        <Button>Salvar Pitch</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Pitch</Label>
                  <Input defaultValue={pitchData.name} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select defaultValue={pitchData.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mentoria">Mentoria</SelectItem>
                      <SelectItem value="curso">Curso</SelectItem>
                      <SelectItem value="mastermind">Mastermind</SelectItem>
                      <SelectItem value="consultoria">Consultoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea defaultValue={pitchData.description} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Preço Base</Label>
                <Input type="number" defaultValue={pitchData.price} />
              </div>
            </CardContent>
          </Card>

          {/* Lotes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Lotes de Preço
                </CardTitle>
                <Button variant="outline" size="sm">+ Novo Lote</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pitchData.lots.map((lot) => (
                  <div key={lot.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{lot.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lot.available} vagas disponíveis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold">R$ {lot.price.toLocaleString()}</p>
                      <Badge variant={lot.status === "Ativo" ? "default" : lot.status === "Esgotado" ? "destructive" : "secondary"}>
                        {lot.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bônus */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Bônus
                </CardTitle>
                <Button variant="outline" size="sm">+ Novo Bônus</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pitchData.bonuses.map((bonus) => (
                  <div key={bonus.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <p className="font-medium">{bonus.name}</p>
                    <p className="text-green-500 font-medium">Valor: R$ {bonus.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formas de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Formas de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* PASSO 1: Cartão Parcelado — primeira opção, selecionada por padrão */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">Cartão de Crédito Parcelado</p>
                    <Badge>Recomendado</Badge>
                  </div>
                  <Select defaultValue={pitchData.payments.installments.toString()}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 6, 10, 12, 18].map((n) => (
                        <SelectItem key={n} value={n.toString()}>{n}x</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground ml-6">Parcele em até 18x. Processado via Z2Pay — É High Ticket.</p>
              </div>

              {/* Cartão à vista */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cartão de Crédito à Vista</p>
                  <p className="text-sm text-muted-foreground">Pagamento integral no cartão</p>
                </div>
                <Switch defaultChecked={pitchData.payments.card} />
              </div>

              {/* PIX Parcelado */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">PIX Parcelado</p>
                  <p className="text-sm text-muted-foreground">Parcelamento via PIX</p>
                </div>
                <Switch defaultChecked={pitchData.payments.pixInstallments} />
              </div>

              {/* PASSO 2: Boleto TMB em destaque */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">Boleto TMB</p>
                    <Badge variant="outline">Alta Conversão para Tickets Altos</Badge>
                  </div>
                  <Switch defaultChecked={pitchData.payments.boletoInstallments} />
                </div>
                <p className="text-xs text-muted-foreground ml-6">Parcelamento via boleto em até 12x. Ideal para valores acima de R$ 10.000.</p>
              </div>
            </CardContent>
          </Card>

          {/* PASSO 3: Order Bump de Recorrência */}
          <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase">
                  OFERTA EXCLUSIVA
                </Badge>
              </div>
              <div>
                <p className="font-semibold text-foreground">Adicionar Acesso Recorrente à Comunidade</p>
                <p className="text-sm text-muted-foreground">Mantenha seu cliente engajado e crie uma base de receita previsível.</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">R$ {orderBumpValue}/mês</span>
                  <Badge variant="secondary" className="text-xs">Cobrado mensalmente via cartão</Badge>
                </div>
                <Switch checked={orderBumpEnabled} onCheckedChange={setOrderBumpEnabled} />
              </div>
              <div className={orderBumpEnabled ? "opacity-100" : "opacity-60"}>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Valor mensal (R$)</Label>
                  <AIBadge>Otimizado por IA</AIBadge>
                  <Input
                    type="number"
                    value={orderBumpValue}
                    onChange={(e) => setOrderBumpValue(Number(e.target.value))}
                    className="w-28 h-8 text-sm"
                    disabled={!orderBumpEnabled}
                  />
                </div>
                <p className="mt-2 inline-flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                  <span>
                    Para este perfil de lead, a probabilidade de aceite é de{" "}
                    <span className="font-medium text-foreground">{orderBumpRec.probability}%</span>{" "}
                    com {orderBumpRec.recommended}.
                  </span>
                </p>
                {orderBumpEnabled && (
                  <p className="text-xs text-primary font-medium mt-2">
                    + R$ {orderBumpValue}/mês adicionado ao total do primeiro ciclo
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Urgência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Urgência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Ativar urgência</p>
                <Switch defaultChecked={pitchData.urgency.enabled} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select defaultValue={pitchData.urgency.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timer">Cronômetro</SelectItem>
                    <SelectItem value="vagas">Vagas limitadas</SelectItem>
                    <SelectItem value="preco">Aumento de preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duração (minutos)</Label>
                <Input type="number" defaultValue={pitchData.urgency.duration} />
              </div>
            </CardContent>
          </Card>

          {/* Links SUN */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Links Checkout SUN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pitchData.sunLinks.map((link) => (
                <div key={link.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{link.type}</Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyLink(link.url)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShowQR(link.url)}>
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCodeSVG value={link.url} size={96} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Seleção de Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Enviar para Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/crm/leads">
                <Button variant="outline" className="w-full">
                  Selecionar Leads do CRM
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Code Fullscreen Modal */}
      {showQRFullscreen && (
        <div
          className="fixed inset-0 bg-white z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setShowQRFullscreen(false)}
        >
          <div className="text-center">
            {selectedQR ? (
              <QRCodeSVG value={selectedQR} size={384} />
            ) : (
              <QrCode className="h-96 w-96 text-black mx-auto" />
            )}
            <p className="text-2xl font-bold mt-8 text-black">Escaneie para comprar</p>
            <p className="text-muted-foreground mt-2">Clique em qualquer lugar para fechar</p>
          </div>
        </div>
      )}

      {/* PASSO 4: QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code do Pitch</DialogTitle>
            <DialogDescription>
              Apresente em eventos presenciais para o lead escanear e acessar a oferta.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div id="pitch-qrcode" className="rounded-lg border p-4 bg-white">
              <QRCodeSVG value={qrUrl} size={200} />
            </div>
            <p className="text-xs text-muted-foreground text-center break-all">{qrUrl}</p>
            <Button variant="outline" onClick={handleDownloadQR}>
              <Download className="mr-1.5 h-4 w-4" /> Baixar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
