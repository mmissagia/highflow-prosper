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
  Route,
  MousePointerClick,
  GitBranch,
  Layers,
  Plus,
  X,
  Rocket,
  Video,
  Users,
} from "lucide-react";
import { EmptyState as LegacyEmptyState } from "@/components/ui/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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

const buildEdge = (id: string, source: string, target: string): Edge => ({
  id,
  source,
  target,
  type: 'campaign',
  animated: true,
  style: { stroke: 'hsl(221 83% 53%)', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(221 83% 53%)' },
  data: { strategyId: null, conversionRate: null },
});

const getDefaultNodes = (): Node[] => [
  {
    id: '1',
    type: 'strategyNode',
    position: { x: 50, y: 200 },
    data: { label: 'Base de Leads Blinket', type: 'base-leads', metrics: { leads: 7235, conversao: '100%' } },
  },
  {
    id: '2',
    type: 'strategyNode',
    position: { x: 320, y: 200 },
    data: { label: 'E-book Gratuito', type: 'low-ticket', metrics: { leads: 1367, conversao: '18.9%' } },
  },
  {
    id: '3',
    type: 'strategyNode',
    position: { x: 590, y: 200 },
    data: { label: 'Evento de Imersão', type: 'evento', metrics: { leads: 231, conversao: '16.9%' } },
  },
  {
    id: '4',
    type: 'strategyNode',
    position: { x: 860, y: 200 },
    data: { label: 'Mentoria Elite', type: 'mentoria', metrics: { leads: 14, conversao: '6.1%' } },
  },
];

const getDefaultEdges = (): Edge[] => [
  buildEdge('e1-2', '1', '2'),
  buildEdge('e2-3', '2', '3'),
  buildEdge('e3-4', '3', '4'),
];

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof Layers;
  nodes: Node[];
  edges: Edge[];
}

const STRATEGY_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'blinket',
    name: 'Lançamento Blinket',
    description: 'Captura via Blinket → E-book → Evento → Mentoria. Ideal para produtores que vendem mentoria HT via lançamento.',
    icon: Rocket,
    nodes: getDefaultNodes(),
    edges: getDefaultEdges(),
  },
  {
    id: 'webinar',
    name: 'Webinar HT',
    description: 'Tráfego pago → Página de webinar → Webinar ao vivo → Oferta direta. Conversão rápida em 7 dias.',
    icon: Video,
    nodes: [
      { id: '1', type: 'strategyNode', position: { x: 50, y: 200 }, data: { label: 'Tráfego Pago', type: 'low-ticket', metrics: { leads: 12000, conversao: '100%' } } },
      { id: '2', type: 'strategyNode', position: { x: 320, y: 200 }, data: { label: 'Página de Webinar', type: 'crm', metrics: { leads: 2400, conversao: '20%' } } },
      { id: '3', type: 'strategyNode', position: { x: 590, y: 200 }, data: { label: 'Webinar ao Vivo', type: 'evento', metrics: { leads: 480, conversao: '20%' } } },
      { id: '4', type: 'strategyNode', position: { x: 860, y: 200 }, data: { label: 'Oferta Direta', type: 'checkout', metrics: { leads: 36, conversao: '7.5%' } } },
    ],
    edges: [buildEdge('e1-2', '1', '2'), buildEdge('e2-3', '2', '3'), buildEdge('e3-4', '3', '4')],
  },
  {
    id: 'indicacao',
    name: 'Indicação Direta',
    description: 'Cliente atual indica → Call qualificadora → Mentoria. Maior taxa de fechamento, menor volume.',
    icon: Users,
    nodes: [
      { id: '1', type: 'strategyNode', position: { x: 50, y: 200 }, data: { label: 'Indicações', type: 'base-leads', metrics: { leads: 240, conversao: '100%' } } },
      { id: '2', type: 'strategyNode', position: { x: 320, y: 200 }, data: { label: 'Call Qualificadora', type: 'pitch', metrics: { leads: 180, conversao: '75%' } } },
      { id: '3', type: 'strategyNode', position: { x: 590, y: 200 }, data: { label: 'Mentoria Premium', type: 'mentoria', metrics: { leads: 60, conversao: '33%' } } },
    ],
    edges: [buildEdge('e1-2', '1', '2'), buildEdge('e2-3', '2', '3')],
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
  const [demoBannerOpen, setDemoBannerOpen] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);

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

  const applyTemplate = (template: StrategyTemplate) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    setTemplatesOpen(false);
    setDemoBannerOpen(false);
    toast.success('Template aplicado', { description: template.name });
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

          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setTemplatesOpen(true)}>
            <Layers className="w-3.5 h-3.5" />
            Usar template
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
                   <LegacyEmptyState icon={Route} title="Nenhuma estratégia salva" description="Crie sua primeira jornada de vendas e salve para reutilizar." size="sm" action={{ label: "Criar Estratégia", onClick: () => { handleNewStrategy(); setIsDialogOpen(false); } }} />
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
            {isSeeding ? 'Gerando dados demo' : 'Gerar dados demo'}
          </Button>
          
          <Button size="sm" className="gap-1.5 text-xs" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {isSaving ? 'Salvando estratégia' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="flex-1 overflow-hidden relative">
        {demoBannerOpen && !currentStrategyId && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-ai/10 border border-ai/20 text-foreground rounded-lg px-3 py-2 shadow-sm max-w-[420px]">
            <Sparkles className="w-3.5 h-3.5 text-ai shrink-0" />
            <p className="text-xs flex-1">
              Esta é uma estratégia de exemplo. Crie a sua a partir daqui ou comece do zero.
            </p>
            <button
              onClick={() => setDemoBannerOpen(false)}
              aria-label="Fechar"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
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

      {/* Templates dialog */}
      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Escolha um template</DialogTitle>
            <DialogDescription>
              Comece com uma estratégia testada e personalize a partir daí.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {STRATEGY_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="text-left rounded-lg border border-border hover:border-ai hover:bg-ai/5 p-4 transition-colors duration-default ease-glide space-y-2"
                >
                  <div className="w-9 h-9 rounded-lg bg-ai/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-ai" />
                  </div>
                  <p className="font-semibold text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

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
