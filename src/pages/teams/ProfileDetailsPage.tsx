import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Award, 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock, 
  Star 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock profiles data
const mockProfiles = [
  {
    id: 'profile-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    role: 'Hiring Manager',
    department: 'Engineering',
    hireDate: '2022-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Technical Recruiting', 'Team Leadership', 'Budget Management'],
    bio: 'Experienced hiring manager with a background in software engineering. Specializes in building high-performing engineering teams and optimizing recruitment processes.',
    stats: {
      openRequisitions: 3,
      activeCandidates: 12,
      totalHires: 24
    },
    recentActivity: [
      { type: 'interview', date: '2023-06-01', description: 'Conducted final interview for Senior Developer position' },
      { type: 'hire', date: '2023-05-15', description: 'Hired Junior Developer for Frontend team' },
      { type: 'requisition', date: '2023-05-10', description: 'Created new job requisition for DevOps Engineer' },
      { type: 'feedback', date: '2023-05-05', description: 'Provided feedback on UX Designer candidates' },
    ]
  },
  {
    id: 'profile-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '(555) 234-5678',
    role: 'Talent Scout',
    department: 'Recruitment',
    hireDate: '2022-05-20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Technical Screening', 'Candidate Sourcing', 'ATS Management'],
    bio: 'Dedicated talent scout with expertise in identifying and recruiting top technical talent. Strong network in the software development community.',
    stats: {
      openRequisitions: 5,
      activeCandidates: 28,
      totalHires: 32
    },
    recentActivity: [
      { type: 'screening', date: '2023-06-02', description: 'Screened 5 candidates for Data Scientist position' },
      { type: 'sourcing', date: '2023-05-28', description: 'Sourced 15 potential candidates for Senior Engineer role' },
      { type: 'interview', date: '2023-05-20', description: 'Conducted initial interviews for Product Manager' },
      { type: 'feedback', date: '2023-05-15', description: 'Provided feedback on Backend Developer candidates' },
    ]
  },
  {
    id: 'profile-3',
    name: 'Michael Torres',
    email: 'michael.torres@example.com',
    phone: '(555) 345-6789',
    role: 'Team Member',
    department: 'Product',
    hireDate: '2022-08-10',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Product Management', 'User Research', 'Agile Methodologies'],
    bio: 'Product team member with a focus on user-centered design and agile development practices. Experienced in conducting user research and translating insights into product features.',
    stats: {
      openRequisitions: 0,
      activeCandidates: 3,
      totalHires: 5
    },
    recentActivity: [
      { type: 'interview', date: '2023-06-03', description: 'Participated in panel interview for UX Designer' },
      { type: 'feedback', date: '2023-05-25', description: 'Provided feedback on Product Manager candidates' },
      { type: 'interview', date: '2023-05-18', description: 'Conducted technical interview for UI Developer' },
      { type: 'meeting', date: '2023-05-10', description: 'Attended hiring strategy meeting for Q3' },
    ]
  },
];

