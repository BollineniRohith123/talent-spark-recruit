
import { BarChart3, Users, ClipboardCheck, Award, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

// Mock data for charts
const hiringData = [
  { month: 'Jan', screenings: 65, interviews: 28, hires: 8 },
  { month: 'Feb', screenings: 59, interviews: 31, hires: 12 },
  { month: 'Mar', screenings: 80, interviews: 40, hires: 15 },
  { month: 'Apr', screenings: 81, interviews: 45, hires: 18 },
  { month: 'May', screenings: 95, interviews: 52, hires: 24 },
  { month: 'Jun', screenings: 110, interviews: 58, hires: 30 },
];

const revenueData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 53000 },
  { month: 'Mar', revenue: 68000 },
  { month: 'Apr', revenue: 72000 },
  { month: 'May', revenue: 86000 },
  { month: 'Jun', revenue: 110000 },
];

const teamPerformance = [
  { name: 'Team Alpha', hires: 12, revenue: 48000 },
  { name: 'Team Beta', hires: 8, revenue: 32000 },
  { name: 'Team Gamma', hires: 15, revenue: 60000 },
];

const CompanyAdminDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of company-wide recruitment metrics and financial data
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Employees"
          value="128"
          description="Across all teams"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Active Candidates"
          value="64"
          description="In various stages"
          icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Monthly Hires"
          value="24"
          description="This month"
          icon={<Award className="h-6 w-6 text-primary" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Monthly Revenue"
          value="$110,000"
          description="From placements"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
          trend={{ value: 28, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
            <CardDescription>Screening to hire conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="screenings" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="interviews" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="hires" stackId="3" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue from placements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#9b87f5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Hiring and revenue metrics by team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Team</th>
                  <th className="text-left py-3 px-4">Talent Scouts</th>
                  <th className="text-left py-3 px-4">Hires</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Avg. Time to Hire</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((team, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{team.name}</td>
                    <td className="py-3 px-4">{Math.floor(Math.random() * 5) + 3}</td>
                    <td className="py-3 px-4">{team.hires}</td>
                    <td className="py-3 px-4">${team.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">{Math.floor(Math.random() * 10) + 14} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyAdminDashboard;
