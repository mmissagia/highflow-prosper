import { useState } from 'react';
import { toast } from 'sonner';
import { AIBadge } from '@/components/ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const RECIPIENTS = [
  'Você (Produtor)',
  'Ana Souza (SDR)',
  'Carlos Lima (Closer)',
  'Marina Costa (Gestora)',
];

interface AlertConfig {
  id: string;
  emoji: string;
  label: string;
  hasThreshold: boolean;
  defaultThreshold: number;
  unit: string;
}

const ALERTS: AlertConfig[] = [
  { id: 'revenue', emoji: '🚨', label: 'Queda de faturamento vs semana anterior', hasThreshold: true, defaultThreshold: 10, unit: '%' },
  { id: 'lead',    emoji: '🔥', label: 'Lead quente parado', hasThreshold: true, defaultThreshold: 24, unit: 'h' },
  { id: 'payment', emoji: '💳', label: 'Pagamento crítico (PIX expirando em <)', hasThreshold: true, defaultThreshold: 6, unit: 'h' },
  { id: 'iem',     emoji: '📉', label: 'Mentorado com IEM abaixo de', hasThreshold: true, defaultThreshold: 50, unit: '%' },
];

export default function CopilotAlerts() {
  const [dailyOn, setDailyOn] = useState(true);
  const [time, setTime] = useState('08:00');
  const [recipients, setRecipients] = useState<string[]>(['Você (Produtor)']);
  const [alertsState, setAlertsState] = useState<Record<string, { on: boolean; t: number }>>(
    Object.fromEntries(ALERTS.map((a) => [a.id, { on: true, t: a.defaultThreshold }])),
  );

  const toggleRecipient = (r: string) => {
    setRecipients((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Alertas e Resumos</h1>
          <AIBadge>Copiloto</AIBadge>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Configure quais alertas e resumos automáticos serão enviados via Copiloto.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Resumo Diário</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Ativo</span>
            <Switch checked={dailyOn} onCheckedChange={setDailyOn} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horário de envio</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="max-w-[180px]" />
            </div>
            <div className="space-y-2">
              <Label>Enviar para</Label>
              <div className="flex flex-wrap gap-1.5">
                {RECIPIENTS.map((r) => (
                  <Badge
                    key={r}
                    variant={recipients.includes(r) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleRecipient(r)}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Preview do resumo</p>
            <p>🌅 Bom dia! Snapshot de hoje:</p>
            <p>• Faturamento ontem: R$ 156k (semana: R$ 782k, 59% da meta)</p>
            <p>• 73 novos leads, 11 quentes parados &gt;24h</p>
            <p>• 3 pagamentos em risco — priorizar Carlos Mendes (PIX 4h)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas configuráveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALERTS.map((a) => {
            const st = alertsState[a.id];
            return (
              <div key={a.id} className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg">{a.emoji}</span>
                  <span className="text-sm flex-1">{a.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.hasThreshold && (
                    <>
                      <Input
                        type="number"
                        value={st.t}
                        onChange={(e) =>
                          setAlertsState((prev) => ({ ...prev, [a.id]: { ...prev[a.id], t: Number(e.target.value) } }))
                        }
                        className="w-20 h-8"
                        disabled={!st.on}
                      />
                      <span className="text-xs text-muted-foreground w-4">{a.unit}</span>
                    </>
                  )}
                  <Switch
                    checked={st.on}
                    onCheckedChange={(v) =>
                      setAlertsState((prev) => ({ ...prev, [a.id]: { ...prev[a.id], on: v } }))
                    }
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success('Alertas atualizados')}>Salvar configurações</Button>
      </div>
    </div>
  );
}