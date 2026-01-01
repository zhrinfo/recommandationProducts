import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FemmeIndex from "./femme/FemmeIndex";

import ProtectedRoute from "./components/ProtectedRoute";

import AllProductsF from "./femme/allproductF";
import DetailProduit from "./femme/detailProduit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          <Route path="/femme/:username" element={
            <ProtectedRoute allowedGender="FEMALE">
              <FemmeIndex />
            </ProtectedRoute>
          } />
          <Route path="/femme/:username/products" element={<AllProductsF />} />
          <Route path="/femme/produit/:productId" element={
            <ProtectedRoute allowedGender="FEMALE">
              <DetailProduit />
            </ProtectedRoute>
          } />
       
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
