import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DataAtividade from "./pages/DataAtividade";
import EquipamentoDetalhes from "./pages/EquipamentoDetalhes";
import AtividadesGlobal from "./pages/AtividadesGlobal";
import ConsolidadoAnual from "./pages/ConsolidadoAnual";
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
          <Route path="/atividades-global" element={<AtividadesGlobal />} />
          <Route path="/consolidado-anual" element={<ConsolidadoAnual />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
