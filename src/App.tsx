import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import RDGMemberPopup from "./components/RDGMemberPopup";
import Index from "./pages/Index";
import CapabilityStatement from "./pages/CapabilityStatement";
import Government from "./pages/Government";
import Pricing from "./pages/Pricing";
import MaintenancePlans from "./pages/MaintenancePlans";
import Work from "./pages/Work";
import Portfolio from "./pages/Portfolio";
import Testimonials from "./pages/Testimonials";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import CaseStudy from "./pages/CaseStudy";
import ThankYou from "./pages/ThankYou";
import InvoicePortal from "./pages/InvoicePortal";
import InvoiceThankYou from "./pages/InvoiceThankYou";
import InvoiceAdmin from "./pages/InvoiceAdmin";
import HomeOfficeLogin from "./pages/HomeOfficeLogin";
import HomeOffice from "./pages/HomeOffice";
import HomeOfficeWelcome from "./pages/HomeOfficeWelcome";
import HomeOfficeResetPassword from "./pages/HomeOfficeResetPassword";
import HomeOfficeOnboarding from "./pages/HomeOfficeOnboarding";
import WorkAssistant from "./pages/WorkAssistant";
import Accounting from "./pages/Accounting";
import HomeOfficeHelp from "./pages/HomeOfficeHelp";
import BillsTracker from "./pages/BillsTracker";
import HomeOfficeProfile from "./pages/HomeOfficeProfile";
import AppsLanding from "./pages/AppsLanding";
import AppsLogin from "./pages/AppsLogin";
import AppsResetPassword from "./pages/AppsResetPassword";
import AppsOnboarding from "./pages/AppsOnboarding";

import AppsLegal from "./pages/AppsLegal";
import AdminInvoices from "./pages/apps/AdminInvoices";
import AdminBills from "./pages/apps/AdminBills";
import AdminTaxes from "./pages/apps/AdminTaxes";
import ClientPortal from "./pages/apps/ClientPortal";
import Membership from "./pages/Membership";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthSync = () => {
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) sessionStorage.setItem("ho-token", session.access_token);
      else sessionStorage.removeItem("ho-token");
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScrollProgress />
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthSync />
        <RDGMemberPopup />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/government" element={<Government />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/maintenance-plans" element={<MaintenancePlans />} />
            <Route path="/work" element={<Work />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/capability-statement" element={<CapabilityStatement />} />
            <Route path="/case-study/:slug" element={<CaseStudy />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/portal" element={<InvoicePortal />} />
            <Route path="/portal/thank-you" element={<InvoiceThankYou />} />
            <Route path="/invoice" element={<Navigate to="/portal" replace />} />
            <Route path="/invoice/thank-you" element={<Navigate to="/portal/thank-you" replace />} />
            <Route path="/admin" element={<InvoiceAdmin />} />
            <Route path="/home-office/login" element={<HomeOfficeLogin />} />
            <Route path="/home-office/welcome" element={<HomeOfficeWelcome />} />
            <Route path="/home-office/reset-password" element={<HomeOfficeResetPassword />} />
            <Route path="/home-office/onboarding" element={<HomeOfficeOnboarding />} />
            <Route path="/home-office" element={<HomeOffice />} />
            <Route path="/home-office/work-assistant" element={<WorkAssistant />} />
            <Route path="/home-office/accounting" element={<Accounting />} />
            <Route path="/home-office/help" element={<HomeOfficeHelp />} />
            <Route path="/home-office/bills" element={<BillsTracker />} />
            <Route path="/home-office/profile" element={<HomeOfficeProfile />} />
            <Route path="/apps" element={<AppsLanding />} />
            <Route path="/apps/login" element={<AppsLogin />} />
            <Route path="/apps/reset-password" element={<AppsResetPassword />} />
            <Route path="/apps/onboarding" element={<AppsOnboarding />} />
            <Route path="/apps/legal/:kind" element={<AppsLegal />} />
            <Route path="/apps/admin/invoices" element={<AdminInvoices />} />
            <Route path="/apps/admin/bills" element={<AdminBills />} />
            <Route path="/apps/admin/taxes" element={<AdminTaxes />} />
            <Route path="/apps/client/portal" element={<ClientPortal />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/referral" element={<Referral />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
