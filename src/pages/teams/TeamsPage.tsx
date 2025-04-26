
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UsersIcon, PlusCircle, UserPlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock team data
const mockTeams = [
  {
    id: '1',
    name: 'Engineering Team',
    description: 'Software development and engineering',
    members: [
      { id: '101', name: 'Alex Johnson', role: 'Hiring Manager', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { id: '102', name: 'Morgan Smith', role: 'Talent Scout', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { id: '103', name: 'Jamie Garcia', role: 'Team Member', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    ],
    openPositions: 3,
    activeCandidates: 12,
  },
  {
    id: '2',
    name: 'Design Team',
    description: 'UI/UX design and research',
    members: [
      { id: '201', name: 'Robin Taylor', role: 'Hiring Manager', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { id: '202', name: 'Casey Wilson', role: 'Talent Scout', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    ],
    openPositions: 2,
    activeCandidates: 8,
  },
  {
    id: '3',
    name: 'Data Science Team',
    description: 'Data analysis and machine learning',
    members: [
      { id: '301', name: 'Jordan Lee', role: 'Hiring Manager', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { id: '302', name: 'Taylor Smith', role: 'Talent Scout', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { id: '303', name: 'Morgan Chen', role: 'Team Member', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
      { id: '304', name: 'Alex Wong', role: 'Team Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    ],
    openPositions: 1,
    activeCandidates: 5,
  },
];

const TeamsPage = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState(mockTeams);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [newMember, setNewMember] = useState({ name: '', role: 'team-member' as 'team-member' | 'talent-scout' | 'hiring-manager' });
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);

  const handleAddTeam = () => {
    if (!newTeam.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    const newTeamEntry = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      description: newTeam.description || 'No description provided',
      members: [],
      openPositions: 0,
      activeCandidates: 0,
    };

    setTeams([...teams, newTeamEntry]);
    setNewTeam({ name: '', description: '' });
    setShowAddTeamDialog(false);
    
    toast({
      title: "Team Added",
      description: `${newTeam.name} has been created successfully.`,
    });
  };

  const handleAddMember = () => {
    if (!newMember.name.trim() || !selectedTeam) {
      toast({
        title: "Missing Information",
        description: "Please enter member name and select a team",
        variant: "destructive",
      });
      return;
    }

    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam) {
        return {
          ...team,
          members: [...team.members, {
            id: `member-${Date.now()}`,
            name: newMember.name,
            role: newMember.role === 'hiring-manager' ? 'Hiring Manager' : 
                  newMember.role === 'talent-scout' ? 'Talent Scout' : 'Team Member',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          }]
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setNewMember({ name: '', role: 'team-member' });
    setShowAddMemberDialog(false);
    
    toast({
      title: "Member Added",
      description: `${newMember.name} has been added to the team.`,
    });
  };

  const handleRemoveTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    
    toast({
      title: "Team Removed",
      description: "The team has been removed successfully.",
    });
  };

  // Only Company Admin can add teams
  const canAddTeam = user?.role === 'company-admin';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's teams and members
          </p>
        </div>

        {canAddTeam && (
          <Dialog open={showAddTeamDialog} onOpenChange={setShowAddTeamDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Add a new team to your organization. Teams help organize your hiring process.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="team-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="team-name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Engineering Team"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="team-description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="team-description"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Team description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddTeamDialog(false)}>Cancel</Button>
                <Button onClick={handleAddTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-bold">{team.name}</CardTitle>
              {canAddTeam && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedTeam(team.id);
                        setShowAddMemberDialog(true);
                      }}
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Add Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleRemoveTeam(team.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{team.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-sm text-muted-foreground">{team.members.length} Members</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{team.openPositions}</span> open positions
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Team Members</h4>
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to the selected team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="member-name" className="text-right">
                Name
              </Label>
              <Input
                id="member-name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="member-role" className="text-right">
                Role
              </Label>
              <Select
                value={newMember.role}
                onValueChange={(value: 'team-member' | 'talent-scout' | 'hiring-manager') => 
                  setNewMember({ ...newMember, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiring-manager">Hiring Manager</SelectItem>
                  <SelectItem value="talent-scout">Talent Scout</SelectItem>
                  <SelectItem value="team-member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsPage;
