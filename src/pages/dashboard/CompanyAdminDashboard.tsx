
import { BarChart3, Users, ClipboardCheck, Award, DollarSign, TrendingUp, Percent, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Progress } from '@/components/ui/progress';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Bar,
  BarChart,
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
  { month: 'Jan', revenue: 42000, profit: 15000 },
  { month: 'Feb', revenue: 53000, profit: 19500 },
  { month: 'Mar', revenue: 68000, profit: 25000 },
  { month: 'Apr', revenue: 72000, profit: 27500 },
  { month: 'May', revenue: 86000, profit: 33000 },
  { month: 'Jun', revenue: 110000, profit: 42500 },
];

const teamPerformance = [
  { name: 'Team Alpha', hires: 12, revenue: 48000, profit: 18500, profitMargin: 38.5 },
  { name: 'Team Beta', hires: 8, revenue: 32000, profit: 12000, profitMargin: 37.5 },
  { name: 'Team Gamma', hires: 15, revenue: 60000, profit: 24000, profitMargin: 40.0 },
];

const profitBreakdownData = [
  { category: 'Client-to-Company', value: 65000 },
  { category: 'Company-to-Candidate', value: 22500 },
];

const positionProfitData = [
  { position: 'Software Engineer', clientBudget: 120, internalBudget: 85, profit: 52 },
  { position: 'Data Scientist', clientBudget: 130, internalBudget: 90, profit: 62.5 },
  { position: 'UX/UI Designer', clientBudget: 95, internalBudget: 70, profit: 35.5 },
  { position: 'Project Manager', clientBudget: 110, internalBudget: 80, profit: 46 },
  { position: 'Sales Representative', clientBudget: 85, internalBudget: 65, profit: 33 },
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
        <StatsCard
          title="Monthly Profit"
          value="$42,500"
          description="38.6% margin"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Profit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Total Profit</span>
                <span className="text-2xl font-bold">$87,500</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">YTD Profit</span>
                <span className="text-xs font-medium text-green-600">+12.5% from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Client-to-Company</span>
                <span className="text-2xl font-bold">$65,000</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Profit Margin</span>
                <span className="text-xs font-medium">26% of client budget</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Company-to-Candidate</span>
                <span className="text-2xl font-bold">$22,500</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Average Split</span>
                <span className="text-xs font-medium">20% company / 80% candidate</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <CardTitle>Revenue & Profit</CardTitle>
            <CardDescription>Monthly revenue and profit from placements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#9b87f5" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#4ade80" strokeWidth={2} />
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
                  <th className="text-left py-3 px-4">Profit</th>
                  <th className="text-left py-3 px-4">Margin</th>
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
                    <td className="py-3 px-4 text-green-600 font-medium">${team.profit.toLocaleString()}</td>
                    <td className="py-3 px-4">{team.profitMargin.toFixed(1)}%</td>
                    <td className="py-3 px-4">{Math.floor(Math.random() * 10) + 14} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Position Profit Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Position Profit Analysis</CardTitle>
          <CardDescription>Profit breakdown by position type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Position</th>
                  <th className="text-left py-3 px-4">Client Budget</th>
                  <th className="text-left py-3 px-4">Internal Budget</th>
                  <th className="text-left py-3 px-4">Client-to-Company</th>
                  <th className="text-left py-3 px-4">Company-to-Candidate</th>
                  <th className="text-left py-3 px-4">Total Profit</th>
                  <th className="text-left py-3 px-4">Margin</th>
                </tr>
              </thead>
              <tbody>
                {positionProfitData.map((position, i) => {
                  const clientToCompany = position.clientBudget - position.internalBudget;
                  const companyToCandidate = (position.internalBudget * 0.2); // Assuming 20% company split
                  const totalProfit = position.profit;
                  const margin = (totalProfit / position.clientBudget * 100).toFixed(1);

                  return (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{position.position}</td>
                      <td className="py-3 px-4">${position.clientBudget}/hr</td>
                      <td className="py-3 px-4">${position.internalBudget}/hr</td>
                      <td className="py-3 px-4 text-green-600">${clientToCompany}/hr</td>
                      <td className="py-3 px-4 text-green-600">${companyToCandidate}/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">${totalProfit}/hr</td>
                      <td className="py-3 px-4">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyAdminDashboard;
