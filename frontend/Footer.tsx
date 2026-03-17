import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AIChatPage from "./pages/AIChatPage.tsx";
import LawyerFinderPage from "./pages/LawyerFinderPage.tsx";
import LawyerProfilePage from "./pages/LawyerProfilePage.tsx";
import DocumentAnalyzerPage from "./pages/DocumentAnalyzerPage.tsx";
import BookingPage from "./pages/BookingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<AIChatPage />} />
          <Route path="/lawyers" element={<LawyerFinderPage />} />
          <Route path="/lawyers/:id" element={<LawyerProfilePage />} />
          <Route path="/documents" element={<DocumentAnalyzerPage />} />
          <Route path="/book/:id" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
