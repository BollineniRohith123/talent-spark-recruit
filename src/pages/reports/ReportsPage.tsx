import { useState } from 'react';
import { Calendar, BarChart3, PieChart, Download, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

// Mock data for reports
const hiringData = [
  { month: 'Jan', candidates: 45, interviews: 32, hires: 12 },
  { month: 'Feb', candidates: 52, interviews: 38, hires: 15 },
  { month: 'Mar', candidates: 61, interviews: 45, hires: 18 },
  { month: 'Apr', candidates: 67, interviews: 50, hires: 22 },
  { month: 'May', candidates: 70, interviews: 55, hires: 25 },
  { month: 'Jun', candidates: 78, interviews: 60, hires: 28 },
];

const teamPerformance = [
  { 
    team: 'Engineering', 
    openPositions: 5, 
    candidates: 120, 
    interviews: 45, 
    hires: 8, 
    timeToHire: 28 
  },
  { 
    team: 'Product', 
    openPositions: 3, 
    candidates: 85, 
    interviews: 32, 
    hires: 5, 
    timeToHire: 35 
  },
  { 
    team: 'Design', 
    openPositions: 2, 
    candidates: 65, 
    interviews: 28, 
    hires: 4, 
    timeToHire: 30 
  },
  { 
    team: 'Marketing', 
    openPositions: 4, 
    candidates: 95, 
    interviews: 40, 
    hires: 6, 
    timeToHire: 25 
  },
  { 
    team: 'Sales', 
    openPositions: 6, 
    candidates: 110, 
    interviews: 50, 
    hires: 10, 
    timeToHire: 22 
  },
];

const budgetData = [
  { 
    month: 'Jan', 
    allocated: 25000, 
    spent: 22500, 
    remaining: 2500 
  },
  { 
    month: 'Feb', 
    allocated: 28000, 
    spent: 26000, 
    remaining: 2000 
  },
  { 
    month: 'Mar', 
    allocated: 30000, 
    spent: 29000, 
    remaining: 1000 
  },
  { 
    month: 'Apr', 
    allocated: 32000, 
    spent: 30500, 
    remaining: 1500 
  },
  { 
    month: 'May', 
    allocated: 35000, 
    spent: 33000, 
    remaining: 2000 
  },
  { 
    month: 'Jun', 
    allocated: 38000, 
    spent: 36000, 
    remaining: 2000 
  },
];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('last-6-months');
  const [reportType, setReportType] = useState('hiring');

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been exported as CSV`,
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Report data has been updated with the latest information",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Analyze recruitment metrics and performance data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiring">Hiring Metrics</SelectItem>
                  <SelectItem value="team">Team Performance</SelectItem>
                  <SelectItem value="budget">Budget Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">
            <BarChart3 className="h-4 w-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="tables">
            <i className="list text-xs font-bold mr-2">≡</i>
            Tables
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {reportType === 'hiring' && (
            <Card>
              <CardHeader>
                <CardTitle>Hiring Funnel</CardTitle>
                <CardDescription>Candidates, interviews, and hires over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Hiring Metrics Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display the hiring funnel metrics over time, showing candidates, 
                      interviews conducted, and successful hires.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Hiring metrics by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Team Performance Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display performance metrics for each team, including time-to-hire, 
                      candidates processed, and positions filled.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'budget' && (
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
                <CardDescription>Budget allocation and spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Budget Analysis Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display budget allocation, spending, and remaining funds over time,
                      helping track financial performance of recruitment efforts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          {reportType === 'hiring' && (
            <Card>
              <CardHeader>
                <CardTitle>Hiring Metrics</CardTitle>
                <CardDescription>Detailed hiring data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Month</th>
                        <th className="text-left py-3 px-4">Candidates</th>
                        <th className="text-left py-3 px-4">Interviews</th>
                        <th className="text-left py-3 px-4">Hires</th>
                        <th className="text-left py-3 px-4">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hiringData.map((month, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{month.month}</td>
                          <td className="py-3 px-4">{month.candidates}</td>
                          <td className="py-3 px-4">{month.interviews}</td>
                          <td className="py-3 px-4">{month.hires}</td>
                          <td className="py-3 px-4">
                            {((month.hires / month.candidates) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Detailed performance metrics by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Team</th>
                        <th className="text-left py-3 px-4">Open Positions</th>
                        <th className="text-left py-3 px-4">Candidates</th>
                        <th className="text-left py-3 px-4">Interviews</th>
                        <th className="text-left py-3 px-4">Hires</th>
                        <th className="text-left py-3 px-4">Avg. Time to Hire (days)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPerformance.map((team, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{team.team}</td>
                          <td className="py-3 px-4">{team.openPositions}</td>
                          <td className="py-3 px-4">{team.candidates}</td>
                          <td className="py-3 px-4">{team.interviews}</td>
                          <td className="py-3 px-4">{team.hires}</td>
                          <td className="py-3 px-4">{team.timeToHire}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'budget' && (
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
                <CardDescription>Detailed budget data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Month</th>
                        <th className="text-left py-3 px-4">Allocated Budget</th>
                        <th className="text-left py-3 px-4">Spent</th>
                        <th className="text-left py-3 px-4">Remaining</th>
                        <th className="text-left py-3 px-4">Utilization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetData.map((month, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{month.month}</td>
                          <td className="py-3 px-4">${month.allocated.toLocaleString()}</td>
                          <td className="py-3 px-4">${month.spent.toLocaleString()}</td>
                          <td className="py-3 px-4">${month.remaining.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {((month.spent / month.allocated) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
