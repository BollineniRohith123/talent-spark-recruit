
import { DollarSign, Percent, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Progress } from '@/components/ui/progress';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Mock data for charts
const budgetData = [
  {
    position: 'Software Engineer',
    clientBudget: 120,
    internalBudget: 85,
    candidateShare: 68, // 80% of internal budget
    companyShare: 17,   // 20% of internal budget
    clientToCompany: 35, // client budget - internal budget
    companyToCandidate: 17, // 20% of internal budget
    totalProfit: 52 // clientToCompany + companyToCandidate
  },
  {
    position: 'Data Scientist',
    clientBudget: 130,
    internalBudget: 90,
    candidateShare: 67.5, // 75% of internal budget
    companyShare: 22.5,   // 25% of internal budget
    clientToCompany: 40, // client budget - internal budget
    companyToCandidate: 22.5, // 25% of internal budget
    totalProfit: 62.5 // clientToCompany + companyToCandidate
  },
  {
    position: 'Product Manager',
    clientBudget: 110,
    internalBudget: 80,
    candidateShare: 64, // 80% of internal budget
    companyShare: 16,   // 20% of internal budget
    clientToCompany: 30, // client budget - internal budget
    companyToCandidate: 16, // 20% of internal budget
    totalProfit: 46 // clientToCompany + companyToCandidate
  },
  {
    position: 'UX Designer',
    clientBudget: 95,
    internalBudget: 70,
    candidateShare: 59.5, // 85% of internal budget
    companyShare: 10.5,   // 15% of internal budget
    clientToCompany: 25, // client budget - internal budget
    companyToCandidate: 10.5, // 15% of internal budget
    totalProfit: 35.5 // clientToCompany + companyToCandidate
  },
  {
    position: 'DevOps Engineer',
    clientBudget: 105,
    internalBudget: 75,
    candidateShare: 60, // 80% of internal budget
    companyShare: 15,   // 20% of internal budget
    clientToCompany: 30, // client budget - internal budget
    companyToCandidate: 15, // 20% of internal budget
    totalProfit: 45 // clientToCompany + companyToCandidate
  },
];

// Active recruitments
const activeRecruitments = [
  {
    id: 1,
    position: 'Senior React Developer',
    clientBudget: 110,
    internalBudget: 75,
    candidateSplit: 80,
    companySplit: 20,
    profit: 50, // (110-75) + (75*0.2)
    profitMargin: 45.5, // (50/110)*100
    candidates: 12,
    interviews: 5,
    deadline: '2025-06-15',
    progress: 70
  },
  {
    id: 2,
    position: 'Data Engineer',
    clientBudget: 105,
    internalBudget: 70,
    candidateSplit: 80,
    companySplit: 20,
    profit: 49, // (105-70) + (70*0.2)
    profitMargin: 46.7, // (49/105)*100
    candidates: 8,
    interviews: 3,
    deadline: '2025-05-30',
    progress: 50
  },
  {
    id: 3,
    position: 'Product Manager',
    clientBudget: 120,
    internalBudget: 85,
    candidateSplit: 75,
    companySplit: 25,
    profit: 56.25, // (120-85) + (85*0.25)
    profitMargin: 46.9, // (56.25/120)*100
    candidates: 15,
    interviews: 7,
    deadline: '2025-06-25',
    progress: 40
  }
];

const HiringManagerDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Hiring Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track budgets, profit margins, and team recruitment progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Budget"
          value="$32,500"
          description="Current month"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Average Profit Margin"
          value="32%"
          description="Per placement"
          icon={<Percent className="h-6 w-6 text-primary" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Open Positions"
          value="8"
          description="Across all teams"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Time to Fill"
          value="25 days"
          description="Average"
          icon={<Calendar className="h-6 w-6 text-primary" />}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Budget & Profit Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget & Profit Breakdown</CardTitle>
          <CardDescription>Detailed budget and profit allocation by position</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={budgetData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    'clientBudget': 'Client Budget',
                    'internalBudget': 'Internal Budget',
                    'candidateShare': 'Candidate Share',
                    'companyShare': 'Company Share',
                    'totalProfit': 'Total Profit'
                  };
                  return [`$${value}/hr`, labels[name] || name];
                }}
              />
              <Legend
                payload={[
                  { value: 'Client Budget', type: 'circle', color: '#8884d8' },
                  { value: 'Internal Budget', type: 'circle', color: '#82ca9d' },
                  { value: 'Candidate Share', type: 'circle', color: '#4ade80' },
                  { value: 'Company Share', type: 'circle', color: '#f97316' },
                  { value: 'Total Profit', type: 'circle', color: '#ec4899' }
                ]}
              />
              <Bar dataKey="clientBudget" fill="#8884d8" />
              <Bar dataKey="internalBudget" fill="#82ca9d" />
              <Bar dataKey="candidateShare" fill="#4ade80" />
              <Bar dataKey="companyShare" fill="#f97316" />
              <Bar dataKey="totalProfit" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Recruitments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Recruitments</CardTitle>
          <CardDescription>Currently open positions and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeRecruitments.map((recruitment) => (
              <div key={recruitment.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{recruitment.position}</h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Internal Budget: ${recruitment.internalBudget}/hr</span>
                      <span>Candidate Split: {recruitment.candidateSplit}%</span>
                      <span>Company Split: {recruitment.companySplit}%</span>
                      <span>Profit: ${recruitment.profit.toFixed(2)}/hr ({recruitment.profitMargin.toFixed(1)}%)</span>
                      <span>Deadline: {new Date(recruitment.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="bg-recruit-info px-3 py-1 rounded-full text-xs font-medium">
                    {recruitment.candidates} candidates
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{recruitment.progress}%</span>
                  </div>
                  <Progress value={recruitment.progress} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Talent Scout Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Talent Scout Performance</CardTitle>
          <CardDescription>Effectiveness metrics for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Talent Scout</th>
                  <th className="text-left py-3 px-4">Screenings</th>
                  <th className="text-left py-3 px-4">Interviews</th>
                  <th className="text-left py-3 px-4">Hires</th>
                  <th className="text-left py-3 px-4">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Jamie Garcia</td>
                  <td className="py-3 px-4">42</td>
                  <td className="py-3 px-4">18</td>
                  <td className="py-3 px-4">7</td>
                  <td className="py-3 px-4">16.7%</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Sam Taylor</td>
                  <td className="py-3 px-4">38</td>
                  <td className="py-3 px-4">15</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">13.2%</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Alex Johnson</td>
                  <td className="py-3 px-4">51</td>
                  <td className="py-3 px-4">22</td>
                  <td className="py-3 px-4">9</td>
                  <td className="py-3 px-4">17.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HiringManagerDashboard;
