import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Calendar, 
  Target, 
  Heart, 
  Package,
  Users,
  TrendingUp
} from "lucide-react";

const typeConfig = {
  'low-ticket': { 
    icon: ShoppingCart, 
    color: 'border-blue-500 bg-blue-500/10',
    badgeColor: 'bg-blue-500 text-white'
  },
  'evento': { 
    icon: Calendar, 
    color: 'border-purple-500 bg-purple-500/10',
    badgeColor: 'bg-purple-500 text-white'
  },
  'pitch': { 
    icon: Target, 
    color: 'border-orange-500 bg-orange-500/10',
    badgeColor: 'bg-orange-500 text-white'
  },
  'mentoria': { 
    icon: Heart, 
    color: 'border-green-500 bg-green-500/10',
    badgeColor: 'bg-green-500 text-white'
  },
  'produto-fisico': { 
    icon: Package, 
    color: 'border-pink-500 bg-pink-500/10',
    badgeColor: 'bg-pink-500 text-white'
  },
};

interface StrategyNodeData {
  label: string;
  type: keyof typeof typeConfig;
  metrics?: {
    leads: number;
    conversao: string;
  };
}

function StrategyNode({ data, selected }: NodeProps) {
  const nodeData = data as unknown as StrategyNodeData;
  const config = typeConfig[nodeData.type] || typeConfig['low-ticket'];
  const Icon = config.icon;

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-3 !h-3 !bg-primary !border-2 !border-background"
      />
      
      <Card className={`min-w-[180px] border-2 ${config.color} ${selected ? 'ring-2 ring-primary ring-offset-2' : ''} transition-all hover:shadow-lg`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg ${config.badgeColor} flex items-center justify-center`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{nodeData.label}</p>
              <Badge variant="outline" className="text-[10px] h-4">
                {nodeData.type.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          {nodeData.metrics && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium">{nodeData.metrics.leads}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <span className="text-xs font-medium text-success">{nodeData.metrics.conversao}</span>
              </div>
            </div>
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
