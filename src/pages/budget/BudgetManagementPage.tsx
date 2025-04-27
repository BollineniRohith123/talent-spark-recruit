import { useState } from 'react';
import {
  DollarSign,
  Percent,
  PieChart,
  BarChart3,
  Download,
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

// Mock budget data
const mockBudgetData = {
  totalBudget: 250000,
  allocated: 185000,
  remaining: 65000,
  departments: [
    {
      id: 1,
      name: 'Engineering',
      budget: 100000,
      spent: 75000,
      remaining: 25000,
      positions: 5,
      hires: 3,
    },
    {
      id: 2,
      name: 'Product',
      budget: 50000,
      spent: 42000,
      remaining: 8000,
      positions: 3,
      hires: 2,
    },
    {
      id: 3,
      name: 'Design',
      budget: 35000,
      spent: 28000,
      remaining: 7000,
      positions: 2,
      hires: 1,
    },
    {
      id: 4,
      name: 'Marketing',
      budget: 40000,
      spent: 30000,
      remaining: 10000,
      positions: 3,
      hires: 2,
    },
    {
      id: 5,
      name: 'Sales',
      budget: 25000,
      spent: 10000,
      remaining: 15000,
      positions: 2,
      hires: 0,
    },
  ],
  monthlySpending: [
    { month: 'Jan', amount: 15000 },
    { month: 'Feb', amount: 18000 },
    { month: 'Mar', amount: 22000 },
    { month: 'Apr', amount: 25000 },
    { month: 'May', amount: 30000 },
    { month: 'Jun', amount: 35000 },
    { month: 'Jul', amount: 40000 },
  ],
  categories: [
    { name: 'Recruitment Agencies', amount: 75000, percentage: 40.5 },
    { name: 'Job Boards', amount: 45000, percentage: 24.3 },
    { name: 'Referral Bonuses', amount: 25000, percentage: 13.5 },
    { name: 'Recruitment Tools', amount: 20000, percentage: 10.8 },
    { name: 'Candidate Travel', amount: 15000, percentage: 8.1 },
    { name: 'Other', amount: 5000, percentage: 2.7 },
  ]
};

const BudgetManagementPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBudgetDialog, setShowAddBudgetDialog] = useState(false);
  const [newBudget, setNewBudget] = useState({
    department: '',
    amount: '',
    positions: '',
    defaultClientBudget: '',
    defaultInternalBudget: '',
    defaultCandidateSplit: '80',
    defaultCompanySplit: '20',
  });
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('year-to-date');

  const filteredDepartments = departmentFilter === 'all'
    ? mockBudgetData.departments
    : mockBudgetData.departments.filter(dept => dept.name === departmentFilter);

  const handleAddBudget = () => {
    if (!newBudget.department || !newBudget.amount || !newBudget.positions) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate profit configuration if provided
    if (
      (newBudget.defaultClientBudget && !newBudget.defaultInternalBudget) ||
      (!newBudget.defaultClientBudget && newBudget.defaultInternalBudget)
    ) {
      toast({
        title: "Incomplete Profit Configuration",
        description: "Please provide both client budget and internal budget",
        variant: "destructive",
      });
      return;
    }

    // If both budgets are provided, validate that internal budget is less than client budget
    if (
      newBudget.defaultClientBudget &&
      newBudget.defaultInternalBudget &&
      parseFloat(newBudget.defaultInternalBudget) >= parseFloat(newBudget.defaultClientBudget)
    ) {
      toast({
        title: "Invalid Budget Configuration",
        description: "Internal budget must be less than client budget",
        variant: "destructive",
      });
      return;
    }

    // Validate that candidate split + company split = 100%
    if (
      parseInt(newBudget.defaultCandidateSplit) + parseInt(newBudget.defaultCompanySplit) !== 100
    ) {
      toast({
        title: "Invalid Profit Split",
        description: "Candidate split and company split must add up to 100%",
        variant: "destructive",
      });
      return;
    }

    // Calculate profit metrics for reporting
    let profitMetrics = {};
    if (newBudget.defaultClientBudget && newBudget.defaultInternalBudget) {
      const clientToCompanyProfit = parseFloat(newBudget.defaultClientBudget) - parseFloat(newBudget.defaultInternalBudget);
      const companyToCandidateProfit = (parseFloat(newBudget.defaultInternalBudget) * parseInt(newBudget.defaultCompanySplit)) / 100;
      const totalProfit = clientToCompanyProfit + companyToCandidateProfit;
      const profitMargin = (totalProfit / parseFloat(newBudget.defaultClientBudget)) * 100;

      profitMetrics = {
        clientToCompanyProfit,
        companyToCandidateProfit,
        totalProfit,
        profitMargin
      };

      // Log profit metrics (in a real app, this would be saved to the database)
      console.log('Department Profit Configuration:', {
        department: newBudget.department,
        clientBudget: parseFloat(newBudget.defaultClientBudget),
        internalBudget: parseFloat(newBudget.defaultInternalBudget),
        candidateSplit: parseInt(newBudget.defaultCandidateSplit),
        companySplit: parseInt(newBudget.defaultCompanySplit),
        ...profitMetrics
      });
    }

    toast({
      title: "Budget Allocated",
      description: `$${parseInt(newBudget.amount).toLocaleString()} has been allocated to ${newBudget.department}${
        Object.keys(profitMetrics).length > 0 ?
        ` with profit configuration (${profitMetrics.profitMargin.toFixed(2)}% margin)` :
        ''
      }`,
    });

    setNewBudget({
      department: '',
      amount: '',
      positions: '',
      defaultClientBudget: '',
      defaultInternalBudget: '',
      defaultCandidateSplit: '80',
      defaultCompanySplit: '20',
    });
    setShowAddBudgetDialog(false);
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Budget report has been exported as CSV",
    });
  };

  const handleEditDepartment = (id: number) => {
    const department = mockBudgetData.departments.find(d => d.id === id);

    if (!department) return;

    toast({
      title: "Edit Department Budget",
      description: `Opening budget editor for ${department.name}`,
    });
  };

  const handleDeleteDepartment = (id: number) => {
    const department = mockBudgetData.departments.find(d => d.id === id);

    if (!department) return;

    toast({
      title: "Delete Department Budget",
      description: `This would delete the budget for ${department.name}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your recruitment budget allocation and spending
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={showAddBudgetDialog} onOpenChange={setShowAddBudgetDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Allocate Budget</DialogTitle>
                <DialogDescription>
                  Allocate budget to a department or team with profit configuration
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newBudget.department}
                    onChange={(e) => setNewBudget({ ...newBudget, department: e.target.value })}
                    placeholder="Engineering"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Total Department Budget</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      value={newBudget.amount}
                      onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                      placeholder="50000"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="positions">Number of Positions</Label>
                  <Input
                    id="positions"
                    type="number"
                    value={newBudget.positions}
                    onChange={(e) => setNewBudget({ ...newBudget, positions: e.target.value })}
                    placeholder="3"
                  />
                </div>

                <div className="border-t pt-4 mt-2">
                  <h3 className="text-sm font-medium mb-3">Default Profit Configuration</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Set default profit configuration for positions in this department. These can be adjusted per position when creating job descriptions.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="defaultClientBudget">Default Client Budget ($/hr)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="defaultClientBudget"
                          type="number"
                          value={newBudget.defaultClientBudget}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewBudget({
                              ...newBudget,
                              defaultClientBudget: value,
                              // Auto-calculate internal budget as 70% of client budget if not set
                              defaultInternalBudget: newBudget.defaultInternalBudget ||
                                (value ? (parseFloat(value) * 0.7).toFixed(2) : '')
                            });
                          }}
                          placeholder="100"
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="defaultInternalBudget">Default Internal Budget ($/hr)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="defaultInternalBudget"
                          type="number"
                          value={newBudget.defaultInternalBudget}
                          onChange={(e) => setNewBudget({ ...newBudget, defaultInternalBudget: e.target.value })}
                          placeholder="70"
                          className="pl-8"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Visible to employees</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="defaultCandidateSplit">Default Candidate Split (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="defaultCandidateSplit"
                          type="number"
                          min="0"
                          max="100"
                          value={newBudget.defaultCandidateSplit}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setNewBudget({
                              ...newBudget,
                              defaultCandidateSplit: e.target.value,
                              defaultCompanySplit: !isNaN(value) && value >= 0 && value <= 100 ?
                                (100 - value).toString() : newBudget.defaultCompanySplit
                            });
                          }}
                          placeholder="80"
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="defaultCompanySplit">Default Company Split (%)</Label>
                      <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="defaultCompanySplit"
                          type="number"
                          min="0"
                          max="100"
                          value={newBudget.defaultCompanySplit}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setNewBudget({
                              ...newBudget,
                              defaultCompanySplit: e.target.value,
                              defaultCandidateSplit: !isNaN(value) && value >= 0 && value <= 100 ?
                                (100 - value).toString() : newBudget.defaultCandidateSplit
                            });
                          }}
                          placeholder="20"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profit Preview */}
                  {newBudget.defaultClientBudget && newBudget.defaultInternalBudget && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <h4 className="text-sm font-medium mb-2">Profit Preview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Client-to-Company Profit:</span>
                          <span className="font-medium text-green-600">
                            ${(parseFloat(newBudget.defaultClientBudget) - parseFloat(newBudget.defaultInternalBudget)).toFixed(2)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Company-to-Candidate Profit:</span>
                          <span className="font-medium text-green-600">
                            ${((parseFloat(newBudget.defaultInternalBudget) * parseInt(newBudget.defaultCompanySplit)) / 100).toFixed(2)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Profit:</span>
                          <span className="font-medium text-green-600">
                            ${(
                              (parseFloat(newBudget.defaultClientBudget) - parseFloat(newBudget.defaultInternalBudget)) +
                              ((parseFloat(newBudget.defaultInternalBudget) * parseInt(newBudget.defaultCompanySplit)) / 100)
                            ).toFixed(2)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profit Margin:</span>
                          <span className="font-medium text-green-600">
                            {(
                              ((parseFloat(newBudget.defaultClientBudget) - parseFloat(newBudget.defaultInternalBudget)) +
                              ((parseFloat(newBudget.defaultInternalBudget) * parseInt(newBudget.defaultCompanySplit)) / 100)) /
                              parseFloat(newBudget.defaultClientBudget) * 100
                            ).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddBudgetDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBudget}>
                  Allocate Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
                <span className="text-2xl font-bold">${mockBudgetData.totalBudget.toLocaleString()}</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Allocated</span>
                <span className="text-2xl font-bold">${mockBudgetData.allocated.toLocaleString()}</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Allocation Progress</span>
                <span className="text-xs font-medium">
                  {Math.round((mockBudgetData.allocated / mockBudgetData.totalBudget) * 100)}%
                </span>
              </div>
              <Progress
                value={(mockBudgetData.allocated / mockBudgetData.totalBudget) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Remaining</span>
                <span className="text-2xl font-bold">${mockBudgetData.remaining.toLocaleString()}</span>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Percent className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Remaining Budget</span>
                <span className="text-xs font-medium">
                  {Math.round((mockBudgetData.remaining / mockBudgetData.totalBudget) * 100)}%
                </span>
              </div>
              <Progress
                value={(mockBudgetData.remaining / mockBudgetData.totalBudget) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-[200px]">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{departmentFilter === 'all' ? 'All Departments' : departmentFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {mockBudgetData.departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[200px]">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {dateRange === 'year-to-date' ? 'Year to Date' :
                   dateRange === 'last-quarter' ? 'Last Quarter' :
                   dateRange === 'last-month' ? 'Last Month' : 'Custom Range'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="profit">Profit Tracking</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Budget allocation by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Department Allocation Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display the budget allocation across different departments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending</CardTitle>
                <CardDescription>Budget spent over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Monthly Spending Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display the monthly spending trends over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Budget allocation across different recruitment categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBudgetData.categories.map((category, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-sm">{category.name}</span>
                        <Badge className="ml-2 bg-muted text-muted-foreground">
                          {category.percentage}%
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">${category.amount.toLocaleString()}</span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Department Budgets</CardTitle>
                <CardDescription>Budget allocation and spending by department</CardDescription>
              </div>
              <Dialog open={showAddBudgetDialog} onOpenChange={setShowAddBudgetDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Department</th>
                      <th className="text-left py-3 px-4">Total Budget</th>
                      <th className="text-left py-3 px-4">Spent</th>
                      <th className="text-left py-3 px-4">Remaining</th>
                      <th className="text-left py-3 px-4">Positions</th>
                      <th className="text-left py-3 px-4">Hires</th>
                      <th className="text-left py-3 px-4">Utilization</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((dept) => (
                      <tr key={dept.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{dept.name}</td>
                        <td className="py-3 px-4">${dept.budget.toLocaleString()}</td>
                        <td className="py-3 px-4">${dept.spent.toLocaleString()}</td>
                        <td className="py-3 px-4">${dept.remaining.toLocaleString()}</td>
                        <td className="py-3 px-4">{dept.positions}</td>
                        <td className="py-3 px-4">{dept.hires}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Progress
                              value={(dept.spent / dept.budget) * 100}
                              className="h-2 w-24 mr-2"
                            />
                            <span>{Math.round((dept.spent / dept.budget) * 100)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditDepartment(dept.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Budget utilization across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Department Comparison Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would compare budget utilization across different departments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per Hire</CardTitle>
                <CardDescription>Average cost per hire by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDepartments.map((dept) => (
                    <div key={dept.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{dept.name}</span>
                        <span className="text-sm font-medium">
                          ${dept.hires > 0 ? Math.round(dept.spent / dept.hires).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <Progress
                        value={dept.hires > 0 ? (dept.hires / dept.positions) * 100 : 0}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {dept.hires} of {dept.positions} positions filled
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
              <CardDescription>Budget spent over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Monthly Spending Chart</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This chart would display the monthly spending trends over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Budget allocation across different recruitment categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Percentage</th>
                      <th className="text-left py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBudgetData.categories.map((category, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{category.name}</td>
                        <td className="py-3 px-4">${category.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">{category.percentage}%</td>
                        <td className="py-3 px-4">
                          <div className="w-24">
                            <Progress value={category.percentage} className="h-2" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-4">
          {/* Profit Overview Cards */}
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
                    <Users className="h-6 w-6 text-purple-600" />
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

          {/* Profit by Position */}
          <Card>
            <CardHeader>
              <CardTitle>Profit by Position</CardTitle>
              <CardDescription>Detailed profit breakdown for each open position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-left py-3 px-4">Department</th>
                      <th className="text-left py-3 px-4">Client Budget</th>
                      <th className="text-left py-3 px-4">Internal Budget</th>
                      <th className="text-left py-3 px-4">Client-to-Company</th>
                      <th className="text-left py-3 px-4">Company-to-Candidate</th>
                      <th className="text-left py-3 px-4">Total Profit</th>
                      <th className="text-left py-3 px-4">Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Senior Software Engineer</td>
                      <td className="py-3 px-4">Engineering</td>
                      <td className="py-3 px-4">$120/hr</td>
                      <td className="py-3 px-4">$85/hr</td>
                      <td className="py-3 px-4 text-green-600">$35/hr</td>
                      <td className="py-3 px-4 text-green-600">$17/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$52/hr</td>
                      <td className="py-3 px-4 font-medium">43.3%</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Data Scientist</td>
                      <td className="py-3 px-4">Data & Analytics</td>
                      <td className="py-3 px-4">$130/hr</td>
                      <td className="py-3 px-4">$90/hr</td>
                      <td className="py-3 px-4 text-green-600">$40/hr</td>
                      <td className="py-3 px-4 text-green-600">$22.5/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$62.5/hr</td>
                      <td className="py-3 px-4 font-medium">48.1%</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">UX/UI Designer</td>
                      <td className="py-3 px-4">Design</td>
                      <td className="py-3 px-4">$95/hr</td>
                      <td className="py-3 px-4">$70/hr</td>
                      <td className="py-3 px-4 text-green-600">$25/hr</td>
                      <td className="py-3 px-4 text-green-600">$10.5/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$35.5/hr</td>
                      <td className="py-3 px-4 font-medium">37.4%</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Project Manager</td>
                      <td className="py-3 px-4">Management</td>
                      <td className="py-3 px-4">$110/hr</td>
                      <td className="py-3 px-4">$80/hr</td>
                      <td className="py-3 px-4 text-green-600">$30/hr</td>
                      <td className="py-3 px-4 text-green-600">$16/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$46/hr</td>
                      <td className="py-3 px-4 font-medium">41.8%</td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Sales Representative</td>
                      <td className="py-3 px-4">Sales</td>
                      <td className="py-3 px-4">$85/hr</td>
                      <td className="py-3 px-4">$65/hr</td>
                      <td className="py-3 px-4 text-green-600">$20/hr</td>
                      <td className="py-3 px-4 text-green-600">$13/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$33/hr</td>
                      <td className="py-3 px-4 font-medium">38.8%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Profit by Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profit by Department</CardTitle>
                <CardDescription>Aggregated profit metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Department Profit Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display profit distribution across departments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Trends</CardTitle>
                <CardDescription>Monthly profit tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Monthly Profit Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display monthly profit trends over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recruiter Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Recruiter Performance</CardTitle>
              <CardDescription>Profit generation by recruiter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Recruiter</th>
                      <th className="text-left py-3 px-4">Positions Filled</th>
                      <th className="text-left py-3 px-4">Total Client Budget</th>
                      <th className="text-left py-3 px-4">Total Profit Generated</th>
                      <th className="text-left py-3 px-4">Avg. Profit Margin</th>
                      <th className="text-left py-3 px-4">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Jamie Garcia</td>
                      <td className="py-3 px-4">12</td>
                      <td className="py-3 px-4">$245,000</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$98,000</td>
                      <td className="py-3 px-4">40.0%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Progress value={85} className="h-2 w-24 mr-2" />
                          <span>Excellent</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Alex Wong</td>
                      <td className="py-3 px-4">8</td>
                      <td className="py-3 px-4">$180,000</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$72,000</td>
                      <td className="py-3 px-4">40.0%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Progress value={75} className="h-2 w-24 mr-2" />
                          <span>Good</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">Morgan Chen</td>
                      <td className="py-3 px-4">10</td>
                      <td className="py-3 px-4">$210,000</td>
                      <td className="py-3 px-4 text-green-600 font-medium">$84,000</td>
                      <td className="py-3 px-4">40.0%</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Progress value={80} className="h-2 w-24 mr-2" />
                          <span>Very Good</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Forecasting</CardTitle>
              <CardDescription>Projected spending and budget needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Budget Forecast Chart</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This chart would display projected spending based on current trends and hiring plans.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projected Hiring Costs</CardTitle>
                <CardDescription>Estimated costs for planned hires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDepartments.map((dept) => (
                    <div key={dept.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{dept.name}</span>
                        <span className="text-sm font-medium">
                          ${((dept.positions - dept.hires) * (dept.spent / Math.max(dept.hires, 1))).toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(dept.hires / dept.positions) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {dept.positions - dept.hires} positions remaining
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Recommendations</CardTitle>
                <CardDescription>Suggested budget adjustments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium mb-2">Engineering Department</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Based on current spending and hiring progress, consider allocating an additional $25,000 to meet hiring goals.
                    </p>
                    <Button size="sm">Adjust Budget</Button>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium mb-2">Sales Department</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Spending is below projections. Consider reallocating $10,000 to departments with higher hiring needs.
                    </p>
                    <Button size="sm">Adjust Budget</Button>
                  </div>

                  <div className="p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium mb-2">Overall Budget</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Current budget utilization is on track. No immediate adjustments needed.
                    </p>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetManagementPage;
