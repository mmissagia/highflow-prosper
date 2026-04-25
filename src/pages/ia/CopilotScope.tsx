import { useState } from 'react';
import { toast } from 'sonner';
import { AIBadge } from '@/components/ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const NUMBERS = [
  { value: 'ana',    label: 'Ana Souza — +55 11 98888-0002' },
  { value: 'carlos', label: 'Carlos Lima — +55 11 97777-0003' },
  { value: 'marina', label: 'Marina Costa — +55 11 96666-0004' },
  { value: 'pedro',  label: 'Pedro Santos — +55 11 95555-0005' },
];

const FILTERS: { id: string; label: string; options: string[] }[] = [
  { id: 'campanha',  label: 'Por campanha',  options: ['Evento Premium Abril', 'Reengajamento Lista', 'Lançamento Mentoria Elite'] },
  { id: 'estrategia',label: 'Por estratégia',options: ['Funil Premium 2026', 'Funil Trial 7d', 'Reativação Q2'] },
  { id: 'evento',    label: 'Por evento',    options: ['Mentoria Elite Abril', 'Workshop Strategy', 'Imersão Maio'] },
  { id: 'time',      label: 'Por time',      options: ['SDRs', 'Closers', 'Gestores'] },
  { id: 'produto',   label: 'Por produto',   options: ['Mentoria Elite', 'Curso Method 2.0', 'Imersão Premium'] },
  { id: 'expert',    label: 'Por expert',    options: ['João Mentor', 'Marina Coach', 'Pedro Especialista'] },
];

export default function CopilotScope() {
  const [number, setNumber] = useState('ana');
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const add = (id: string, value: string) => {
    setSelected((prev) => {
      const cur = prev[id] || [];
      if (cur.includes(value)) return prev;
      return { ...prev, [id]: [...cur, value] };
    });
  };

  const remove = (id: string, value: string) => {
    setSelected((prev) => ({ ...prev, [id]: (prev[id] || []).filter((v) => v !== value) }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Escopo de Dados</h1>
          <AIBadge>Copiloto</AIBadge>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Configure sobre quais partes da operação cada número autorizado pode consultar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aplicar escopo ao número</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={number} onValueChange={setNumber}>
            <SelectTrigger className="max-w-md"><SelectValue /></SelectTrigger>
            <SelectContent>
              {NUMBERS.map((n) => (
                <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros de escopo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {FILTERS.map((f) => (
            <div key={f.id} className="space-y-2">
              <Label>{f.label}</Label>
              <Select onValueChange={(v) => add(f.id, v)}>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Selecione para adicionar..." />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(selected[f.id] || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selected[f.id] || []).map((v) => (
                    <Badge key={v} variant="secondary" className="gap-1">
                      {v}
                      <button onClick={() => remove(f.id, v)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast.success('Escopo salvo')}>Salvar escopo</Button>
      </div>
    </div>
  );
}