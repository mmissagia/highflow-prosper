import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { GlobalFilterProvider } from "@/contexts/GlobalFilterContext";
import { Loader2 } from "lucide-react";
import { useState, useCallback } from "react";
import { AIAgentPanel } from "@/components/ai-agent/AIAgentPanel";
import { AIAgentFab } from "@/components/ai-agent/AIAgentFab";
import { AIHeaderBadge } from "@/components/ai-agent/AIHeaderBadge";
import { useAIToastAlerts } from "@/hooks/useAIToastAlerts";

// Pages
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

// CRM
import Pipeline from "./pages/crm/Pipeline";
import LeadsList from "./pages/crm/LeadsList";
import LeadDetail from "./pages/crm/LeadDetail";

// Eventos
import EventosList from "./pages/eventos/EventosList";
import EventoDetail from "./pages/eventos/EventoDetail";
import PitchEditor from "./pages/eventos/PitchEditor";
import ConstrutorEstrategias from "./pages/eventos/ConstrutorEstrategias";

// Comunicação
import Campanhas from "./pages/comunicacao/Campanhas";
import Automacoes from "./pages/comunicacao/Automacoes";
import EditorMensagens from "./pages/comunicacao/EditorMensagens";
import Conversas from "./pages/comunicacao/Conversas";

// Entrega
import MeusCursos from "./pages/entrega/MeusCursos";
import MinhasMentorias from "./pages/entrega/MinhasMentorias";
import PainelMentor from "./pages/entrega/PainelMentor";
import PainelProdutor from "./pages/entrega/PainelProdutor";

// Conexões
import Conexoes from "./pages/Conexoes";

// Infraestrutura
import Seguranca from "./pages/infra/Seguranca";
import Configuracoes from "./pages/infra/Configuracoes";
import Usuarios from "./pages/Usuarios";

// Comercial
import Equipe from "./pages/comercial/Equipe";
import Atividades from "./pages/comercial/Atividades";
import Performance from "./pages/comercial/Performance";
import Comissoes from "./pages/comercial/Comissoes";
import Agenda from "./pages/comercial/Agenda";
import CheckoutHighTicket from "./pages/checkout/CheckoutHighTicket";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppLayoutInner() {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiInitialTab, setAiInitialTab] = useState<string | undefined>();

  const openAlerts = useCallback(() => {
    setAiInitialTab("alertas");
    setAiPanelOpen(true);
  }, []);

  useAIToastAlerts(openAlerts);

  return (
    <>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background flex items-center px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
            <AIHeaderBadge alertCount={8} onClick={openAlerts} />
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/performance/indicadores" element={<Navigate to="/" replace />} />
              <Route path="/crm/pipeline" element={<Pipeline />} />
              <Route path="/crm/leads" element={<LeadsList />} />
              <Route path="/crm/lead" element={<LeadDetail />} />
              <Route path="/crm/lead/:id" element={<LeadDetail />} />
              <Route path="/comercial/equipe" element={<Equipe />} />
              <Route path="/comercial/atividades" element={<Atividades />} />
              <Route path="/comercial/produtividade" element={<Navigate to="/comercial/performance" replace />} />
              <Route path="/comercial/performance" element={<Performance />} />
              <Route path="/comercial/comissoes" element={<Comissoes />} />
              <Route path="/comercial/agenda" element={<Agenda />} />
              <Route path="/comercial/relatorios" element={<Navigate to="/" replace />} />
              <Route path="/eventos" element={<EventosList />} />
              <Route path="/eventos/detalhe" element={<EventoDetail />} />
              <Route path="/eventos/detalhe/:id" element={<EventoDetail />} />
              <Route path="/eventos/pitch" element={<PitchEditor />} />
              <Route path="/eventos/pitch/:id" element={<PitchEditor />} />
              <Route path="/eventos/estrategias" element={<ConstrutorEstrategias />} />
              <Route path="/checkout-ht" element={<CheckoutHighTicket />} />
              <Route path="/comunicacao/campanhas" element={<Campanhas />} />
              <Route path="/comunicacao/automacoes" element={<Automacoes />} />
              <Route path="/comunicacao/editor" element={<EditorMensagens />} />
              <Route path="/comunicacao/conversas" element={<Conversas />} />
              <Route path="/entrega/cursos" element={<MeusCursos />} />
              <Route path="/entrega/mentorias" element={<MinhasMentorias />} />
              <Route path="/entrega/mentorias/:id" element={<MinhasMentorias />} />
              <Route path="/entrega/mentorias-ht" element={<MinhasMentorias />} />
              <Route path="/entrega/mentor" element={<PainelMentor />} />
              <Route path="/entrega/produtor" element={<PainelProdutor />} />
              <Route path="/conexoes" element={<Conexoes />} />
              <Route path="/infra/seguranca" element={<Seguranca />} />
              <Route path="/infra/configuracoes" element={<Configuracoes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
      <AIAgentFab onClick={() => { setAiInitialTab(undefined); setAiPanelOpen(true); }} alertCount={8} />
      <AIAgentPanel open={aiPanelOpen} onOpenChange={setAiPanelOpen} initialTab={aiInitialTab} />
    </>
  );
}

function AppLayout() {
  return (
    <ProtectedRoute>
      <GlobalFilterProvider>
        <SidebarProvider>
          <AppLayoutInner />
        </SidebarProvider>
      </GlobalFilterProvider>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
