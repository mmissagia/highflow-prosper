import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Save, 
  Trash2, 
  FolderOpen,
  ShoppingCart,
  Calendar,
  Target,
  Heart,
  Package,
  ArrowRight,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import StrategyNode from '@/components/estrategias/StrategyNode';

const nodeTypes = {
  strategyNode: StrategyNode,
};

// Tipos de elementos disponíveis
const elementTypes = [
  { type: 'low-ticket', label: 'Low-Ticket', icon: ShoppingCart, color: 'bg-blue-500' },
  { type: 'evento', label: 'Evento', icon: Calendar, color: 'bg-purple-500' },
  { type: 'pitch', label: 'Pitch/Oferta', icon: Target, color: 'bg-orange-500' },
  { type: 'mentoria', label: 'Mentoria', icon: Heart, color: 'bg-green-500' },
  { type: 'produto-fisico', label: 'Produto Físico', icon: Package, color: 'bg-pink-500' },
];

// Estratégias salvas de exemplo
const savedStrategies = [
  { id: '1', name: 'Funil Clássico High-Ticket', nodes: 4, createdAt: '2024-01-15' },
  { id: '2', name: 'Lançamento Evento + Mentoria', nodes: 6, createdAt: '2024-01-10' },
  { id: '3', name: 'Low-Ticket para VIP', nodes: 3, createdAt: '2024-01-05' },
];

const initialNodes = [
  {
    id: '1',
    type: 'strategyNode',
    position: { x: 100, y: 200 },
    data: { 
      label: 'E-book Gratuito', 
      type: 'low-ticket',
      metrics: { leads: 1250, conversao: '15%' }
    },
  },
  {
    id: '2',
    type: 'strategyNode',
    position: { x: 400, y: 200 },
    data: { 
      label: 'Imersão Presencial', 
      type: 'evento',
      metrics: { leads: 187, conversao: '42%' }
    },
  },
  {
    id: '3',
    type: 'strategyNode',
    position: { x: 700, y: 100 },
    data: { 
      label: 'Mentoria Elite', 
      type: 'pitch',
      metrics: { leads: 78, conversao: '28%' }
    },
  },
  {
    id: '4',
    type: 'strategyNode',
    position: { x: 700, y: 300 },
    data: { 
      label: 'Mentoria Grupo', 
      type: 'mentoria',
      metrics: { leads: 45, conversao: '65%' }
    },
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true,
    style: { stroke: 'hsl(221 83% 53%)' },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(221 83% 53%)' },
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3',
    animated: true,
    style: { stroke: 'hsl(160 84% 39%)' },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(160 84% 39%)' },
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4',
    animated: true,
    style: { stroke: 'hsl(160 84% 39%)' },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(160 84% 39%)' },
  },
];

export default function ConstrutorEstrategias() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [strategyName, setStrategyName] = useState('Nova Estratégia');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: 'hsl(221 83% 53%)' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(221 83% 53%)' },
    }, eds)),
    [setEdges],
  );

  const addNode = (elementType: typeof elementTypes[0]) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'strategyNode',
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: `Novo ${elementType.label}`, 
        type: elementType.type,
        metrics: { leads: 0, conversao: '0%' }
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !(node as any).selected));
    setEdges((eds) => {
      const selectedNodeIds = nodes.filter((n) => (n as any).selected).map((n) => n.id);
      return eds.filter((edge) => !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target));
    });
  };

  const loadStrategy = (strategyId: string) => {
    // Em produção, carregaria do banco de dados
    console.log('Carregando estratégia:', strategyId);
    setIsDialogOpen(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <Input 
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                className="text-2xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Arraste para mover • Conecte os nós para criar a jornada
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Carregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Estratégias Salvas</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                {savedStrategies.map((strategy) => (
                  <Card 
                    key={strategy.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => loadStrategy(strategy.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{strategy.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {strategy.nodes} elementos • Criada em {strategy.createdAt}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2" onClick={deleteSelectedNodes}>
            <Trash2 className="w-4 h-4" />
            Excluir Selecionado
          </Button>
          
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Salvar Estratégia
          </Button>
        </div>
      </div>

      {/* Canvas Principal */}
      <Card className="flex-1 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/30"
        >
          <Controls className="bg-background border border-border rounded-lg" />
          <MiniMap 
            className="bg-background border border-border rounded-lg"
            nodeColor={(node) => {
              const type = node.data?.type as string;
              switch (type) {
                case 'low-ticket': return 'hsl(221, 83%, 53%)';
                case 'evento': return 'hsl(280, 65%, 60%)';
                case 'pitch': return 'hsl(38, 92%, 50%)';
                case 'mentoria': return 'hsl(160, 84%, 39%)';
                case 'produto-fisico': return 'hsl(340, 75%, 55%)';
                default: return 'hsl(215, 16%, 47%)';
              }
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          
          {/* Painel de Elementos */}
          <Panel position="top-left" className="m-2">
            <Card className="p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Adicionar Elemento
              </p>
              <div className="flex flex-wrap gap-2">
                {elementTypes.map((el) => (
                  <Button
                    key={el.type}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => addNode(el)}
                  >
                    <el.icon className="w-3.5 h-3.5" />
                    {el.label}
                  </Button>
                ))}
              </div>
            </Card>
          </Panel>

          {/* Legenda */}
          <Panel position="bottom-left" className="m-2">
            <Card className="p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Legenda
              </p>
              <div className="grid grid-cols-2 gap-2">
                {elementTypes.map((el) => (
                  <div key={el.type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${el.color}`} />
                    <span className="text-xs">{el.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Panel>
        </ReactFlow>
      </Card>
    </div>
  );
}
