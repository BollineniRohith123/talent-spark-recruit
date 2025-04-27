import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  Calendar, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Clock, 
  Star, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock team data
const mockTeams = [
  {
    id: 1,
    name: "Engineering Team",
    members: 12,
    openPositions: 3,
    activeScreenings: 5,
    description: "Our engineering team is responsible for building and maintaining our core product infrastructure and features.",
    budget: 150000,
    budgetSpent: 95000,
    hiringGoal: 5,
    hiringProgress: 2,
    department: "Technology",
    location: "Remote",
    leadName: "Alex Johnson",
    leadEmail: "alex.johnson@example.com",
    leadPhone: "(555) 123-4567",
    leadAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Data Science Team",
    members: 8,
    openPositions: 2,
    activeScreenings: 3,
    description: "Our data science team focuses on building machine learning models and data analytics solutions for our clients.",
    budget: 120000,
    budgetSpent: 65000,
    hiringGoal: 3,
    hiringProgress: 1,
    department: "Technology",
    location: "Hybrid",
    leadName: "Sarah Chen",
    leadEmail: "sarah.chen@example.com",
    leadPhone: "(555) 234-5678",
    leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Product Team",
    members: 6,
    openPositions: 1,
    activeScreenings: 2,
    description: "Our product team is responsible for product strategy, roadmap planning, and feature prioritization.",
    budget: 90000,
    budgetSpent: 45000,
    hiringGoal: 2,
    hiringProgress: 1,
    department: "Product",
    location: "On-site",
    leadName: "Michael Torres",
    leadEmail: "michael.torres@example.com",
    leadPhone: "(555) 345-6789",
    leadAvatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

// Mock team members
const mockTeamMembers = [
  {
    id: 1,
    name: "Jordan Lee",
    role: "Senior Software Engineer",
    email: "jordan.lee@example.com",
    phone: "(555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    hireDate: "2023-01-15",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    status: "active",
  },
  {
    id: 2,
    name: "Taylor Smith",
    role: "Frontend Developer",
    email: "taylor.smith@example.com",
    phone: "(555) 876-5432",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    hireDate: "2023-03-10",
    skills: ["React", "CSS", "JavaScript", "UI/UX"],
    status: "active",
  },
  {
    id: 3,
    name: "Casey Wilson",
    role: "Backend Developer",
    email: "casey.wilson@example.com",
    phone: "(555) 765-4321",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    hireDate: "2023-02-22",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    status: "active",
  },
  {
    id: 4,
    name: "Morgan Davis",
    role: "DevOps Engineer",
    email: "morgan.davis@example.com",
    phone: "(555) 654-3210",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    hireDate: "2023-04-05",
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
    status: "active",
  },
];

// Mock open positions
const mockOpenPositions = [
  {
    id: 1,
    title: "Senior Backend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "active",
    applicants: 24,
    interviews: 5,
    postedDate: "2023-05-15",
  },
  {
    id: 2,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "active",
    applicants: 18,
    interviews: 3,
    postedDate: "2023-05-20",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    status: "active",
    applicants: 12,
    interviews: 2,
    postedDate: "2023-05-25",
  },
];

const TeamDetailsPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, fetch team data from API
    const id = parseInt(teamId);
    const foundTeam = mockTeams.find(t => t.id === id);
    
    if (foundTeam) {
      setTeam(foundTeam);
    } else {
      toast({
        title: "Team Not Found",
        description: "The requested team could not be found",
        variant: "destructive",
      });
    }
  }, [teamId]);

  if (!team) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading team details...</p>
      </div>
    );
  }

  const budgetPercentage = Math.round((team.budgetSpent / team.budget) * 100);
  const hiringPercentage = Math.round((team.hiringProgress / team.hiringGoal) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/teams">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground mt-1">
              {team.department} • {team.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Contact Team
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Lead</CardTitle>
                <CardDescription>Primary contact for this team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={team.leadAvatar} alt={team.leadName} />
                    <AvatarFallback>{team.leadName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{team.leadName}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1" />
                        <span>{team.leadEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        <span>{team.leadPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Stats</CardTitle>
                <CardDescription>Current team composition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>Total Members</span>
                    </div>
                    <span className="font-medium">{team.members}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span>Open Positions</span>
                    </div>
                    <span className="font-medium">{team.openPositions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-primary" />
                      <span>Active Screenings</span>
                    </div>
                    <span className="font-medium">{team.activeScreenings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hiring Progress</CardTitle>
                <CardDescription>Progress toward hiring goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Budget Utilization</span>
                      <span className="text-sm font-medium">{budgetPercentage}%</span>
                    </div>
                    <Progress value={budgetPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      ${team.budgetSpent.toLocaleString()} of ${team.budget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Hiring Goal</span>
                      <span className="text-sm font-medium">{hiringPercentage}%</span>
                    </div>
                    <Progress value={hiringPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {team.hiringProgress} of {team.hiringGoal} positions filled
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Description</CardTitle>
              <CardDescription>About this team and its responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{team.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Current members of {team.name}</CardDescription>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Hire Date</th>
                      <th className="text-left py-3 px-4">Skills</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTeamMembers.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{member.role}</td>
                        <td className="py-3 px-4">{member.email}</td>
                        <td className="py-3 px-4">{new Date(member.hireDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 2).map((skill, i) => (
                              <Badge key={i} variant="outline" className="bg-muted">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 2 && (
                              <Badge variant="outline" className="bg-muted">
                                +{member.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>Current job openings for {team.name}</CardDescription>
              </div>
              <Button>
                <Briefcase className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-left py-3 px-4">Department</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Applicants</th>
                      <th className="text-left py-3 px-4">Posted Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOpenPositions.map((position) => (
                      <tr key={position.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{position.title}</td>
                        <td className="py-3 px-4">{position.department}</td>
                        <td className="py-3 px-4">{position.location}</td>
                        <td className="py-3 px-4">{position.type}</td>
                        <td className="py-3 px-4">
                          {position.applicants} <span className="text-muted-foreground">({position.interviews} interviewed)</span>
                        </td>
                        <td className="py-3 px-4">{new Date(position.postedDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Current budget allocation and spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Total Budget</span>
                      <span className="text-sm font-medium">${team.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Spent</span>
                      <span className="text-sm font-medium">${team.budgetSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Remaining</span>
                      <span className="text-sm font-medium">${(team.budget - team.budgetSpent).toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Budget Utilization</span>
                      <span className="text-sm font-medium">{budgetPercentage}%</span>
                    </div>
                    <Progress value={budgetPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription>How the budget is being allocated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center border rounded-md">
                  <div className="text-center p-6">
                    <h3 className="text-lg font-medium mb-2">Budget Allocation Chart</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This chart would display the budget breakdown by category (salaries, tools, training, etc.)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget History</CardTitle>
              <CardDescription>Monthly budget allocation and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium mb-2">Budget History Chart</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This chart would display the budget history over time, showing allocation and spending trends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamDetailsPage;
