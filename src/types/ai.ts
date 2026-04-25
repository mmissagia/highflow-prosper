export type AIUrgency = 'info' | 'suggestion' | 'alert';

export type AITier = 'connect' | 'growth' | 'scale' | 'enterprise';

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  details?: string[];
  urgency: AIUrgency;
  action?: {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
  };
  confidence?: number;
  confidenceLabel?: string;
  requiredTier: AITier;
}

export interface AISuggestion {
  id: string;
  label: string;
  icon: 'zap' | 'target' | 'radio' | 'sparkles' | 'trendingUp';
  title: string;
  description: string;
  justification?: string;
}

export interface AIAnalysis {
  id: string;
  title: string;
  verdict: string;
  causes?: string[];
  recommendation: string;
  confidence?: number;
}