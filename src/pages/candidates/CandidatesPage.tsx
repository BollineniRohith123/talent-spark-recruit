
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Briefcase, UserCheck, ArrowUpDown, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CandidateCard, Candidate, CandidateStatus } from '@/components/ui/candidate-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

// Mock candidates data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    status: 'screening',
    matchScore: 92,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'JavaScript'],
    status: 'interview',
    matchScore: 87,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    status: 'offer',
    matchScore: 95,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Jesse Patel',
    position: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    status: 'hired',
    matchScore: 89,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '5',
    name: 'Casey Wilson',
    position: 'UX Designer',
    skills: ['Figma', 'User Research', 'UI Design'],
    status: 'screening',
    matchScore: 83,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '6',
    name: 'Robin Taylor',
    position: 'Product Manager',
    skills: ['Agile', 'Roadmapping', 'User Stories'],
    status: 'interview',
    matchScore: 91,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '7',
    name: 'Alex Johnson',
    position: 'Backend Developer',
    skills: ['Java', 'Spring', 'Microservices'],
    status: 'rejected',
    matchScore: 72,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '8',
    name: 'Jamie Garcia',
    position: 'Mobile Developer',
    skills: ['Swift', 'React Native', 'Kotlin'],
    status: 'offer',
    matchScore: 88,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
];

// Track time in pipeline for each candidate
const candidateTimes: Record<string, string> = {
  '1': '5 days',
  '2': '12 days',
  '3': '18 days',
  '4': '21 days',
  '5': '3 days',
  '6': '14 days',
  '7': '8 days',
  '8': '16 days'
};

// Candidate profiles are separate from employee profiles
// This was a misunderstanding - candidates are job applicants, not company employees

const CandidatesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'match' | 'name'>('match');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter and sort candidates
  const filteredCandidates = mockCandidates
    .filter(candidate => {
      // Filter by search term
      if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (statusFilter !== 'all' && candidate.status !== statusFilter) {
        return false;
      }

      // Filter by position
      if (positionFilter !== 'all' && candidate.position !== positionFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by match score (descending)
      if (sortOrder === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }

      // Sort by name (ascending)
      return a.name.localeCompare(b.name);
    });

  // Get unique positions for filter
  const positions = ['all', ...new Set(mockCandidates.map(c => c.position))];

  // Handle actions
  const handleViewCandidate = (id: string) => {
    navigate(`/candidates/${id}`);
  };

  const handleCandidateAction = (id: string) => {
    const candidate = mockCandidates.find(c => c.id === id);

    if (!candidate) return;

    const actionText = candidate.status === 'screening' ? 'Schedule Interview' :
                       candidate.status === 'interview' ? 'Send Offer' :
                       candidate.status === 'offer' ? 'Mark as Hired' : 'Next Step';

    toast({
      title: actionText,
      description: `Moving ${candidate.name} to the next step`,
    });
  };

  const statusOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="text-muted-foreground mt-2">
          Manage, track, and evaluate candidates throughout the hiring process
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-recruit-info/30 p-2 rounded-full mb-3">
                <UserCheck className="h-5 w-5 text-recruit-secondary" />
              </div>
              <div className="text-2xl font-bold">{mockCandidates.length}</div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 p-2 rounded-full mb-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold">
                {mockCandidates.filter(c => c.status === 'screening').length}
              </div>
              <p className="text-sm text-muted-foreground">In Screening</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">
                {mockCandidates.filter(c => c.status === 'interview').length}
              </div>
              <p className="text-sm text-muted-foreground">In Interview</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-2 rounded-full mb-3">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {mockCandidates.filter(c => c.status === 'hired').length}
              </div>
              <p className="text-sm text-muted-foreground">Hired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="relative sm:col-span-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-3">
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

        <div className="sm:col-span-2 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
                <span className="sr-only">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('match')}>
                Sort by Match Score
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('name')}>
                Sort by Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="px-2"
          >
            <i className="grid text-xs font-bold">⊞</i>
          </Button>

          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="px-2"
          >
            <i className="list text-xs font-bold">≡</i>
          </Button>
        </div>
      </div>

      {/* Candidates Display */}
      {filteredCandidates.length === 0 ? (
        <Card className="py-16">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">No candidates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find candidates
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onView={handleViewCandidate}
              onAction={handleCandidateAction}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium">Position</th>
                    <th className="text-left py-3 px-4 font-medium">Skills</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Match</th>
                    <th className="text-left py-3 px-4 font-medium">Time in Pipeline</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={candidate.avatar}
                              alt={candidate.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{candidate.position}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-accent/50">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="outline" className="bg-accent/50">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          candidate.status === 'screening' ? 'bg-amber-100 text-amber-800' :
                          candidate.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          candidate.status === 'offer' ? 'bg-purple-100 text-purple-800' :
                          candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="font-medium">{candidate.matchScore ? `${candidate.matchScore}%` : '-'}</span>
                          {candidate.matchScore && (
                            <div className="w-16 ml-2">
                              <Progress value={candidate.matchScore} className="h-2" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {candidateTimes[candidate.id]}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Quick View",
                                description: `Showing summary for ${candidate.name}`,
                              });
                            }}
                          >
                            Quick View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewCandidate(candidate.id)}
                          >
                            View Details
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
      )}
    </div>
  );
};

export default CandidatesPage;
