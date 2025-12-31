import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HommeIndex from "./homme/HommeIndex";
import AllProductH from "./homme/allproductH";
import DetailProduit from "./homme/detailProduit";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          <Route path="/homme/:username" element={
            <ProtectedRoute allowedGender="MALE">
              <HommeIndex />
            </ProtectedRoute>
          } />
          <Route path="/homme/allproductH" element={<AllProductH />} />
          <Route path="/homme/produit/:productId" element={
            <ProtectedRoute allowedGender="MALE">
              <DetailProduit />
            </ProtectedRoute>
          } />
         
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