// Mock candidates assigned to this profile
const mockAssignedCandidates = [
  {
    id: 'candidate-1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    status: 'interview',
    appliedDate: '2023-05-15',
    nextStep: 'Technical Interview',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'candidate-2',
    name: 'Taylor Smith',
    position: 'Product Manager',
    status: 'screening',
    appliedDate: '2023-05-20',
    nextStep: 'Initial Interview',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'candidate-3',
    name: 'Casey Wilson',
    position: 'UX Designer',
    status: 'offer',
    appliedDate: '2023-05-10',
    nextStep: 'Offer Approval',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Status configuration for candidates
const statusConfig = {
  screening: { label: 'Screening', color: 'bg-amber-100 text-amber-800' },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800' },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

const ProfileDetailsPage = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, fetch profile data from API
    const foundProfile = mockProfiles.find(p => p.id === profileId);
    
    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      toast({
        title: "Profile Not Found",
        description: "The requested profile could not be found",
        variant: "destructive",
      });
    }
  }, [profileId]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading profile details...</p>
      </div>
    );
  }

  const handleContactProfile = () => {
    toast({
      title: "Contact Profile",
      description: `Sending message to ${profile.name}`,
    });
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: `Opening edit form for ${profile.name}`,
    });
  };

  const handleViewCandidate = (id) => {
    toast({
      title: "View Candidate",
      description: `Viewing candidate profile for ID: ${id}`,
    });
  };

  const handleCandidateAction = (id) => {
    const candidate = mockAssignedCandidates.find(c => c.id === id);
    
    if (!candidate) return;
    
    const actionText = candidate.status === 'screening' ? 'Schedule Interview' :
                       candidate.status === 'interview' ? 'Send Offer' :
                       candidate.status === 'offer' ? 'Mark as Hired' : 'Next Step';
    
    toast({
      title: actionText,
      description: `Moving ${candidate.name} to the next step`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/profiles">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground mt-1">
              {profile.role} • {profile.department}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleContactProfile}>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button onClick={handleEditProfile}>
            <FileText className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Assigned Candidates</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Contact details and basic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Hired on {new Date(profile.hireDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>Professional skills and competencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Professional Bio</h4>
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruitment Stats</CardTitle>
                <CardDescription>Current recruitment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span>Open Requisitions</span>
                    </div>
                    <span className="font-medium">{profile.stats.openRequisitions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>Active Candidates</span>
                    </div>
                    <span className="font-medium">{profile.stats.activeCandidates}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      <span>Total Hires</span>
                    </div>
                    <span className="font-medium">{profile.stats.totalHires}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Candidates</CardTitle>
                <CardDescription>Candidates currently assigned to {profile.name}</CardDescription>
              </div>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Assign New Candidate
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Candidate</th>
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Applied Date</th>
                      <th className="text-left py-3 px-4">Next Step</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAssignedCandidates.map((candidate) => (
                      <tr key={candidate.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={candidate.avatar} alt={candidate.name} />
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{candidate.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{candidate.position}</td>
                        <td className="py-3 px-4">
                          <Badge className={statusConfig[candidate.status].color}>
                            {statusConfig[candidate.status].label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{new Date(candidate.appliedDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{candidate.nextStep}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCandidate(candidate.id)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleCandidateAction(candidate.id)}
                            >
                              Next Step
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
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest recruitment activities and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.recentActivity.map((activity, i) => (
                  <div key={i} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {activity.type === 'interview' && <Users className="h-5 w-5 text-primary" />}
                        {activity.type === 'hire' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {activity.type === 'requisition' && <FileText className="h-5 w-5 text-primary" />}
                        {activity.type === 'feedback' && <Star className="h-5 w-5 text-amber-500" />}
                        {activity.type === 'screening' && <Briefcase className="h-5 w-5 text-primary" />}
                        {activity.type === 'sourcing' && <Users className="h-5 w-5 text-primary" />}
                        {activity.type === 'meeting' && <Clock className="h-5 w-5 text-primary" />}
                      </div>
                      {i < profile.recentActivity.length - 1 && (
                        <div className="h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="flex items-baseline justify-between">
                        <p className="font-medium">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </p>
                        <Badge variant="outline">
                          {new Date(activity.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Recruitment performance and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Time to Hire</span>
                    <span className="text-sm font-medium">25 days</span>
                  </div>
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Average time from requisition to hire (25% faster than team average)
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Candidate Quality</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of candidates advancing to interview stage
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Offer Acceptance Rate</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of offers accepted by candidates
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of hires still with company after 1 year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hiring Goals</CardTitle>
              <CardDescription>Progress toward recruitment targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium mb-2">Performance Charts</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This section would display charts showing performance metrics over time, 
                    including hiring goals, time-to-hire trends, and candidate quality metrics.
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

export default ProfileDetailsPage;
