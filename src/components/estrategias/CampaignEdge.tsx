import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { useCampaignCountByEdge } from '@/hooks/useCampaigns';
import { useStrategy } from '@/contexts/StrategyContext';
import { Zap } from 'lucide-react';

export function CampaignEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  data,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { selectedStrategyId } = useStrategy();
  const { active } = useCampaignCountByEdge(selectedStrategyId, source, target);
  const hasCampaign = active > 0;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const conversionRate = (data as any)?.conversionRate;

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {hasCampaign ? (
            <div className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
              <Zap className="w-3 h-3" />
              {active}
            </div>
          ) : conversionRate ? (
            <div className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
              {conversionRate}%
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
