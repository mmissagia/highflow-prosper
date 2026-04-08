import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ icon: Icon, title, description, action, secondaryAction, size = 'md' }: EmptyStateProps) {
  const sizes = {
    sm: { container: 'py-8', icon: 'h-8 w-8', title: 'text-sm', desc: 'text-xs' },
    md: { container: 'py-16', icon: 'h-10 w-10', title: 'text-base', desc: 'text-sm' },
    lg: { container: 'py-24', icon: 'h-12 w-12', title: 'text-lg', desc: 'text-sm' },
  };
  const s = sizes[size];
  return (
    <div className={`flex flex-col items-center justify-center text-center ${s.container}`}>
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className={`${s.icon} text-muted-foreground`} />
      </div>
      <h3 className={`font-semibold text-foreground mb-1 ${s.title}`}>{title}</h3>
      <p className={`text-muted-foreground max-w-sm ${s.desc}`}>{description}</p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 mt-4">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && <Button variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>}
        </div>
      )}
    </div>
  );
}
