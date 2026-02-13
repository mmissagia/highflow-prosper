import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Calendar, 
  Target, 
  Heart, 
  Package,
  Users,
  TrendingUp,
  Database,
  Megaphone,
  CreditCard,
  GraduationCap,
  Pencil
} from "lucide-react";

export const typeConfig = {
  'base-leads': {
    icon: Database,
    color: 'border-cyan-500 bg-cyan-500/10',
    badgeColor: 'bg-cyan-500 text-white',
    label: 'Base de Leads'
  },
  'low-ticket': { 
    icon: ShoppingCart, 
    color: 'border-blue-500 bg-blue-500/10',
    badgeColor: 'bg-blue-500 text-white',
    label: 'Low-Ticket'
  },
  'crm': {
    icon: Megaphone,
    color: 'border-indigo-500 bg-indigo-500/10',
    badgeColor: 'bg-indigo-500 text-white',
    label: 'CRM'
  },
  'evento': { 
    icon: Calendar, 
    color: 'border-purple-500 bg-purple-500/10',
    badgeColor: 'bg-purple-500 text-white',
    label: 'Evento Blinket'
  },
  'pitch': { 
    icon: Target, 
    color: 'border-orange-500 bg-orange-500/10',
    badgeColor: 'bg-orange-500 text-white',
    label: 'Pitch'
  },
  'checkout': {
    icon: CreditCard,
    color: 'border-emerald-500 bg-emerald-500/10',
    badgeColor: 'bg-emerald-500 text-white',
    label: 'Checkout SUN'
  },
  'mentoria': { 
    icon: Heart, 
    color: 'border-green-500 bg-green-500/10',
    badgeColor: 'bg-green-500 text-white',
    label: 'Mentoria'
  },
  'curso': {
    icon: GraduationCap,
    color: 'border-teal-500 bg-teal-500/10',
    badgeColor: 'bg-teal-500 text-white',
    label: 'Curso'
  },
  'produto-fisico': { 
    icon: Package, 
    color: 'border-pink-500 bg-pink-500/10',
    badgeColor: 'bg-pink-500 text-white',
    label: 'Produto Físico'
  },
};

export interface StrategyNodeData {
  label: string;
  type: keyof typeof typeConfig;
  metrics?: {
    leads: number;
    conversao: string;
  };
}

function StrategyNode({ data, selected, id }: NodeProps) {
  const nodeData = data as unknown as StrategyNodeData;
  const config = typeConfig[nodeData.type] || typeConfig['low-ticket'];
  const Icon = config.icon;
  const isBaseLeads = nodeData.type === 'base-leads';
  const { setNodes } = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(nodeData.label);
  const [editLeads, setEditLeads] = useState(String(nodeData.metrics?.leads ?? 0));

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setEditLabel(nodeData.label);
    setEditLeads(String(nodeData.metrics?.leads ?? 0));
    setIsEditing(true);
  }, [nodeData.label, nodeData.metrics?.leads]);

  const handleSave = useCallback(() => {
    const leads = parseInt(editLeads) || 0;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, label: editLabel, metrics: { ...((n.data as any).metrics || {}), leads } } }
          : n
      )
    );
    setIsEditing(false);
  }, [id, editLabel, editLeads, setNodes]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  }, [handleSave]);

  return (
    <>
      {!isBaseLeads && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="!w-3 !h-3 !bg-primary !border-2 !border-background"
        />
      )}
      
      <Card 
        className={`min-w-[200px] max-w-[240px] border-2 ${config.color} ${selected ? 'ring-2 ring-primary ring-offset-2' : ''} transition-all hover:shadow-lg`}
        onDoubleClick={handleDoubleClick}
      >
        <CardContent className="p-3">
          {isEditing ? (
            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-7 text-sm"
                autoFocus
                placeholder="Nome do nó"
              />
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-muted-foreground shrink-0" />
                <Input
                  value={editLeads}
                  onChange={(e) => setEditLeads(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-7 text-sm"
                  type="number"
                  placeholder="Leads"
                />
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleSave}
                  className="flex-1 text-xs bg-primary text-primary-foreground rounded px-2 py-1 hover:opacity-90"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 text-xs bg-muted text-muted-foreground rounded px-2 py-1 hover:opacity-90"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg ${config.badgeColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{nodeData.label}</p>
                  <Badge variant="outline" className="text-[10px] h-4">
                    {config.label}
                  </Badge>
                </div>
                <Pencil className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              {nodeData.metrics && (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{nodeData.metrics.leads.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    <span className="text-xs font-medium text-success">{nodeData.metrics.conversao}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
    </>
  );
}

export default memo(StrategyNode);
