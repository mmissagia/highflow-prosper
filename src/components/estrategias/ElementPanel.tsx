import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Calendar, 
  Target, 
  Heart, 
  Package,
  Database,
  Megaphone,
  CreditCard,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

const elementTypes = [
  { type: 'base-leads', label: 'Base de Leads', icon: Database },
  { type: 'low-ticket', label: 'Low-Ticket', icon: ShoppingCart },
  { type: 'crm', label: 'CRM', icon: Megaphone },
  { type: 'evento', label: 'Evento Blinket', icon: Calendar },
  { type: 'pitch', label: 'Pitch', icon: Target },
  { type: 'checkout', label: 'Checkout SUN', icon: CreditCard },
  { type: 'mentoria', label: 'Mentoria', icon: Heart },
  { type: 'curso', label: 'Curso', icon: GraduationCap },
  { type: 'produto-fisico', label: 'Produto Físico', icon: Package },
] as const;

export type ElementType = typeof elementTypes[number];

interface ElementPanelProps {
  onAddNode: (element: ElementType) => void;
}

export default function ElementPanel({ onAddNode }: ElementPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Card className={`transition-all duration-200 ${collapsed ? 'p-2' : 'p-3'}`}>
      <div className="flex items-center justify-between mb-2">
        {!collapsed && (
          <p className="text-xs font-medium text-muted-foreground">Elementos</p>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </Button>
      </div>
      
      {collapsed ? (
        <div className="flex flex-col gap-1.5">
          {elementTypes.map((el) => (
            <Button
              key={el.type}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddNode(el)}
              title={el.label}
            >
              <el.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {elementTypes.map((el) => (
            <Button
              key={el.type}
              variant="ghost"
              size="sm"
              className="gap-2 text-xs justify-start h-8"
              onClick={() => onAddNode(el)}
            >
              <el.icon className="w-3.5 h-3.5 shrink-0" />
              {el.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}

export { elementTypes };
