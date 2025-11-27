import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DataAtividade from "./pages/DataAtividade";
import EquipamentoDetalhes from "./pages/EquipamentoDetalhes";
import ConsolidadoAnual from "./pages/ConsolidadoAnual";
import TasksFrontOffice from "./pages/TasksFrontOffice";
import AtividadesEngenharia from "./pages/AtividadesEngenharia";
import AtividadesMarketing from "./pages/AtividadesMarketing";
import ConsolidadoHorarioComercial from "./pages/ConsolidadoHorarioComercial";
import AtividadesPlataforma from "./pages/AtividadesPlataforma";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/data-atividade" element={<DataAtividade />} />
          <Route path="/equipamento/:equipmentName" element={<EquipamentoDetalhes />} />
          <Route path="/consolidado-anual" element={<ConsolidadoAnual />} />
          <Route path="/tasks-front-office" element={<TasksFrontOffice />} />
          <Route path="/atividades-engenharia" element={<AtividadesEngenharia />} />
          <Route path="/atividades-marketing" element={<AtividadesMarketing />} />
          <Route path="/consolidado-horario-comercial" element={<ConsolidadoHorarioComercial />} />
          <Route path="/atividades-plataforma" element={<AtividadesPlataforma />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
