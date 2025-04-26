
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
import JobDescriptionPage from "./pages/resume/JobDescriptionPage";

// Screening Pages
import ScreeningsPage from "./pages/screening/ScreeningsPage";

// Candidates Pages
import CandidatesPage from "./pages/candidates/CandidatesPage";

// Interview Pages
import InterviewsPage from "./pages/interviews/InterviewsPage";

// Application Pages
import ApplicationPage from "./pages/application/ApplicationPage";

// Settings Pages
import SettingsPage from "./pages/settings/SettingsPage";

// Teams Pages
import TeamsPage from "./pages/teams/TeamsPage";
import ProfilesPage from "./pages/teams/ProfilesPage";

// Landing Page
import LandingPage from "./pages/LandingPage";

// Add Index page for routing decisions
import Index from "./pages/Index";

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
            
            {/* Index route for deciding where to redirect based on auth state */}
            <Route path="/index" element={<Index />} />

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

            {/* Teams - For Company Admin & Hiring Manager */}
            <Route 
              path="/teams"
              element={
                <AuthProtection allowedRoles={['company-admin', 'hiring-manager']}>
                  <MainLayout>
                    <TeamsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />
            
            {/* Profiles - For Company Admin & Hiring Manager */}
            <Route 
              path="/profiles"
              element={
                <AuthProtection allowedRoles={['company-admin', 'hiring-manager']}>
                  <MainLayout>
                    <ProfilesPage />
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
            
            {/* Job Descriptions - For Talent Scout & Hiring Manager */}
            <Route 
              path="/job-descriptions"
              element={
                <AuthProtection allowedRoles={['company-admin', 'hiring-manager', 'talent-scout']}>
                  <MainLayout>
                    <JobDescriptionPage />
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

            {/* Settings - For All Users */}
            <Route 
              path="/settings"
              element={
                <AuthProtection>
                  <MainLayout>
                    <SettingsPage />
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
