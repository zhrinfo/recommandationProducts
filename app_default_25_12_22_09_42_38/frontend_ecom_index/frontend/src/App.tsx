import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicIndex from "./public-index/PublicIndex";
import HommeIndex from "./homme/HommeIndex";
import FemmeIndex from "./femme/FemmeIndex";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import AllProducts from "./public-index/allProduct";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicIndex />} />
          <Route path="/homme" element={
            <ProtectedRoute allowedGender="MALE">
              <HommeIndex />
            </ProtectedRoute>
          } />
          <Route path="/femme" element={
            <ProtectedRoute allowedGender="FEMALE">
              <FemmeIndex />
            </ProtectedRoute>
          } />

           <Route path="/products" element={<AllProducts />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
