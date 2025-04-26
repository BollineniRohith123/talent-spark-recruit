
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
  { position: 'Software Engineer', budget: 100, offered: 65, profit: 35 },
  { position: 'Data Scientist', budget: 120, offered: 80, profit: 40 },
  { position: 'Product Manager', budget: 110, offered: 75, profit: 35 },
  { position: 'UX Designer', budget: 95, offered: 60, profit: 35 },
  { position: 'DevOps Engineer', budget: 105, offered: 70, profit: 35 },
];

// Active recruitments
const activeRecruitments = [
  { 
    id: 1, 
    position: 'Senior React Developer', 
    budget: 110, 
    targetOffer: 75, 
    candidates: 12, 
    interviews: 5, 
    deadline: '2025-06-15',
    progress: 70
  },
  { 
    id: 2, 
    position: 'Data Engineer', 
    budget: 105, 
    targetOffer: 70, 
    candidates: 8, 
    interviews: 3, 
    deadline: '2025-05-30',
    progress: 50
  },
  { 
    id: 3, 
    position: 'Product Manager', 
    budget: 120, 
    targetOffer: 85, 
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

      {/* Budget Allocation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>Hourly rate breakdown by position</CardDescription>
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
                  return [`$${value}`, name === 'profit' ? 'Agency Profit' : name === 'offered' ? 'Candidate Offer' : 'Client Budget'];
                }}
              />
              <Legend 
                payload={[
                  { value: 'Client Budget', type: 'circle', color: '#8884d8' },
                  { value: 'Candidate Offer', type: 'circle', color: '#82ca9d' },
                  { value: 'Agency Profit', type: 'circle', color: '#ffc658' }
                ]}
              />
              <Bar dataKey="budget" stackId="a" fill="#8884d8" />
              <Bar dataKey="offered" stackId="b" fill="#82ca9d" />
              <Bar dataKey="profit" stackId="c" fill="#ffc658" />
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
                    <div className="flex space-x-6 mt-1 text-sm text-muted-foreground">
                      <span>Budget: ${recruitment.budget}/hr</span>
                      <span>Target Offer: ${recruitment.targetOffer}/hr</span>
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
