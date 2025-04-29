
import { useState } from 'react';
import { Search, Filter, Play, FileCheck, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock screenings data
const mockScreenings = [
  {
    id: '1',
    candidate: 'Jordan Lee',
    position: 'Senior Software Engineer',
    status: 'pending',
    created: '2025-04-22T14:30:00',
    email: 'jordan.lee@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    candidate: 'Taylor Smith',
    position: 'Frontend Developer',
    status: 'scheduled',
    created: '2025-04-23T10:15:00',
    email: 'taylor.smith@example.com',
    scheduledFor: '2025-04-27T11:00:00',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    candidate: 'Morgan Chen',
    position: 'Data Scientist',
    status: 'completed',
    created: '2025-04-20T09:45:00',
    completedAt: '2025-04-21T15:30:00',
    score: 87,
    email: 'morgan.chen@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    candidate: 'Casey Wilson',
    position: 'UX Designer',
    status: 'completed',
    created: '2025-04-18T14:20:00',
    completedAt: '2025-04-19T11:10:00',
    score: 92,
    email: 'casey.wilson@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

/**
 * ScreeningsPage - Manages candidate screening processes
 * Admin users have full access to all screenings across the organization
 * and can initiate, reschedule, or view results for any candidate
 */
const ScreeningsPage = () => {
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');

  // Filter screenings based on tab, search term and position
  const filterScreenings = () => {
    return mockScreenings.filter(screening => {
      // Filter by tab (status)
      if (activeTab !== 'all' && screening.status !== activeTab) return false;

      // Filter by search term
      if (searchTerm && !screening.candidate.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // Filter by position
      if (positionFilter !== 'all' && screening.position !== positionFilter) return false;

      return true;
    });
  };

  // Get unique positions for filter
  const positions = ['all', ...new Set(mockScreenings.map(s => s.position))];

  // Handle actions - Admin can always send screenings for any candidate
  const handleSendScreening = (id: string, email: string) => {
    // Admin users can bypass any workflow restrictions here
    toast({
      title: "Screening Link Sent",
      description: `Screening link sent to ${email}`,
    });
  };

  const handleViewResults = (id: string) => {
    toast({
      title: "View Results",
      description: `Viewing screening results for ID: ${id}`,
    });
  };

  const handleReschedule = (id: string) => {
    toast({
      title: "Reschedule Screening",
      description: `Rescheduling screening for ID: ${id}`,
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><FileCheck className="h-3 w-3 mr-1" /> Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get action button based on status
  const getActionButton = (screening: any) => {
    switch (screening.status) {
      case 'pending':
        return (
          <Button
            size="sm"
            onClick={() => handleSendScreening(screening.id, screening.email)}
          >
            <Play className="h-3 w-3 mr-1" /> Send Link
          </Button>
        );
      case 'scheduled':
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleReschedule(screening.id)}
          >
            <Clock className="h-3 w-3 mr-1" /> Reschedule
          </Button>
        );
      case 'completed':
        return (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleViewResults(screening.id)}
          >
            <BarChart3 className="h-3 w-3 mr-1" /> View Results
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredScreenings = filterScreenings();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Screenings</h1>
        <p className="text-muted-foreground mt-2">
          Manage AI screenings for candidates
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 flex-shrink-0">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.filter(p => p !== 'all').map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Screenings List */}
      <Card>
        <CardHeader>
          <CardTitle>SmartMatch Screenings</CardTitle>
          <CardDescription>Manage voice-based candidate screenings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {filteredScreenings.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No screenings found for the current filters
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Candidate</th>
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Details</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScreenings.map((screening) => (
                      <tr key={screening.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                              <img
                                src={screening.avatarUrl}
                                alt={screening.candidate}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{screening.candidate}</p>
                              <p className="text-xs text-muted-foreground">{screening.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{screening.position}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(screening.status)}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(screening.created).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {screening.status === 'scheduled' && (
                            <p className="text-xs">
                              Scheduled for:{' '}
                              <span className="font-medium">
                                {new Date(screening.scheduledFor).toLocaleDateString()}
                              </span>
                            </p>
                          )}
                          {screening.status === 'completed' && (
                            <p className="text-xs">
                              Score:{' '}
                              <span className="font-medium">{screening.score}%</span>
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {getActionButton(screening)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How SmartMatch Screening Works</CardTitle>
          <CardDescription>Understanding the voice-based screening process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Step 1: Initiate Screening</h3>
              <p className="text-sm text-muted-foreground">
                Send a screening link to candidates via email or WhatsApp. They can complete it on their own time.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Step 2: SmartMatch Analysis</h3>
              <p className="text-sm text-muted-foreground">
                TalentPulse analyzes responses for technical accuracy, communication skills, and problem-solving ability.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Step 3: Review Results</h3>
              <p className="text-sm text-muted-foreground">
                Review AI-generated feedback and scores to make informed decisions about advancing candidates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreeningsPage;
