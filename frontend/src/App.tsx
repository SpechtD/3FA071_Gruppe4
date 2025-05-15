
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/dashboard";
import Import from "./pages/Import";
import ImportGuides from "./pages/ImportGuides"; 
import Export from "./pages/Export";
import Meters from "./pages/Meters";
import Customers from "./pages/Customers";
import Imprint from "./pages/Imprint"; 
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";

/**
 * Create a new query client for managing data fetching and caching
 * throughout the application using TanStack React Query
 */
const queryClient = new QueryClient();

/**
 * Main App Component
 * 
 * Initializes the application with all necessary providers and routing.
 * 
 * Structure:
 * - QueryClientProvider: For data fetching and state management
 * - TooltipProvider: For tooltips throughout the app
 * - Toaster & Sonner: For toast notifications
 * - BrowserRouter: For navigation between pages
 * - Sidebar: Main navigation component
 * - Routes: Application routes definition
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden">
          {/* Main sidebar navigation */}
          <Sidebar />
          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            <Routes>
              {/* Dashboard/home page */}
              <Route path="/" element={<Index />} />
              
              {/* Data management routes */}
              <Route path="/import" element={<Import />} />
              <Route path="/import-guides" element={<ImportGuides />} /> 
              <Route path="/export" element={<Export />} />
              
              {/* Entity management routes */}
              <Route path="/meters" element={<Meters />} />
              <Route path="/customers" element={<Customers />} />
              
              {/* Utility pages */}
              <Route path="/imprint" element={<Imprint />} />
              
              {/* 404 catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
