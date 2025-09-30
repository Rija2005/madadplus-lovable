import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Layout from "./components/Layout";
import EmergencyHome from "./pages/EmergencyHome";
import AmbulanceDispatch from "./pages/AmbulanceDispatch";
import HospitalConnect from "./pages/HospitalConnect";
import FirstAidAssistant from "./pages/FirstAidAssistant";
import ReportsPage from "./pages/ReportsPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="madadgar-ui-theme">
        <BrowserRouter>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <Layout>
              <Routes>
                <Route path="/" element={<EmergencyHome />} />
                <Route path="/ambulance" element={<AmbulanceDispatch />} />
                <Route path="/hospitals" element={<HospitalConnect />} />
                <Route path="/first-aid" element={<FirstAidAssistant />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </LanguageProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
