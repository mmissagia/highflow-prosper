import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import CRM from "./pages/CRM";
import Eventos from "./pages/Eventos";
import Comunicacao from "./pages/Comunicacao";
import Entrega from "./pages/Entrega";
import NotFound from "./pages/NotFound";

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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/crm" element={<CRM />} />
                  <Route path="/eventos" element={<Eventos />} />
                  <Route path="/comunicacao" element={<Comunicacao />} />
                  <Route path="/entrega" element={<Entrega />} />
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
