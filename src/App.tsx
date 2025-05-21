
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

// Komponen sederhana untuk memeriksa apakah admin sudah login
// Dalam implementasi sebenarnya, ini harus menggunakan autentikasi yang tepat
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Implementasi sederhana untuk simulasi (ganti dengan sistem autentikasi sebenarnya)
  const isAuthenticated = sessionStorage.getItem("adminLoggedIn") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login_admin" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login_admin" element={<Login />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
