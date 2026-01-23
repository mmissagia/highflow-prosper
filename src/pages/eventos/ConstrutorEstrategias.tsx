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
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save, 
  Trash2, 
  FolderOpen,
  ShoppingCart,
  Calendar,
  Target,
  Heart,
  Package,
  ArrowRight,
  Sparkles,
  FileText,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import StrategyNode from '@/components/estrategias/StrategyNode';
import { useStrategies, type Strategy } from '@/hooks/useStrategies';

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

const getDefaultNodes = (): Node[] => [
  {
    id: '1',
    type: 'strategyNode',
    position: { x: 100, y: 200 },
    data: { 
      label: 'E-book Gratuito', 
      type: 'low-ticket',
      metrics: { leads: 0, conversao: '0%' }
    },
  },
];

export default function ConstrutorEstrategias() {
  const [nodes, setNodes, onNodesChange] = useNodesState(getDefaultNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [strategyName, setStrategyName] = useState('Nova Estratégia');
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { strategies, isLoading, createStrategy, updateStrategy, deleteStrategy } = useStrategies();

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
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => {
      const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
      return eds.filter((edge) => !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target));
    });
  };

  const loadStrategy = (strategy: Strategy) => {
    setCurrentStrategyId(strategy.id);
    setStrategyName(strategy.name);
    setNodes(strategy.nodes.length > 0 ? strategy.nodes : getDefaultNodes());
    setEdges(strategy.edges);
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    if (currentStrategyId) {
      updateStrategy.mutate({ 
        id: currentStrategyId, 
        name: strategyName, 
        nodes, 
        edges 
      });
    } else {
      createStrategy.mutate({ 
        name: strategyName, 
        nodes, 
        edges 
      }, {
        onSuccess: (data) => {
          setCurrentStrategyId(data.id);
        }
      });
    }
  };

  const handleNewStrategy = () => {
    setCurrentStrategyId(null);
    setStrategyName('Nova Estratégia');
    setNodes(getDefaultNodes());
    setEdges([]);
  };

  const handleDeleteStrategy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStrategy.mutate(id);
    if (currentStrategyId === id) {
      handleNewStrategy();
    }
  };

  const isSaving = createStrategy.isPending || updateStrategy.isPending;

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
              {currentStrategyId && <span className="ml-2 text-primary">(Editando)</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleNewStrategy}>
            <FileText className="w-4 h-4" />
            Nova
          </Button>

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
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : strategies.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma estratégia salva ainda
                  </p>
                ) : (
                  strategies.map((strategy) => (
                    <Card 
                      key={strategy.id} 
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${currentStrategyId === strategy.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => loadStrategy(strategy)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{strategy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {strategy.nodes.length} elementos • Atualizada em {new Date(strategy.updated_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteStrategy(strategy.id, e)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2" onClick={deleteSelectedNodes}>
            <Trash2 className="w-4 h-4" />
            Excluir Selecionado
          </Button>
          
          <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
