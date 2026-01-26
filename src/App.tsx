import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScanProvider } from "@/contexts/ScanContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewScan from "./pages/NewScan";
import Report from "./pages/Report";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import FAQPage from "./pages/seo/FAQPage";
import ComparisonPage from "./pages/seo/ComparisonPage";
import SolutionsPage from "./pages/seo/SolutionsPage";
import BlogIndex from "./pages/seo/BlogIndex";
import BlogPost from "./pages/seo/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScanProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scan/new" element={<NewScan />} />
                <Route path="/scan/:id/report" element={<Report />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ScanProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
