
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';

const TeamsPage = () => {
  const navigate = useNavigate();
  const teams = [
    {
      id: 1,
      name: "Engineering Team",
      members: 12,
      openPositions: 3,
      activeScreenings: 5,
    },
    {
      id: 2,
      name: "Data Science Team",
      members: 8,
      openPositions: 2,
      activeScreenings: 3,
    },
    {
      id: 3,
      name: "Product Team",
      members: 6,
      openPositions: 1,
      activeScreenings: 2,
    },
  ];

  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const handleAddTeam = () => {
    toast({
      title: "Add Team",
      description: "This functionality will be implemented soon.",
    });
  };

  const handleTeamSettings = (teamId, e) => {
    e.stopPropagation();
    toast({
      title: "Team Settings",
      description: `Opening settings for team ID: ${teamId}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your organization's teams and their recruitment processes
          </p>
        </div>
        <Button
          className="bg-recruit-primary hover:bg-recruit-primary/90"
          onClick={handleAddTeam}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add New Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {team.name}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleTeamSettings(team.id, e)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Actively recruiting for {team.openPositions} positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{team.members} Members</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-2" />
                    <span>{team.activeScreenings} Active Screenings</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewTeam(team.id)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
