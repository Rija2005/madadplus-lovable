import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Layout from "./components/Layout";
import { EmergencyHome } from "./pages/EmergencyHome";
import AmbulanceDispatch from "./pages/AmbulanceDispatch";
import HospitalConnect from "./pages/HospitalConnect";
import FirstAidAssistant from "./pages/FirstAidAssistant";
import ReportsPage from "./pages/ReportsPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { AdminDashboard } from "./pages/AdminDashboard";
import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { useToast } from './hooks/use-toast';

const queryClient = new QueryClient();

const App = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setAuthInitialized(true);
      } else {
        // User is signed out
        signInAnonymously(auth).catch((error) => {
          console.error('Anonymous sign-in failed:', error);
          toast({
            title: 'Authentication Error',
            description: 'Could not connect to the service. Please refresh the page.',
            variant: 'destructive',
          });
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [toast]);

  // Wait for Firebase auth to initialize before rendering the app
  if (!authInitialized) {
    return <div className="flex items-center justify-center h-screen"><div>Loading...</div></div>;
  }

  return (
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
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </LanguageProvider>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
