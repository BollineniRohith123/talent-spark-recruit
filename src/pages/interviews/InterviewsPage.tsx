import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Video, User, FileText, Plus, ChevronDown,
  MapPin, Building2, BarChart3, PieChart, Download, Filter,
  ArrowUpDown, Layers, Users, Search, CheckSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockLocations, mockDepartments, getLocationById, getDepartmentById } from '@/types/organization';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Enhanced mock interview data with location and department information
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
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    email: 'jordan.lee@example.com',
    source: 'LinkedIn',
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
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    email: 'taylor.smith@example.com',
    source: 'Indeed',
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
    locationId: 'loc-2', // New York Office
    departmentId: 'dept-3', // Marketing (Recruitment)
    email: 'morgan.chen@example.com',
    source: 'Referral',
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
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-5', // Marketing (Recruitment)
    email: 'casey.wilson@example.com',
    source: 'Dribbble',
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
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-7', // Marketing (Recruitment)
    email: 'jamie.garcia@example.com',
    source: 'Referral',
  },
  {
    id: '6',
    candidate: 'Robin Taylor',
    position: 'Product Manager',
    date: '2025-05-02T10:00:00',
    status: 'scheduled',
    type: 'behavioral',
    interviewers: ['David Kim', 'Sarah Chen'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-6', // Sales
    email: 'robin.taylor@example.com',
    source: 'LinkedIn',
  },
  {
    id: '7',
    candidate: 'Alex Johnson',
    position: 'Backend Developer',
    date: '2025-04-23T14:00:00',
    status: 'completed',
    type: 'technical',
    feedback: 'Good technical knowledge but needs improvement in system design.',
    interviewers: ['Taylor Reed', 'Drew Garcia'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-7', // Marketing (Recruitment)
    email: 'alex.johnson@example.com',
    source: 'Indeed',
  },
  {
    id: '8',
    candidate: 'Riley Martinez',
    position: 'Marketing Specialist',
    date: '2025-05-05T11:30:00',
    status: 'scheduled',
    type: 'behavioral',
    interviewers: ['Sarah Chen', 'Jordan Lee'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    email: 'riley.martinez@example.com',
    source: 'Company Website',
  }
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

// Feedback rating options
const ratingOptions = [
  { value: '1', label: '1 - Poor' },
  { value: '2', label: '2 - Below Average' },
  { value: '3', label: '3 - Average' },
  { value: '4', label: '4 - Good' },
  { value: '5', label: '5 - Excellent' },
];

// Recommendation options
const recommendationOptions = [
  { value: 'hire', label: 'Hire' },
  { value: 'consider', label: 'Consider' },
  { value: 'reject', label: 'Reject' },
];

const InterviewsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState('upcoming');
  const [date, setDate] = useState<Date>();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedType, setSelectedType] = useState('technical');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewTime, setInterviewTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [locationFilter, setLocationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    rating: '3',
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'consider'
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get user's assigned location and department based on role
  const userAssignedLocationId = useMemo(() => {
    if (user?.role === 'branch-manager') {
      // For demo, assign branch manager to Miami (loc-1)
      return 'loc-1';
    }
    return null;
  }, [user]);

  const userAssignedDepartmentId = useMemo(() => {
    if (['marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate'].includes(user?.role || '')) {
      // For demo, assign marketing roles to Marketing (Recruitment) department (dept-1)
      return 'dept-1';
    }
    return null;
  }, [user]);

  // Filter interviews based on user role
  const roleFilteredInterviews = useMemo(() => {
    if (!user) return [];

    // CEO can see all interviews
    if (user.role === 'ceo') {
      return mockInterviews;
    }

    // Branch Manager can only see interviews from their location
    if (user.role === 'branch-manager' && userAssignedLocationId) {
      return mockInterviews.filter(interview => interview.locationId === userAssignedLocationId);
    }

    // Marketing roles can only see interviews from their department and location
    if (['marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate'].includes(user.role)) {
      if (userAssignedDepartmentId && userAssignedLocationId) {
        return mockInterviews.filter(
          interview => interview.departmentId === userAssignedDepartmentId &&
                      interview.locationId === userAssignedLocationId
        );
      }
    }

    return [];
  }, [user, userAssignedLocationId, userAssignedDepartmentId]);

  // Compute metrics
  const interviewsByLocation = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.locationId) {
        result[interview.locationId] = (result[interview.locationId] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  const interviewsByDepartment = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.departmentId) {
        result[interview.departmentId] = (result[interview.departmentId] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  const interviewsBySource = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.source) {
        result[interview.source] = (result[interview.source] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  const interviewsByType = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.type) {
        result[interview.type] = (result[interview.type] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  // Calculate conversion metrics
  const interviewMetrics = useMemo(() => {
    const completed = roleFilteredInterviews.filter(i => i.status === 'completed').length;
    const scheduled = roleFilteredInterviews.filter(i => i.status === 'scheduled').length;
    const total = roleFilteredInterviews.length;

    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate success rate (interviews with positive feedback)
    const successfulInterviews = roleFilteredInterviews.filter(
      i => i.status === 'completed' && i.feedback && ['good', 'excellent', 'strong'].some(term => i.feedback!.toLowerCase().includes(term))
    ).length;
    const successRate = completed > 0 ? Math.round((successfulInterviews / completed) * 100) : 0;

    return {
      completed,
      scheduled,
      total,
      completionRate,
      successRate,
      successfulInterviews
    };
  }, [roleFilteredInterviews]);

  // Filter interviews based on status, location, department, and search term
  const filteredInterviews = roleFilteredInterviews.filter(interview => {
    // Filter by status
    if (filter === 'upcoming') {
      if (interview.status !== 'scheduled') return false;
    } else if (filter === 'past') {
      if (interview.status !== 'completed') return false;
    }

    // Filter by search term
    if (searchTerm && !interview.candidate.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by location
    if (locationFilter !== 'all' && interview.locationId !== locationFilter) {
      return false;
    }

    // Filter by department
    if (departmentFilter !== 'all' && interview.departmentId !== departmentFilter) {
      return false;
    }

    // Filter by source
    if (sourceFilter !== 'all' && interview.source !== sourceFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort by date (newest first)
    if (sortOrder === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    // Sort by name (alphabetical)
    return a.candidate.localeCompare(b.candidate);
  });

  // Get unique values for filters
  const sources = ['all', ...new Set(roleFilteredInterviews.filter(i => i.source).map(i => i.source as string))];

  // Handle actions
  const handleJoinInterview = (id: string) => {
    toast({
      title: "Join Interview",
      description: "Opening Zoom meeting for the interview",
    });
  };

  const handleViewFeedback = (id: string) => {
    const interview = roleFilteredInterviews.find(i => i.id === id);
    if (interview) {
      setSelectedInterview(interview);
      setIsFeedbackDialogOpen(true);
    }
  };

  const handleSubmitFeedback = () => {
    if (!selectedInterview) return;

    if (!feedbackForm.strengths || !feedbackForm.weaknesses || !feedbackForm.notes) {
      toast({
        title: "Missing Information",
        description: "Please fill in all feedback fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: `Feedback for ${selectedInterview.candidate} has been submitted successfully`,
    });

    setIsFeedbackDialogOpen(false);
    resetFeedbackForm();
  };

  const resetFeedbackForm = () => {
    setFeedbackForm({
      rating: '3',
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'consider'
    });
    setSelectedInterview(null);
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidate || !date || !interviewTime || selectedInterviewers.length === 0 || !selectedLocation || !selectedDepartment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including location and department",
        variant: "destructive",
      });
      return;
    }

    const candidate = mockCandidatesList.find(c => c.id === selectedCandidate);
    const location = mockLocations.find(l => l.id === selectedLocation);
    const department = mockDepartments.find(d => d.id === selectedDepartment);

    toast({
      title: "Interview Scheduled",
      description: `Interview for ${candidate?.name} scheduled successfully at ${location?.name} for ${department?.name}`,
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
    setSelectedLocation('');
    setSelectedDepartment('');
  };

  const toggleInterviewer = (memberId: string) => {
    setSelectedInterviewers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

}; // Add missing closing brace for InterviewsPage component

export default InterviewsPage;
