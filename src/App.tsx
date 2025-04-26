
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import AuthProtection from "@/components/auth/AuthProtection";
import NotFound from "./pages/NotFound";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";

// Dashboard Pages
import DashboardRouter from "./pages/dashboard/DashboardRouter";

// Resume Pages
import ResumeUploadPage from "./pages/resume/ResumeUploadPage";

// Screening Pages
import ScreeningsPage from "./pages/screening/ScreeningsPage";

// Candidates Pages
import CandidatesPage from "./pages/candidates/CandidatesPage";

// Interview Pages
import InterviewsPage from "./pages/interviews/InterviewsPage";

// Application Pages
import ApplicationPage from "./pages/application/ApplicationPage";

// Landing Page
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes with MainLayout */}
            {/* Dashboard */}
            <Route 
              path="/dashboard"
              element={
                <AuthProtection>
                  <MainLayout>
                    <DashboardRouter />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Resume Management - For Talent Scout & Hiring Manager */}
            <Route 
              path="/resume-upload"
              element={
                <AuthProtection allowedRoles={['company-admin', 'hiring-manager', 'talent-scout']}>
                  <MainLayout>
                    <ResumeUploadPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Screenings - For Talent Scout & Hiring Manager */}
            <Route 
              path="/screenings"
              element={
                <AuthProtection>
                  <MainLayout>
                    <ScreeningsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Candidates - For Everyone except Applicants */}
            <Route 
              path="/candidates"
              element={
                <AuthProtection allowedRoles={['company-admin', 'hiring-manager', 'talent-scout', 'team-member']}>
                  <MainLayout>
                    <CandidatesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Interviews - For Team Members & Talent Scouts */}
            <Route 
              path="/interviews"
              element={
                <AuthProtection>
                  <MainLayout>
                    <InterviewsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Application - For Applicants */}
            <Route 
              path="/application"
              element={
                <AuthProtection allowedRoles={['applicant']}>
                  <MainLayout>
                    <ApplicationPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
