
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import MainLayout from "@/components/layout/MainLayout";
import AuthProtection from "@/components/auth/AuthProtection";
import NotFound from "./pages/NotFound";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Dashboard Pages
import DashboardRouter from "./pages/dashboard/DashboardRouter";

// Admin Pages
import AdminPanelPage from "./pages/admin/AdminPanelPage";

// Resume Pages
import ResumeUploadPage from "./pages/resume/ResumeUploadPage";
import JobDescriptionPage from "./pages/resume/JobDescriptionPage";
import JobMatchingResultsPage from "./pages/resume/JobMatchingResultsPage";

// Screening Pages
import ScreeningsPage from "./pages/screening/ScreeningsPage";

// Candidates Pages
import CandidatesPage from "./pages/candidates/CandidatesPage";
import CandidateDetailsPage from "./pages/candidates/CandidateDetailsPage";

// Interview Pages
import InterviewsPage from "./pages/interviews/InterviewsPage";

// Application Pages
import ApplicationPage from "./pages/application/ApplicationPage";

// Settings Pages
import SettingsPage from "./pages/settings/SettingsPage";

// Teams Pages
import TeamsPage from "./pages/teams/TeamsPage";
import ProfilesPage from "./pages/teams/ProfilesPage";
import TeamDetailsPage from "./pages/teams/TeamDetailsPage";
import ProfileDetailsPage from "./pages/teams/ProfileDetailsPage";

// Reports Page
import ReportsPage from "./pages/reports/ReportsPage";

// Job Listings Pages
import JobListingsPage from "./pages/jobs/JobListingsPage";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import JobCreatePage from "./pages/jobs/JobCreatePage";

// Profit Pages
import ProfitCalculatorPage from "./pages/profit/ProfitCalculatorPage";

// Feedback Page has been removed and integrated into ProfileDetailsPage

// Landing Page
import LandingPage from "./pages/LandingPage";

// Add Index page for routing decisions
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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

            {/* Admin Panel - For CEO Only */}
            <Route
              path="/admin"
              element={
                <AuthProtection allowedRoles={['ceo']}>
                  <MainLayout>
                    <AdminPanelPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Teams - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/teams"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor']}>
                  <MainLayout>
                    <TeamsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Team Details - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/teams/:teamId"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor']}>
                  <MainLayout>
                    <TeamDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Profiles - For All Roles except Applicant */}
            <Route
              path="/profiles"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <ProfilesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Profile Details - For All Roles except Applicant */}
            <Route
              path="/profiles/:profileId"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <ProfileDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Resume Management - For Marketing Recruiter & Marketing Associate */}
            <Route
              path="/resume-upload"
              element={
                <AuthProtection allowedRoles={['ceo', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <ResumeUploadPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Job Descriptions - For All Roles except Applicant */}
            <Route
              path="/job-descriptions"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <JobDescriptionPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Job Matching Results - For All Roles except Applicant */}
            <Route
              path="/job-matching-results"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <JobMatchingResultsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Screenings - For CEO, Marketing Recruiter */}
            <Route
              path="/screenings"
              element={
                <AuthProtection allowedRoles={['ceo', 'marketing-recruiter']}>
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
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <CandidatesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Candidate Details - For Everyone except Applicants */}
            <Route
              path="/candidates/:candidateId"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <CandidateDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Interviews - For CEO, Marketing Associate */}
            <Route
              path="/interviews"
              element={
                <AuthProtection allowedRoles={['ceo', 'marketing-associate']}>
                  <MainLayout>
                    <InterviewsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Feedback has been integrated into Profile Details page */}

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

            {/* Reports - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/reports"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor']}>
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Job Listings - For All Roles except Applicant */}
            <Route
              path="/jobs"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <JobListingsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Job Details - For All Roles except Applicant */}
            <Route
              path="/jobs/:jobId"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate']}>
                  <MainLayout>
                    <JobDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Create Job - For CEO, Branch Manager, Marketing Head */}
            <Route
              path="/jobs/create"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head']}>
                  <MainLayout>
                    <JobCreatePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Profit Calculator - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/profit-calculator"
              element={
                <AuthProtection allowedRoles={['ceo', 'branch-manager', 'marketing-head', 'marketing-supervisor']}>
                  <MainLayout>
                    <ProfitCalculatorPage />
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
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
