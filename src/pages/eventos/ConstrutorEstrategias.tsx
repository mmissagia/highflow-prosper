import { useCallback, useState, useEffect } from 'react';
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
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Save, 
  Trash2, 
  FolderOpen,
  ArrowRight,
  Sparkles,
  FileText,
  Loader2,
  Wand2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import StrategyNode from '@/components/estrategias/StrategyNode';
import ElementPanel, { type ElementType } from '@/components/estrategias/ElementPanel';
import { computeEdgesWithConversion } from '@/components/estrategias/useEdgeConversion';
import { useStrategies, type Strategy } from '@/hooks/useStrategies';
import { CampaignEdge } from '@/components/estrategias/CampaignEdge';
import { EdgeDrawer } from '@/components/estrategias/EdgeDrawer';
import { seedDemoCampaigns } from '@/lib/demoSeed';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const nodeTypes = {
  strategyNode: StrategyNode,
};

const edgeTypes = {
  campaign: CampaignEdge,
};

const normalizeEdges = (edges: Edge[], strategyId?: string | null): Edge[] =>
  edges.map((e) => ({
    ...e,
    type: e.type ?? 'campaign',
    data: { ...((e.data as any) ?? {}), strategyId: strategyId ?? null, conversionRate: (e.data as any)?.conversionRate ?? null },
  }));

const getDefaultNodes = (): Node[] => [
  {
    id: '1',
    type: 'strategyNode',
    position: { x: 50, y: 200 },
    data: { 
      label: 'Minha Base de Leads', 
      type: 'base-leads',
      metrics: { leads: 1000, conversao: '100%' }
    },
  },
  {
    id: '2',
    type: 'strategyNode',
    position: { x: 320, y: 200 },
    data: { 
      label: 'E-book Gratuito', 
      type: 'low-ticket',
      metrics: { leads: 0, conversao: '0%' }
    },
  },
];

const getDefaultEdges = (): Edge[] => [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'campaign',
    animated: true,
    style: { stroke: 'hsl(221 83% 53%)', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(221 83% 53%)' },
    data: { strategyId: null, conversionRate: null },
  },
];

