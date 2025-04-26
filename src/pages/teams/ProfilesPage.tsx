
import { useState } from 'react';
import { Search, UserPlus, Filter, MoreHorizontal, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

// Mock employee profile data
const mockProfiles = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@recruitai.com',
    phone: '(555) 123-4567',
    role: 'Hiring Manager',
    department: 'Engineering',
    hireDate: '2022-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Technical Recruiting', 'Team Leadership', 'Budget Management'],
    stats: {
      openRequisitions: 5,
      activeCandidates: 18,
      totalHires: 12
    }
  },
  {
    id: '2',
    name: 'Morgan Smith',
    email: 'morgan.smith@recruitai.com',
    phone: '(555) 234-5678',
    role: 'Talent Scout',
    department: 'Recruiting',
    hireDate: '2023-01-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Candidate Sourcing', 'Resume Screening', 'Interview Coordination'],
    stats: {
      openRequisitions: 8,
      activeCandidates: 32,
      totalHires: 24
    }
  },
  {
    id: '3',
    name: 'Jamie Garcia',
    email: 'jamie.garcia@recruitai.com',
    phone: '(555) 345-6789',
    role: 'Team Member',
    department: 'Engineering',
    hireDate: '2022-08-05',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Software Development', 'Technical Assessment', 'Mentoring'],
    stats: {
      openRequisitions: 2,
      activeCandidates: 7,
      totalHires: 5
    }
  },
  {
    id: '4',
    name: 'Robin Taylor',
    email: 'robin.taylor@recruitai.com',
    phone: '(555) 456-7890',
    role: 'Company Admin',
    department: 'Executive',
    hireDate: '2021-06-20',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Strategic Planning', 'Team Management', 'Process Optimization'],
    stats: {
      openRequisitions: 12,
      activeCandidates: 45,
      totalHires: 38
    }
  },
  {
    id: '5',
    name: 'Casey Wilson',
    email: 'casey.wilson@recruitai.com',
    phone: '(555) 567-8901',
    role: 'Talent Scout',
    department: 'Recruiting',
    hireDate: '2023-04-12',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Candidate Sourcing', 'Social Recruiting', 'Diversity Hiring'],
    stats: {
      openRequisitions: 6,
      activeCandidates: 28,
      totalHires: 19
    }
  },
  {
    id: '6',
    name: 'Jordan Lee',
    email: 'jordan.lee@recruitai.com',
    phone: '(555) 678-9012',
    role: 'Hiring Manager',
    department: 'Design',
    hireDate: '2022-11-08',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['UX/UI Assessment', 'Team Building', 'Budget Planning'],
    stats: {
      openRequisitions: 3,
      activeCandidates: 14,
      totalHires: 9
    }
  },
];

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddProfileDialog, setShowAddProfileDialog] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'team-member',
    department: '',
  });
  const [activeTab, setActiveTab] = useState('grid');

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          profile.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
                         profile.role.toLowerCase() === roleFilter.toLowerCase();
    
    const matchesDepartment = departmentFilter === 'all' || 
                               profile.department.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const departments = Array.from(new Set(profiles.map(p => p.department)));
  const roles = Array.from(new Set(profiles.map(p => p.role)));

  const handleAddProfile = () => {
    if (!newProfile.name.trim() || !newProfile.email.trim() || !newProfile.department.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newProfileEntry = {
      id: `profile-${Date.now()}`,
      name: newProfile.name,
      email: newProfile.email,
      phone: newProfile.phone || '(555) 000-0000',
      role: newProfile.role === 'hiring-manager' ? 'Hiring Manager' : 
            newProfile.role === 'talent-scout' ? 'Talent Scout' : 
            newProfile.role === 'company-admin' ? 'Company Admin' : 'Team Member',
      department: newProfile.department,
      hireDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      skills: [],
      stats: {
        openRequisitions: 0,
        activeCandidates: 0,
        totalHires: 0
      }
    };

    setProfiles([...profiles, newProfileEntry]);
    setNewProfile({
      name: '',
      email: '',
      phone: '',
      role: 'team-member',
      department: '',
    });
    setShowAddProfileDialog(false);
    
    toast({
      title: "Profile Added",
      description: `${newProfile.name} has been added successfully.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Profiles</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's team members and their roles
          </p>
        </div>

        <Dialog open={showAddProfileDialog} onOpenChange={setShowAddProfileDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newProfile.email}
                  onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={newProfile.phone}
                  onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newProfile.role}
                  onValueChange={(value: string) => 
                    setNewProfile({ ...newProfile, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company-admin">Company Admin</SelectItem>
                    <SelectItem value="hiring-manager">Hiring Manager</SelectItem>
                    <SelectItem value="talent-scout">Talent Scout</SelectItem>
                    <SelectItem value="team-member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newProfile.department}
                  onChange={(e) => setNewProfile({ ...newProfile, department: e.target.value })}
                  placeholder="Engineering"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddProfileDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProfile}>
                Add Team Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-[180px]">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>{roleFilter === 'all' ? 'All Roles' : roleFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role.toLowerCase()}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-[180px]">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>{departmentFilter === 'all' ? 'All Departments' : departmentFilter}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept.toLowerCase()}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="grid" className="px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {activeTab === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <CardDescription>{profile.role}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => 
                      toast({
                        title: "View Profile",
                        description: `Viewing profile for ${profile.name}`,
                      })
                    }>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => 
                      toast({
                        title: "Edit Profile",
                        description: `Editing profile for ${profile.name}`,
                      })
                    }>
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => 
                      toast({
                        title: "Email Sent",
                        description: `Email drafted to ${profile.name}`,
                      })
                    }>
                      Send Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Joined {new Date(profile.hireDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="text-center p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Requisitions</p>
                      <p className="font-medium">{profile.stats.openRequisitions}</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Candidates</p>
                      <p className="font-medium">{profile.stats.activeCandidates}</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Hires</p>
                      <p className="font-medium">{profile.stats.totalHires}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <div className="grid grid-cols-6 p-4 text-sm font-medium border-b bg-muted/50">
                <div className="col-span-2">Name</div>
                <div className="col-span-1">Role</div>
                <div className="col-span-1">Department</div>
                <div className="col-span-1">Hire Date</div>
                <div className="col-span-1">Actions</div>
              </div>
              <div className="divide-y">
                {filteredProfiles.map((profile) => (
                  <div key={profile.id} className="grid grid-cols-6 items-center p-4 text-sm">
                    <div className="col-span-2 flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                    <div className="col-span-1">{profile.role}</div>
                    <div className="col-span-1">{profile.department}</div>
                    <div className="col-span-1">{new Date(profile.hireDate).toLocaleDateString()}</div>
                    <div className="col-span-1 flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => 
                          toast({
                            title: "View Profile",
                            description: `Viewing profile for ${profile.name}`,
                          })
                        }
                      >
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => 
                            toast({
                              title: "Edit Profile",
                              description: `Editing profile for ${profile.name}`,
                            })
                          }>
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => 
                            toast({
                              title: "Email Sent",
                              description: `Email drafted to ${profile.name}`,
                            })
                          }>
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilesPage;
