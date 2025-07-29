
/*
 * 🚀 App Component - The main stage where magic happens
 * Application architecture crafted by Mr. Sweet
 */
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";

import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";

import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import PromotionManagement from "./pages/admin/PromotionManagement";
import DatabaseTest from "./components/DatabaseTest";

// Enhanced query client with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const handleRefresh = () => {
    // Safer page refresh method
    window.location.href = window.location.href;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">Please refresh the page and try again.</p>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
           
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
 
              {/* Admin Routes */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminOrders />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/order-management" element={
                <ProtectedRoute requiredRole="admin">
                  <OrderManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/customers" element={
                <ProtectedRoute requiredRole="admin">
                  <CustomerManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/promotions" element={
                <ProtectedRoute requiredRole="admin">
                  <PromotionManagement />
                </ProtectedRoute>
              } />
              <Route path="/database-test" element={<DatabaseTest />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
