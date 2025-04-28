import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  BarChart3, 
  Users, 
  ClipboardCheck, 
  Award, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for daily metrics
const generateDailyData = () => {
  const days = 30; // Last 30 days
  const result = [];
  
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random but somewhat realistic metrics
    const screenings = Math.floor(Math.random() * 8) + 1;
    const interviews = Math.floor(screenings * 0.7);
    const hires = Math.floor(interviews * 0.3);
    const revenue = hires * (Math.floor(Math.random() * 5000) + 5000);
    const profit = Math.floor(revenue * 0.35);
    
    result.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      screenings,
      interviews,
      hires,
      revenue,
      profit,
      profitMargin: Math.floor((profit / revenue) * 100),
      timeToHire: Math.floor(Math.random() * 10) + 15,
      conversionRate: Math.floor((hires / screenings) * 100)
    });
  }
  
  return result;
};

// Aggregate daily data to weekly
const aggregateToWeekly = (dailyData) => {
  const weeks = {};
  
  dailyData.forEach(day => {
    const date = new Date(day.date);
    // Get the week number (approximate)
    const weekNum = Math.floor(date.getDate() / 7) + 1;
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const weekKey = `${monthName} W${weekNum}`;
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        weekKey,
        startDate: day.date,
        screenings: 0,
        interviews: 0,
        hires: 0,
        revenue: 0,
        profit: 0,
        days: 0
      };
    }
    
    weeks[weekKey].screenings += day.screenings;
    weeks[weekKey].interviews += day.interviews;
    weeks[weekKey].hires += day.hires;
    weeks[weekKey].revenue += day.revenue;
    weeks[weekKey].profit += day.profit;
    weeks[weekKey].days += 1;
    weeks[weekKey].endDate = day.date;
  });
  
  return Object.values(weeks).map(week => ({
    ...week,
    profitMargin: Math.floor((week.profit / week.revenue) * 100),
    timeToHire: Math.floor(Math.random() * 5) + 20, // Approximation
    conversionRate: Math.floor((week.hires / week.screenings) * 100)
  }));
};

// Aggregate daily data to monthly
const aggregateToMonthly = (dailyData) => {
  const months = {};
  
  dailyData.forEach(day => {
    const date = new Date(day.date);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!months[monthKey]) {
      months[monthKey] = {
        monthKey,
        screenings: 0,
        interviews: 0,
        hires: 0,
        revenue: 0,
        profit: 0,
        days: 0
      };
    }
    
    months[monthKey].screenings += day.screenings;
    months[monthKey].interviews += day.interviews;
    months[monthKey].hires += day.hires;
    months[monthKey].revenue += day.revenue;
    months[monthKey].profit += day.profit;
    months[monthKey].days += 1;
  });
  
  return Object.values(months).map(month => ({
    ...month,
    profitMargin: Math.floor((month.profit / month.revenue) * 100),
    timeToHire: Math.floor(Math.random() * 5) + 22, // Approximation
    conversionRate: Math.floor((month.hires / month.screenings) * 100)
  }));
};

interface MetricsTableProps {
  className?: string;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [viewMode, setViewMode] = useState('table');
  const [metricType, setMetricType] = useState('recruitment');
  
  // Generate and memoize data
  const dailyData = useMemo(() => generateDailyData(), []);
  const weeklyData = useMemo(() => aggregateToWeekly(dailyData), [dailyData]);
  const monthlyData = useMemo(() => aggregateToMonthly(dailyData), [dailyData]);
  
  // Get the appropriate data based on selected time range
  const getData = () => {
    switch (timeRange) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return weeklyData;
    }
  };
  
  const data = getData();
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Handle export
  const handleExport = () => {
    // In a real app, this would generate a CSV file
    alert('Exporting data as CSV...');
  };
  
  // Get chart data based on metric type
  const getChartData = () => {
    if (metricType === 'recruitment') {
      return data.map(item => ({
        name: timeRange === 'daily' ? item.day : timeRange === 'weekly' ? item.weekKey : item.monthKey,
        Screenings: item.screenings,
        Interviews: item.interviews,
        Hires: item.hires
      }));
    } else {
      return data.map(item => ({
        name: timeRange === 'daily' ? item.day : timeRange === 'weekly' ? item.weekKey : item.monthKey,
        Revenue: item.revenue,
        Profit: item.profit
      }));
    }
  };
  
  const chartData = getChartData();
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Recruitment Metrics</CardTitle>
            <CardDescription>
              Track screenings, hires, and financial performance
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={metricType} onValueChange={setMetricType}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Metric Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruitment">Recruitment</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Table
            </TabsTrigger>
            <TabsTrigger value="chart">
              <BarChart3 className="h-4 w-4 mr-2" />
              Chart
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="w-full">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {timeRange === 'daily' ? 'Date' : 
                       timeRange === 'weekly' ? 'Week' : 'Month'}
                    </TableHead>
                    <TableHead>Screenings</TableHead>
                    <TableHead>Interviews</TableHead>
                    <TableHead>Hires</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Time to Hire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {timeRange === 'daily' ? item.date : 
                         timeRange === 'weekly' ? `${item.startDate} to ${item.endDate}` : 
                         item.monthKey}
                      </TableCell>
                      <TableCell>{item.screenings}</TableCell>
                      <TableCell>{item.interviews}</TableCell>
                      <TableCell>{item.hires}</TableCell>
                      <TableCell>{item.conversionRate}%</TableCell>
                      <TableCell>{formatCurrency(item.revenue)}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {formatCurrency(item.profit)}
                      </TableCell>
                      <TableCell>{item.profitMargin}%</TableCell>
                      <TableCell>{item.timeToHire} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="chart">
            <div className="h-[400px] w-full">
              {metricType === 'recruitment' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Screenings" fill="#8884d8" />
                    <Bar dataKey="Interviews" fill="#82ca9d" />
                    <Bar dataKey="Hires" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="Revenue" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="Profit" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium">Total Screenings</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.reduce((sum, item) => sum + item.screenings, 0)}
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium">Total Hires</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {data.reduce((sum, item) => sum + item.hires, 0)}
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <div className="mt-2 text-2xl font-bold">
              {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm font-medium">Total Profit</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(data.reduce((sum, item) => sum + item.profit, 0))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsTable;
