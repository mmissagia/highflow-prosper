import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { AIBadge } from '@/components/ai';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface AccessRow {
  name: string;
  number: string;
  role: string;
  scope: string;
  level: string;
  lastInteraction: string;
  status: 'Ativo' | 'Suspenso';
}

const ROWS: AccessRow[] = [
  { name: 'Você (Produtor)', number: '+55 11 99999-0001', role: 'Produtor', scope: 'Operação completa', level: 'Executivo', lastInteraction: 'há 3min', status: 'Ativo' },
  { name: 'Ana Souza', number: '+55 11 98888-0002', role: 'SDR', scope: 'Seus leads', level: 'Operacional', lastInteraction: 'há 2h', status: 'Ativo' },
  { name: 'Carlos Lima', number: '+55 11 97777-0003', role: 'Closer', scope: 'Seus leads', level: 'Operacional', lastInteraction: 'há 5h', status: 'Ativo' },
  { name: 'Marina Costa', number: '+55 11 96666-0004', role: 'Gestora', scope: 'Time completo', level: 'Gerencial', lastInteraction: 'ontem', status: 'Ativo' },
  { name: 'Pedro Santos', number: '+55 11 95555-0005', role: 'Closer', scope: 'Seus leads', level: 'Operacional', lastInteraction: 'há 3 dias', status: 'Suspenso' },
];

export default function CopilotAccess() {
  const [open, setOpen] = useState(false);

  const handleAction = (action: string, name: string) => {
    toast.success(`${action} — ${name}`, { description: 'Ação executada' });
  };

  const handleAdd = () => {
    setOpen(false);
    toast.success('Número adicionado', { description: 'Mock — sem persistência' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Acessos e Permissões</h1>
            <AIBadge>Copiloto</AIBadge>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Gerencie os números de WhatsApp autorizados a consultar a operação via Copiloto.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Adicionar número
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Escopo</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Última interação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.number}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-mono text-xs">{r.number}</TableCell>
                  <TableCell>{r.role}</TableCell>
                  <TableCell className="text-muted-foreground">{r.scope}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{r.level}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{r.lastInteraction}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'Ativo' ? 'default' : 'secondary'} className="text-[10px]">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('Editar', r.name)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Suspender', r.name)}>Suspender</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Remover', r.name)} className="text-destructive">
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar número autorizado</DialogTitle>
            <DialogDescription>
              O usuário receberá uma confirmação no WhatsApp antes de poder consultar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Ex: João Silva" />
            </div>
            <div className="space-y-2">
              <Label>Número WhatsApp</Label>
              <Input placeholder="+55 11 98765-4321" />
            </div>
            <div className="space-y-2">
              <Label>Papel</Label>
              <Select defaultValue="closer">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="produtor">Produtor</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="closer">Closer</SelectItem>
                  <SelectItem value="sdr">SDR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}