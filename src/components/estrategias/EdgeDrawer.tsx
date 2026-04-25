import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Mail, MessageSquare, Phone, Calendar, Radio, Plus } from 'lucide-react';
import { useCampaignsByEdge, type Campaign } from '@/hooks/useCampaigns';
import React from 'react';
import { AIAnalysisBlock } from '@/components/ai';
import { getStrategyEdgeAnalysis } from '@/lib/aiMocks';

const CHANNEL_LABELS: Record<Campaign['channel'], string> = {
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  sms: 'SMS',
  ligacao: 'Ligação',
  evento: 'Evento',
  outro: 'Outro',
};

const CHANNEL_ICONS: Record<Campaign['channel'], React.ReactNode> = {
  whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  sms: <MessageSquare className="w-3.5 h-3.5" />,
  ligacao: <Phone className="w-3.5 h-3.5" />,
  evento: <Calendar className="w-3.5 h-3.5" />,
  outro: <Radio className="w-3.5 h-3.5" />,
};

const STATUS_VARIANT: Record<Campaign['status'], 'default' | 'secondary' | 'outline'> = {
  ativo: 'default',
  inativo: 'secondary',
  rascunho: 'outline',
};

interface EdgeDrawerProps {
  open: boolean;
  onClose: () => void;
  strategyId: string;
  sourceLabel: string;
  targetLabel: string;
  edgeSource: string;
  edgeTarget: string;
  conversionRate?: number | null;
}

export function EdgeDrawer({
  open,
  onClose,
  strategyId,
  sourceLabel,
  targetLabel,
  edgeSource,
  edgeTarget,
  conversionRate,
}: EdgeDrawerProps) {
  const { data: campaigns, isLoading } = useCampaignsByEdge(
    strategyId,
    edgeSource,
    edgeTarget
  );

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            {sourceLabel} → {targetLabel}
          </SheetTitle>
          {conversionRate != null && (
            <SheetDescription>
              Taxa de conversão: {conversionRate}%
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Campanhas nesta transição</p>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled>
              <Plus className="w-3.5 h-3.5" />
              Nova campanha
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 ml-1">Em breve</Badge>
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && (!campaigns || campaigns.length === 0) && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Zap className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhuma campanha configurada
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                As campanhas desta transição aparecerão aqui.
              </p>
            </div>
          )}

          {!isLoading && campaigns && campaigns.length > 0 && (
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <Badge variant={STATUS_VARIANT[campaign.status]}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {CHANNEL_ICONS[campaign.channel]}
                      {CHANNEL_LABELS[campaign.channel]}
                    </span>
                    <span>{campaign.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <AIAnalysisBlock
              analysis={getStrategyEdgeAnalysis(`${edgeSource}-${edgeTarget}`)}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
