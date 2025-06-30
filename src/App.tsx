import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterAdmin from "./pages/admin/Register";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

// Inisialisasi QueryClient untuk react-query
const queryClient = new QueryClient();

// Komponen proteksi route admin
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
          <Route path="/register_admin" element={<RegisterAdmin />} />
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
