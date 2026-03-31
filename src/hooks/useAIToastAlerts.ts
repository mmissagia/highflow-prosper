import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const criticalAlertsByRoute: Record<string, string> = {
  "/crm/pipeline": "Lead Maria Santos sem contato há 5 dias — score caiu para 74",
  "/crm/leads": "15 novos leads via Meta Ads em 24h — volume 40% acima da média",
  "/comercial/equipe": "Closer Rafael Costa com taxa de fechamento 8% abaixo da média",
  "/comercial/agenda": "Call com Pedro Costa em 30 min sem confirmação do closer",
  "/eventos": "Evento Mastermind Summit com apenas 45% das vagas faltando 10 dias",
  "/comunicacao/campanhas": "Campanha 'Lançamento Mentoria' com 2.3x ROAS — considerar escalar",
};

export function useAIToastAlerts(onOpenPanel: () => void) {
  const location = useLocation();
  const shownRoutes = useRef<Set<string>>(new Set());

  useEffect(() => {
    const route = location.pathname;
    if (shownRoutes.current.has(route)) return;

    const alertMessage = criticalAlertsByRoute[route];
    if (!alertMessage) return;

    shownRoutes.current.add(route);

    const timer = setTimeout(() => {
      toast.warning(`⚠️ HighFlow AI: ${alertMessage}`, {
        duration: 5000,
        action: {
          label: "Ver detalhes",
          onClick: onOpenPanel,
        },
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname, onOpenPanel]);
}
