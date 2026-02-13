import { useCallback } from 'react';
import { type Node, type Edge, MarkerType } from '@xyflow/react';

/**
 * Calculates conversion rates between connected nodes and updates edge labels.
 */
export function computeEdgesWithConversion(nodes: Node[], edges: Edge[]): Edge[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return edges.map((edge) => {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);

    const sourceLeads = (source?.data as any)?.metrics?.leads ?? 0;
    const targetLeads = (target?.data as any)?.metrics?.leads ?? 0;

    let convLabel = '';
    if (sourceLeads > 0 && targetLeads > 0) {
      const rate = ((targetLeads / sourceLeads) * 100).toFixed(1);
      convLabel = `${rate}%`;
    } else if (sourceLeads > 0) {
      convLabel = '0%';
    }

    return {
      ...edge,
      label: convLabel || undefined,
      labelStyle: { 
        fill: 'hsl(var(--muted-foreground))', 
        fontWeight: 600, 
        fontSize: 11 
      },
      labelBgStyle: { 
        fill: 'hsl(var(--background))', 
        fillOpacity: 0.85 
      },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 4,
      animated: true,
      style: { stroke: 'hsl(221 83% 53%)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(221 83% 53%)' },
    };
  });
}

export function useEdgeConversion() {
  const updateConversions = useCallback(
    (nodes: Node[], edges: Edge[]): Edge[] => computeEdgesWithConversion(nodes, edges),
    []
  );

  return { updateConversions };
}
