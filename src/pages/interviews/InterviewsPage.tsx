
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, User, FileText, Plus, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock interview data
const mockInterviews = [
  {
    id: '1',
    candidate: 'Jordan Lee',
    position: 'Senior Software Engineer',
    date: '2025-04-27T14:00:00',
    status: 'scheduled',
    type: 'technical',
    interviewers: ['Robin Taylor', 'Alex Johnson'],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    candidate: 'Taylor Smith',
    position: 'Frontend Developer',
    date: '2025-04-28T11:30:00',
    status: 'scheduled',
    type: 'behavioral',
    interviewers: ['Robin Taylor'],
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    candidate: 'Morgan Chen',
    position: 'Data Scientist',
    date: '2025-04-25T15:00:00',
    status: 'completed',
    type: 'technical',
    feedback: 'Strong technical skills in machine learning. Good communication.',
    interviewers: ['Robin Taylor', 'Jamie Garcia'],
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    candidate: 'Casey Wilson',
    position: 'UX Designer',
    date: '2025-04-24T10:00:00',
    status: 'completed',
    type: 'portfolio',
    feedback: 'Excellent portfolio. Great understanding of user needs.',
    interviewers: ['Alex Johnson'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '5',
    candidate: 'Jamie Garcia',
    position: 'Mobile Developer',
    date: '2025-04-30T13:30:00',
    status: 'scheduled',
    type: 'technical',
    interviewers: ['Robin Taylor', 'Morgan Smith'],
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock candidates for scheduling
const mockCandidatesList = [
  { id: '1', name: 'Jordan Lee', position: 'Senior Software Engineer' },
  { id: '2', name: 'Taylor Smith', position: 'Frontend Developer' },
  { id: '5', name: 'Jamie Garcia', position: 'Mobile Developer' },
  { id: '6', name: 'Robin Taylor', position: 'Product Manager' },
  { id: '8', name: 'Alex Johnson', position: 'Backend Developer' },
];

// Mock team members for interviewers
const mockTeamMembers = [
  { id: '1', name: 'Robin Taylor' },
  { id: '2', name: 'Alex Johnson' },
  { id: '3', name: 'Jamie Garcia' },
  { id: '4', name: 'Morgan Smith' },
];

// Interview types
const interviewTypes = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'portfolio', label: 'Portfolio Review' },
  { value: 'final', label: 'Final Round' },
];

const InterviewsPage = () => {
  const [filter, setFilter] = useState('upcoming');
  const [date, setDate] = useState<Date>();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedType, setSelectedType] = useState('technical');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewTime, setInterviewTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter interviews based on status
  const filteredInterviews = mockInterviews.filter(interview => {
    if (filter === 'upcoming') {
      return interview.status === 'scheduled';
    } else if (filter === 'past') {
      return interview.status === 'completed';
    }
    return true;
  });

  // Handle actions
  const handleJoinInterview = (id: string) => {
    toast({
      title: "Join Interview",
      description: "Opening Zoom meeting for the interview",
    });
  };

  const handleViewFeedback = (id: string) => {
    toast({
      title: "View Feedback",
      description: "Opening interview feedback",
    });
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidate || !date || !interviewTime || selectedInterviewers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const candidate = mockCandidatesList.find(c => c.id === selectedCandidate);
    
    toast({
      title: "Interview Scheduled",
      description: `Interview for ${candidate?.name} scheduled successfully`,
    });
    
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCandidate('');
    setDate(undefined);
    setInterviewTime('');
    setSelectedType('technical');
    setSelectedInterviewers([]);
  };

  const toggleInterviewer = (memberId: string) => {
    setSelectedInterviewers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-2">
            Manage and schedule candidate interviews
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Set up an interview with a candidate and team members
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="candidate">Candidate</Label>
                <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCandidatesList.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name} - {candidate.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Interview Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Interviewers</Label>
                <div className="border rounded-md px-4 py-2 max-h-40 overflow-y-auto">
                  {mockTeamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center py-2 border-b last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        id={`member-${member.id}`}
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedInterviewers.includes(member.id)}
                        onChange={() => toggleInterviewer(member.id)}
                      />
                      <label 
                        htmlFor={`member-${member.id}`}
                        className="ml-2 text-sm font-medium"
                      >
                        {member.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleInterview}>Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Interview Filters */}
      <div className="flex space-x-4 border-b pb-2">
        <button 
          className={`px-4 py-2 font-medium ${filter === 'upcoming' ? 'text-primary border-b-2 border-primary -mb-2' : 'text-muted-foreground'}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`px-4 py-2 font-medium ${filter === 'past' ? 'text-primary border-b-2 border-primary -mb-2' : 'text-muted-foreground'}`}
          onClick={() => setFilter('past')}
        >
          Past Interviews
        </button>
        <button 
          className={`px-4 py-2 font-medium ${filter === 'all' ? 'text-primary border-b-2 border-primary -mb-2' : 'text-muted-foreground'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
      </div>

      {/* Interviews List */}
      <div className="space-y-6">
        {filteredInterviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No {filter} interviews found
          </div>
        ) : (
          filteredInterviews.map((interview) => (
            <Card key={interview.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={interview.avatarUrl} 
                        alt={interview.candidate} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-lg">{interview.candidate}</h3>
                        <Badge 
                          className="ml-3"
                          variant={interview.status === 'completed' ? 'outline' : 'default'}
                        >
                          {interview.status === 'completed' ? 'Completed' : 'Upcoming'}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground">{interview.position}</p>
                      
                      <div className="flex flex-wrap mt-2 gap-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {new Date(interview.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {new Date(interview.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          {interview.interviewers.join(', ')}
                        </div>
                        
                        <Badge variant="outline" className="bg-accent/50 text-sm font-normal">
                          {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                        </Badge>
                      </div>
                      
                      {interview.feedback && (
                        <div className="mt-3 border-t pt-3">
                          <div className="flex items-center text-sm font-medium mb-1">
                            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                            Feedback
                          </div>
                          <p className="text-sm">{interview.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {interview.status === 'scheduled' ? (
                      <Button onClick={() => handleJoinInterview(interview.id)}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Interview
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => handleViewFeedback(interview.id)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Guidelines Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Guidelines</CardTitle>
          <CardDescription>Tips for conducting effective interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Before the Interview</h3>
                <ul className="text-sm space-y-1">
                  <li>• Review the candidate's resume</li>
                  <li>• Prepare specific questions</li>
                  <li>• Test your video and audio setup</li>
                  <li>• Log in 5 minutes early</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">During the Interview</h3>
                <ul className="text-sm space-y-1">
                  <li>• Start with a brief introduction</li>
                  <li>• Follow the structured question format</li>
                  <li>• Allow time for candidate questions</li>
                  <li>• Take clear, objective notes</li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">After the Interview</h3>
                <ul className="text-sm space-y-1">
                  <li>• Submit feedback within 24 hours</li>
                  <li>• Be specific and objective</li>
                  <li>• Include examples from responses</li>
                  <li>• Provide a clear hire/no-hire recommendation</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/feedback">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Interview Templates
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewsPage;
