import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StockPrediction from "./pages/StockPrediction";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";

import LearnYard from "./pages/LearnYard";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (

  <><ThemeProvider defaultTheme="system" storageKey="ai-investor-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stock-prediction" element={<StockPrediction />} />
            <Route path="/learn-yard" element={<LearnYard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider></>

);

export default App;