export default function ConstrutorEstrategias() {
  const [nodes, setNodes, onNodesChange] = useNodesState(getDefaultNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getDefaultEdges());
  const [strategyName, setStrategyName] = useState('Nova Estratégia');
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEdgeData, setSelectedEdgeData] = useState<{
    sourceLabel: string;
    targetLabel: string;
    edgeSource: string;
    edgeTarget: string;
    conversionRate?: number | null;
  } | null>(null);

  const { strategies, isLoading, createStrategy, updateStrategy, deleteStrategy } = useStrategies();
  const [isSeeding, setIsSeeding] = useState(false);
  const queryClient = useQueryClient();

  const handleSeedDemo = async () => {
    if (!currentStrategyId || edges.length === 0) {
      toast.error('Abra uma estratégia com arestas para gerar dados demo.');
      return;
    }
    setIsSeeding(true);
    try {
      const count = await seedDemoCampaigns(currentStrategyId, edges);
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      await queryClient.refetchQueries({ queryKey: ['campaigns'] });
      toast.success(`${count} campanhas demo criadas com sucesso.`);
    } catch (err) {
      toast.error('Erro ao gerar dados demo. Tente novamente.');
    } finally {
      setIsSeeding(false);
    }
  };

  // Auto-load last saved strategy
  useEffect(() => {
    if (!isLoading && strategies.length > 0 && !hasLoadedInitial) {
      const lastStrategy = strategies[0];
      setCurrentStrategyId(lastStrategy.id);
      setStrategyName(lastStrategy.name);
      setNodes(lastStrategy.nodes.length > 0 ? lastStrategy.nodes : getDefaultNodes());
      setEdges(normalizeEdges(lastStrategy.edges, lastStrategy.id));
      setHasLoadedInitial(true);
    } else if (!isLoading && strategies.length === 0 && !hasLoadedInitial) {
      setHasLoadedInitial(true);
    }
  }, [isLoading, strategies, hasLoadedInitial, setNodes, setEdges]);

  // Auto-compute conversion on edges whenever nodes change
  useEffect(() => {
    setEdges((eds) => computeEdgesWithConversion(nodes, eds));
  }, [nodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge({
          ...params,
          type: 'campaign',
          animated: true,
          style: { stroke: 'hsl(221 83% 53%)', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(221 83% 53%)' },
          data: { strategyId: currentStrategyId, conversionRate: null },
        }, eds);
        return computeEdgesWithConversion(nodes, newEdges);
      });
    },
    [setEdges, nodes, currentStrategyId],
  );

  const handleEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      setSelectedEdgeData({
        sourceLabel: (sourceNode?.data as any)?.label ?? edge.source,
        targetLabel: (targetNode?.data as any)?.label ?? edge.target,
        edgeSource: edge.source,
        edgeTarget: edge.target,
        conversionRate: (edge.data as any)?.conversionRate ?? null,
      });
      setDrawerOpen(true);
    },
    [nodes]
  );

  const addNode = (element: ElementType) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'strategyNode',
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: element.label, 
        type: element.type,
        metrics: { leads: 0, conversao: '0%' }
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteSelectedNodes = () => {
    const selectedIds = nodes.filter((n) => n.selected).map((n) => n.id);
    if (selectedIds.length === 0) return;
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((e) => !selectedIds.includes(e.source) && !selectedIds.includes(e.target)));
  };

  const loadStrategy = (strategy: Strategy) => {
    setCurrentStrategyId(strategy.id);
    setStrategyName(strategy.name);
    setNodes(strategy.nodes.length > 0 ? strategy.nodes : getDefaultNodes());
    setEdges(normalizeEdges(strategy.edges, strategy.id));
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    if (currentStrategyId) {
      updateStrategy.mutate({ id: currentStrategyId, name: strategyName, nodes, edges });
    } else {
      createStrategy.mutate({ name: strategyName, nodes, edges }, {
        onSuccess: (data) => setCurrentStrategyId(data.id),
      });
    }
  };

  const handleNewStrategy = () => {
    setCurrentStrategyId(null);
    setStrategyName('Nova Estratégia');
    setNodes(getDefaultNodes());
    setEdges(getDefaultEdges());
  };

  const handleDeleteStrategy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStrategy.mutate(id);
    if (currentStrategyId === id) handleNewStrategy();
  };

  const isSaving = createStrategy.isPending || updateStrategy.isPending;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-3">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <Input 
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="text-lg font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 max-w-[280px]"
          />
          {currentStrategyId && (
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Editando</span>
          )}
        </div>
        
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleNewStrategy}>
            <FileText className="w-3.5 h-3.5" />
            Nova
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <FolderOpen className="w-3.5 h-3.5" />
                Carregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Estratégias Salvas</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto">
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
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{strategy.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {strategy.nodes.length} elementos • {new Date(strategy.updated_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => handleDeleteStrategy(strategy.id, e)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive" onClick={deleteSelectedNodes}>
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDemo}
            disabled={isSeeding || !currentStrategyId || edges.length === 0}
            className="gap-2 text-xs"
          >
            <Wand2 className="h-3.5 w-3.5" />
            {isSeeding ? 'Gerando...' : 'Gerar dados demo'}
          </Button>
          
          <Button size="sm" className="gap-1.5 text-xs" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Salvar
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="flex-1 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={handleEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="bg-muted/30"
        >
          <Controls className="bg-background border border-border rounded-lg" />
          <MiniMap 
            className="bg-background border border-border rounded-lg"
            nodeColor={(node) => {
              const type = node.data?.type as string;
              const colorMap: Record<string, string> = {
                'base-leads': 'hsl(188, 78%, 41%)',
                'low-ticket': 'hsl(221, 83%, 53%)',
                'crm': 'hsl(239, 84%, 67%)',
                'evento': 'hsl(280, 65%, 60%)',
                'pitch': 'hsl(38, 92%, 50%)',
                'checkout': 'hsl(160, 84%, 39%)',
                'mentoria': 'hsl(142, 71%, 45%)',
                'curso': 'hsl(168, 76%, 42%)',
                'produto-fisico': 'hsl(340, 75%, 55%)',
              };
              return colorMap[type] || 'hsl(215, 16%, 47%)';
            }}
          />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          
          {/* Retractable Element Panel */}
          <Panel position="top-left" className="m-2">
            <ElementPanel onAddNode={addNode} />
          </Panel>

          {/* Dica sutil */}
          <Panel position="bottom-right" className="m-2">
            <p className="text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Duplo-clique para editar • Arraste para conectar
            </p>
          </Panel>
        </ReactFlow>
      </Card>

      {selectedEdgeData && (
        <EdgeDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          strategyId={currentStrategyId ?? ''}
          {...selectedEdgeData}
        />
      )}
    </div>
  );
}
