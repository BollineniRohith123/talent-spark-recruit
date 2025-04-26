
import { useAuth } from '@/context/AuthContext';
import CompanyAdminDashboard from './CompanyAdminDashboard';
import HiringManagerDashboard from './HiringManagerDashboard';
import TalentScoutDashboard from './TalentScoutDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import ApplicantDashboard from './ApplicantDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Render the appropriate dashboard based on the user's role
  switch (user.role) {
    case 'company-admin':
      return <CompanyAdminDashboard />;
    case 'hiring-manager':
      return <HiringManagerDashboard />;
    case 'talent-scout':
      return <TalentScoutDashboard />;
    case 'team-member':
      return <TeamMemberDashboard />;
    case 'applicant':
      return <ApplicantDashboard />;
    default:
      return <div>Unknown user role</div>;
  }
};

export default DashboardRouter;
