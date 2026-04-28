import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Phone, Video, MoreVertical } from 'lucide-react';
import { AIBadge } from '@/components/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Bubble {
  from: 'user' | 'bot';
  text: string;
  time: string;
}

const CONVERSATION: Bubble[] = [
  { from: 'user', text: 'Como estamos hoje?', time: '14:32' },
  { from: 'bot',  text: '🔵 Faturamento hoje: R$ 184 mil\n73 novos leads entraram\nA estratégia "Evento Premium Abril" lidera conversão\n⚠️ 11 leads quentes sem follow-up há >24h\n\nSugestão: priorizar follow-up até 18h', time: '14:32' },
  { from: 'user', text: 'Quais pagamentos estão em risco?', time: '14:33' },
  { from: 'bot',  text: '💳 3 pagamentos em risco:\n• Carlos Mendes: PIX expira em 4h (R$ 35k)\n• Fernanda Lima: cartão recusado (R$ 25k)\n• Roberto Almeida: PIX expirado (R$ 18k)', time: '14:33' },
  { from: 'user', text: 'Quem do meu time está abaixo da meta?', time: '14:34' },
  { from: 'bot',  text: '👤 João Carlos (Closer) está 20% abaixo da média (18% vs 22,5%).\n\nPossível causa: 65% dos leads dele têm score <60 (difíceis).\n\nSugestão: rebalancear atribuição de leads.', time: '14:34' },
];

export default function CopilotSimulation() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Simulação do WhatsApp</h1>
          <AIBadge>Copiloto</AIBadge>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Veja como será a experiência real dos usuários no WhatsApp.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-border bg-[#0b141a]">
          {/* Header WhatsApp */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#202c33]">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Pulsa</p>
              <p className="text-[11px] text-emerald-400">online</p>
            </div>
            <Video className="h-5 w-5 text-white/70" />
            <Phone className="h-5 w-5 text-white/70" />
            <MoreVertical className="h-5 w-5 text-white/70" />
          </div>

          {/* Mensagens */}
          <div
            className="px-3 py-4 space-y-2 min-h-[420px]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath fill='%23202c33' fill-opacity='0.4' d='M0 0h40v40H0zM40 40h40v40H40z'/%3E%3C/svg%3E\")",
            }}
          >
            {CONVERSATION.map((b, i) => (
              <div key={i} className={cn('flex', b.from === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-[13px] whitespace-pre-wrap shadow',
                    b.from === 'user'
                      ? 'bg-[#005c4b] text-white rounded-tr-sm'
                      : 'bg-[#202c33] text-white/95 rounded-tl-sm',
                  )}
                >
                  {b.text}
                  <div className="text-[9px] text-white/50 text-right mt-1">{b.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input fake */}
          <div className="px-3 py-2 bg-[#202c33] flex items-center gap-2">
            <Input
              disabled
              placeholder="Digite uma mensagem..."
              className="bg-[#2a3942] border-0 text-white/80 placeholder:text-white/40"
            />
          </div>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-muted-foreground">
              Esta é uma simulação. A experiência real acontece no WhatsApp dos números autorizados.
              Para testar com IA real via plataforma, use a tela Copiloto.
            </p>
            <Button size="sm" onClick={() => navigate('/ia/copiloto')}>
              Ir para Copiloto
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}