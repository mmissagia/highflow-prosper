import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Pages
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-16 border-b border-border bg-background flex items-center px-6">
                <SidebarTrigger className="mr-4" />
              </header>
              <main className="flex-1 p-6 bg-muted/30">
                <Routes>
                  {/* Dashboard */}
                  <Route path="/" element={<Dashboard />} />

                  {/* CRM */}
                  <Route path="/crm/pipeline" element={<Pipeline />} />
                  <Route path="/crm/leads" element={<LeadsList />} />
                  <Route path="/crm/lead" element={<LeadDetail />} />
                  <Route path="/crm/lead/:id" element={<LeadDetail />} />

                  {/* Eventos */}
                  <Route path="/eventos" element={<EventosList />} />
                  <Route path="/eventos/detalhe" element={<EventoDetail />} />
                  <Route path="/eventos/detalhe/:id" element={<EventoDetail />} />
                  <Route path="/eventos/pitch" element={<PitchEditor />} />
                  <Route path="/eventos/pitch/:id" element={<PitchEditor />} />
                  <Route path="/eventos/estrategias" element={<ConstrutorEstrategias />} />

                  {/* Comunicação */}
                  <Route path="/comunicacao/campanhas" element={<Campanhas />} />
                  <Route path="/comunicacao/automacoes" element={<Automacoes />} />
                  <Route path="/comunicacao/editor" element={<EditorMensagens />} />
                  <Route path="/comunicacao/conversas" element={<Conversas />} />

                  {/* Entrega */}
                  <Route path="/entrega/cursos" element={<MeusCursos />} />
                  <Route path="/entrega/mentorias" element={<MinhasMentorias />} />
                  <Route path="/entrega/mentorias/:id" element={<MinhasMentorias />} />
                  <Route path="/entrega/mentor" element={<PainelMentor />} />
                  <Route path="/entrega/produtor" element={<PainelProdutor />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
