import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import { AIBadge } from '@/components/ai';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Access = 'full' | 'limited' | 'aggregate' | 'none';

const PROFILES = ['Produtor', 'Gestor', 'Closer', 'SDR'] as const;
const MODULES: { name: string; access: Access[] }[] = [
  { name: 'CRM',         access: ['full', 'full',     'limited',  'limited'] },
  { name: 'Comercial',   access: ['full', 'full',     'limited',  'limited'] },
  { name: 'Monetização', access: ['full', 'aggregate','none',     'none'] },
  { name: 'Financeiro',  access: ['full', 'aggregate','none',     'none'] },
  { name: 'Estratégia',  access: ['full', 'full',     'aggregate','aggregate'] },
  { name: 'Eventos',     access: ['full', 'full',     'aggregate','aggregate'] },
];

function AccessIcon({ type }: { type: Access }) {
  if (type === 'full') return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (type === 'limited') return <Circle className="h-5 w-5 text-amber-500 fill-amber-500/30" />;
  if (type === 'aggregate') return <Circle className="h-5 w-5 text-blue-500 fill-blue-500/30" />;
  return <XCircle className="h-5 w-5 text-muted-foreground/50" />;
}

const LEGEND: { type: Access; label: string }[] = [
  { type: 'full', label: 'Acesso total' },
  { type: 'limited', label: 'Acesso limitado ao próprio escopo' },
  { type: 'aggregate', label: 'Somente agregados' },
  { type: 'none', label: 'Sem acesso' },
];

export default function CopilotProfiles() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Perfis e Níveis de Informação</h1>
          <AIBadge>Copiloto</AIBadge>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Defina quais informações cada perfil de usuário pode consultar via Copiloto.
        </p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Módulo</th>
                {PROFILES.map((p) => (
                  <th key={p} className="text-center font-medium px-4 py-3 text-muted-foreground">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((row, i) => (
                <tr key={row.name} className={cn('border-b border-border last:border-0', i % 2 === 1 && 'bg-muted/20')}>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  {row.access.map((a, idx) => (
                    <td key={idx} className="px-4 py-3">
                      <div className="flex justify-center"><AccessIcon type={a} /></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Legenda</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LEGEND.map((l) => (
              <div key={l.type} className="flex items-center gap-2 text-sm">
                <AccessIcon type={l.type} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}