import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { FinanceProvider } from "@/hooks/useFinanceData";
import { FinanceErrorBoundary } from "@/components/FinanceErrorBoundary";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Loans from "./pages/Loans";
import Budget from "./pages/Budget";
import Reminders from "./pages/Reminders";
import Analytics from "./pages/Analytics";
import SpendingCalendar from "./pages/SpendingCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FinanceErrorBoundary>
      <FinanceProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<SpendingCalendar />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      </FinanceProvider>
      </FinanceErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
