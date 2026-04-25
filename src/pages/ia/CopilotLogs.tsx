import { AIBadge } from '@/components/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LogRow {
  datetime: string;
  user: string;
  number: string;
  query: string;
  dataType: string;
  status: 'Sucesso' | 'Bloqueado';
}

const LOGS: LogRow[] = [
  { datetime: '25/04 14:32', user: 'Você (Produtor)', number: '+55 11 99999-0001', query: 'Como está o faturamento hoje?', dataType: 'Financeiro', status: 'Sucesso' },
  { datetime: '25/04 14:18', user: 'Marina Costa',    number: '+55 11 96666-0004', query: 'Quais leads estão em risco?',     dataType: 'CRM',        status: 'Sucesso' },
  { datetime: '25/04 13:55', user: 'Ana Souza',       number: '+55 11 98888-0002', query: 'Mostre comissões do Pedro',       dataType: 'Comissões',  status: 'Bloqueado' },
  { datetime: '25/04 12:40', user: 'Você (Produtor)', number: '+55 11 99999-0001', query: 'Resumo de eventos da semana',     dataType: 'Eventos',    status: 'Sucesso' },
  { datetime: '25/04 11:22', user: 'Carlos Lima',     number: '+55 11 97777-0003', query: 'Meus leads quentes parados',      dataType: 'CRM',        status: 'Sucesso' },
  { datetime: '25/04 10:08', user: 'Marina Costa',    number: '+55 11 96666-0004', query: 'Performance do time essa semana', dataType: 'Comercial',  status: 'Sucesso' },
  { datetime: '25/04 09:14', user: 'Ana Souza',       number: '+55 11 98888-0002', query: 'Faturamento total do mês',         dataType: 'Financeiro', status: 'Bloqueado' },
  { datetime: '24/04 18:47', user: 'Você (Produtor)', number: '+55 11 99999-0001', query: 'Mentorados em risco de churn',     dataType: 'Entrega',    status: 'Sucesso' },
  { datetime: '24/04 17:12', user: 'Carlos Lima',     number: '+55 11 97777-0003', query: 'Status do Carlos Mendes',          dataType: 'CRM',        status: 'Sucesso' },
  { datetime: '24/04 15:30', user: 'Pedro Santos',    number: '+55 11 95555-0005', query: 'Comissão dele esse mês',           dataType: 'Comissões',  status: 'Bloqueado' },
];

export default function CopilotLogs() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Logs e Auditoria</h1>
          <AIBadge>Copiloto</AIBadge>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Registro de todas as consultas realizadas via Copiloto.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input type="date" placeholder="Período" />
            <Select>
              <SelectTrigger><SelectValue placeholder="Usuário" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="produtor">Você (Produtor)</SelectItem>
                <SelectItem value="ana">Ana Souza</SelectItem>
                <SelectItem value="carlos">Carlos Lima</SelectItem>
                <SelectItem value="marina">Marina Costa</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger><SelectValue placeholder="Tipo de acesso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Consulta</TableHead>
                <TableHead>Tipo de dado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOGS.map((l, i) => (
                <TableRow key={i} className={cn(l.status === 'Bloqueado' && 'bg-destructive/5')}>
                  <TableCell className="text-xs font-mono">{l.datetime}</TableCell>
                  <TableCell className="font-medium">{l.user}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{l.number}</TableCell>
                  <TableCell className="text-sm">{l.query}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{l.dataType}</Badge>
                  </TableCell>
                  <TableCell>
                    {l.status === 'Bloqueado' ? (
                      <Badge variant="destructive" className="text-[10px]">⚠️ Bloqueado</Badge>
                    ) : (
                      <Badge variant="default" className="text-[10px]">Sucesso</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}