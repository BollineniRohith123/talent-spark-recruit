
import { useState } from 'react';
import { Search, FileUp, Check, AlertCircle, FileText, Building, Clock, Briefcase, Plus, Users, DollarSign, Percent, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { CandidateCard, Candidate } from '@/components/ui/candidate-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for job descriptions
const savedJobDescriptions = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    postedDate: '2025-04-15',
    applicants: 24,
    status: 'active',
    client: 'TechCorp Inc.',
    clientBudget: 120, // Client budget in dollars per hour
    internalBudget: 85, // What employees see (internal budget) in dollars per hour
    candidateSplit: 80, // Percentage of internal budget that goes to candidate (80%)
    companySplit: 20, // Percentage of internal budget that goes to company (20%)
    budget: '$120/hr', // For backward compatibility
    description: 'We are looking for a Senior Software Engineer with experience in React, Node.js, and AWS to join our team. The ideal candidate will have 5+ years of experience in full-stack development.',
  },
  {
    id: '2',
    title: 'Data Scientist',
    department: 'Data & Analytics',
    location: 'New York, NY',
    postedDate: '2025-04-10',
    applicants: 18,
    status: 'active',
    client: 'FinTech Solutions',
    clientBudget: 130, // Client budget in dollars per hour
    internalBudget: 90, // What employees see (internal budget) in dollars per hour
    candidateSplit: 75, // Percentage of internal budget that goes to candidate (75%)
    companySplit: 25, // Percentage of internal budget that goes to company (25%)
    budget: '$130/hr', // For backward compatibility
    description: 'Seeking a skilled Data Scientist with expertise in machine learning, Python, and statistical analysis. The candidate should have experience with large datasets and data visualization.',
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    postedDate: '2025-04-05',
    applicants: 15,
    status: 'closed',
    client: 'Creative Agency',
    clientBudget: 95, // Client budget in dollars per hour
    internalBudget: 70, // What employees see (internal budget) in dollars per hour
    candidateSplit: 85, // Percentage of internal budget that goes to candidate (85%)
    companySplit: 15, // Percentage of internal budget that goes to company (15%)
    budget: '$95/hr', // For backward compatibility
    description: 'We are looking for a UX/UI Designer with a strong portfolio showcasing user-centered design solutions. Experience with Figma, Adobe Creative Suite, and user testing required.',
  },
];

// Mock candidates (matching results for testing)
const matchedCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Recruitment Specialist',
    skills: ['Talent Acquisition', 'Candidate Sourcing', 'ATS Management'],
    status: 'screening',
    matchScore: 92,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Account Executive',
    skills: ['Sales', 'Client Relationship', 'Negotiation'],
    status: 'screening',
    matchScore: 87,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'UI/UX'],
    status: 'screening',
    matchScore: 85,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Alex Wong',
    position: 'Backend Developer',
    skills: ['Node.js', 'MongoDB', 'Express'],
    status: 'screening',
    matchScore: 81,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

/**
 * JobDescriptionPage - Manages job description creation and candidate matching
 * Admin users have full access to create, edit, and view all job descriptions
 * across the organization, including client budgets and profit configurations
 */
const JobDescriptionPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ceo';
  const isHiringManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const isScout = user?.role === 'marketing-recruiter';
  const isTeamMember = user?.role === 'marketing-associate';
  const canSeeClientBudget = isAdmin || isHiringManager; // Only CEO and managers can see client budget

  const [activeTab, setActiveTab] = useState('create');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');
  const [clientBudget, setClientBudget] = useState('');
  const [internalBudget, setInternalBudget] = useState('');
  const [candidateSplit, setCandidateSplit] = useState('80'); // Default 80%
  const [companySplit, setCompanySplit] = useState('20'); // Default 20%
  const [showProfitDetails, setShowProfitDetails] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMatches, setShowMatches] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredJobs = savedJobDescriptions.filter(job => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCreateJob = () => {
    if (!jobTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a job title",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    // Budget validation only for admin and hiring manager
    if (canSeeClientBudget) {
      if (!clientBudget.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the client budget",
          variant: "destructive",
        });
        return;
      }

      if (!internalBudget.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the internal budget",
          variant: "destructive",
        });
        return;
      }

      // Validate that internal budget is less than client budget
      if (parseFloat(internalBudget) >= parseFloat(clientBudget)) {
        toast({
          title: "Invalid Budget Configuration",
          description: "Internal budget must be less than client budget",
          variant: "destructive",
        });
        return;
      }
    } else {
      // For scouts and team members, only validate internal budget if provided
      if (internalBudget.trim() && !candidateSplit.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the candidate split percentage",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate that candidate split + company split = 100%
    if (parseInt(candidateSplit) + parseInt(companySplit) !== 100) {
      toast({
        title: "Invalid Profit Split",
        description: "Candidate split and company split must add up to 100%",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    // Calculate profit margins for reporting
    let clientToCompanyProfit = 0;
    let companyToCandidateProfit = 0;
    let totalProfit = 0;
    let profitMargin = 0;

    if (canSeeClientBudget && clientBudget && internalBudget) {
      // Full profit calculation for admin and hiring manager
      clientToCompanyProfit = parseFloat(clientBudget) - parseFloat(internalBudget);
      companyToCandidateProfit = (parseFloat(internalBudget) * parseInt(companySplit)) / 100;
      totalProfit = clientToCompanyProfit + companyToCandidateProfit;
      profitMargin = (totalProfit / parseFloat(clientBudget)) * 100;

      // Log complete profit information (in a real app, this would be saved to the database)
      console.log('Profit Configuration (Admin/Manager):', {
        clientBudget: parseFloat(clientBudget),
        internalBudget: parseFloat(internalBudget),
        candidateSplit: parseInt(candidateSplit),
        companySplit: parseInt(companySplit),
        clientToCompanyProfit,
        companyToCandidateProfit,
        totalProfit,
        profitMargin
      });
    } else if (internalBudget) {
      // Limited profit calculation for scouts and team members
      // They only see company-to-candidate profit based on internal budget
      companyToCandidateProfit = (parseFloat(internalBudget) * parseInt(companySplit)) / 100;

      // Log limited profit information
      console.log('Profit Configuration (Scout/Team Member):', {
        internalBudget: parseFloat(internalBudget),
        candidateSplit: parseInt(candidateSplit),
        companySplit: parseInt(companySplit),
        companyToCandidateProfit
      });
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setShowMatches(true);
        toast({
          title: "Job Description Created",
          description: "Job description has been created with profit configuration and candidates matched successfully",
        });
      }
    }, 200);
  };

  const handleViewJob = (id: string) => {
    setSelectedJobId(id);
    setActiveTab('view');
  };

  const handleFindMatches = () => {
    setUploading(true);

    // Simulate matching process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setShowMatches(true);
        toast({
          title: "Candidates Matched",
          description: `Found ${matchedCandidates.length} matching candidates for this job description`,
        });
      }
    }, 150);
  };

  const handleViewCandidate = (id: string) => {
    toast({
      title: "View Candidate",
      description: `Viewing candidate profile for ID: ${id}`,
    });
  };

  const handleNextStep = (id: string) => {
    toast({
      title: "Candidate Action",
      description: `Sending screening link to candidate ID: ${id}`,
    });
  };

  const selectedJob = selectedJobId
    ? savedJobDescriptions.find(job => job.id === selectedJobId)
    : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Job Descriptions</h1>
        <p className="text-muted-foreground mt-2">
          Create, manage, and match candidates to job descriptions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </TabsTrigger>
          <TabsTrigger value="saved">
            <FileText className="h-4 w-4 mr-2" />
            Saved Jobs
          </TabsTrigger>
          {selectedJobId && (
            <TabsTrigger value="view">
              <FileText className="h-4 w-4 mr-2" />
              View Job
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {!showMatches ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Job Description</CardTitle>
                <CardDescription>Enter details about the position to find matching candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        placeholder="e.g. Senior Software Engineer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="e.g. Engineering"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g. Remote, New York, NY"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">Client</Label>
                      <Input
                        id="client"
                        placeholder="e.g. TechCorp Inc."
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                      />
                    </div>

                    {/* Budget and Profit Configuration */}
                    <div className="space-y-4 border p-4 rounded-md bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          {canSeeClientBudget ? 'Budget & Profit Configuration' : 'Profit Configuration'}
                        </h4>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              {canSeeClientBudget ? (
                                <p>Configure client budget, internal budget (visible to employees), and profit splits between candidate and company.</p>
                              ) : (
                                <p>Configure internal budget and profit splits between candidate and company. Client budget is managed by admins and hiring managers.</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      {/* Admin and Hiring Manager see full budget configuration */}
                      {canSeeClientBudget && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="clientBudget">Client Budget ($/hr)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="clientBudget"
                                type="number"
                                placeholder="e.g. 100"
                                value={clientBudget}
                                onChange={(e) => {
                                  setClientBudget(e.target.value);
                                  // Auto-calculate internal budget as 70% of client budget if not set
                                  if (!internalBudget && e.target.value) {
                                    setInternalBudget((parseFloat(e.target.value) * 0.7).toFixed(2));
                                  }
                                }}
                                className="pl-8"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="internalBudget">Internal Budget ($/hr)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="internalBudget"
                                type="number"
                                placeholder="e.g. 70"
                                value={internalBudget}
                                onChange={(e) => setInternalBudget(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Visible to employees</p>
                          </div>
                        </div>
                      )}

                      {/* Scouts and Team Members only see internal budget */}
                      {!canSeeClientBudget && (
                        <div className="space-y-2">
                          <Label htmlFor="internalBudget">Internal Budget ($/hr)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="internalBudget"
                              type="number"
                              placeholder="e.g. 70"
                              value={internalBudget}
                              onChange={(e) => setInternalBudget(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Budget allocated for this position</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Internal Budget Split</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="candidateSplit" className="text-xs">Candidate (%)</Label>
                            <div className="relative">
                              <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="candidateSplit"
                                type="number"
                                min="0"
                                max="100"
                                value={candidateSplit}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  setCandidateSplit(e.target.value);
                                  if (!isNaN(value) && value >= 0 && value <= 100) {
                                    setCompanySplit((100 - value).toString());
                                  }
                                }}
                                className="pl-8"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="companySplit" className="text-xs">Company (%)</Label>
                            <div className="relative">
                              <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="companySplit"
                                type="number"
                                min="0"
                                max="100"
                                value={companySplit}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  setCompanySplit(e.target.value);
                                  if (!isNaN(value) && value >= 0 && value <= 100) {
                                    setCandidateSplit((100 - value).toString());
                                  }
                                }}
                                className="pl-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profit Calculation Preview - Different for each role */}
                      {internalBudget && (
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Profit Preview</span>
                            {canSeeClientBudget && clientBudget && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowProfitDetails(!showProfitDetails)}
                                className="h-6 px-2 text-xs"
                              >
                                {showProfitDetails ? 'Hide Details' : 'Show Details'}
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                            {/* Admin and Hiring Manager see full profit details */}
                            {canSeeClientBudget && clientBudget && (
                              <>
                                <div className="flex justify-between text-sm">
                                  <span>Client-to-Company Profit:</span>
                                  <span className="font-medium">
                                    ${(parseFloat(clientBudget) - parseFloat(internalBudget)).toFixed(2)}/hr
                                  </span>
                                </div>

                                {showProfitDetails && (
                                  <>
                                    <div className="flex justify-between text-sm">
                                      <span>Company-to-Candidate Profit:</span>
                                      <span className="font-medium">
                                        ${((parseFloat(internalBudget) * parseInt(companySplit)) / 100).toFixed(2)}/hr
                                      </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                      <span>Total Profit:</span>
                                      <span className="font-medium">
                                        ${(
                                          (parseFloat(clientBudget) - parseFloat(internalBudget)) +
                                          ((parseFloat(internalBudget) * parseInt(companySplit)) / 100)
                                        ).toFixed(2)}/hr
                                      </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                      <span>Profit Margin:</span>
                                      <span className="font-medium">
                                        {(
                                          ((parseFloat(clientBudget) - parseFloat(internalBudget)) +
                                          ((parseFloat(internalBudget) * parseInt(companySplit)) / 100)) /
                                          parseFloat(clientBudget) * 100
                                        ).toFixed(2)}%
                                      </span>
                                    </div>
                                  </>
                                )}
                              </>
                            )}

                            {/* Scouts and Team Members only see company-to-candidate profit */}
                            {!canSeeClientBudget && (
                              <div className="flex justify-between text-sm">
                                <span>Company Profit (from internal budget):</span>
                                <span className="font-medium">
                                  ${((parseFloat(internalBudget) * parseInt(companySplit)) / 100).toFixed(2)}/hr
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Job Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="jobDescription">Job Description *</Label>
                      <Textarea
                        id="jobDescription"
                        placeholder="Enter a general overview of the position..."
                        rows={6}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsibilities">Key Responsibilities</Label>
                      <Textarea
                        id="responsibilities"
                        placeholder="Enter job responsibilities..."
                        rows={4}
                        value={responsibilities}
                        onChange={(e) => setResponsibilities(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Requirements and Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements & Qualifications</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Enter required skills, experience, education..."
                      rows={5}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits & Perks</Label>
                    <Textarea
                      id="benefits"
                      placeholder="Enter benefits, perks, work environment details..."
                      rows={5}
                      value={benefits}
                      onChange={(e) => setBenefits(e.target.value)}
                    />
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing job description...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => {
                    setJobTitle('');
                    setDepartment('');
                    setLocation('');
                    setClient('');
                    setClientBudget('');
                    setInternalBudget('');
                    setCandidateSplit('80');
                    setCompanySplit('20');
                    setShowProfitDetails(false);
                    setJobDescription('');
                    setResponsibilities('');
                    setRequirements('');
                    setBenefits('');
                  }}>
                    Clear Form
                  </Button>
                  <Button
                    onClick={handleCreateJob}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <FileUp className="mr-2 h-4 w-4" />
                        Create & Find Matches
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Matching Results */
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Matching Results</CardTitle>
                    <CardDescription>
                      Candidates matching the job position: {jobTitle}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => {
                    setShowMatches(false);
                    setJobTitle('');
                    setJobDescription('');
                  }}>
                    New Job Description
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-recruit-success/30 p-4 rounded-md mb-6 flex items-start">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Job Description Created</p>
                    <p className="text-sm">
                      Your job description for {jobTitle} has been analyzed using SmartMatch matching
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onView={handleViewCandidate}
                      onAction={handleNextStep}
                      actionLabel="Send Screening"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips for Creating Effective Job Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for Effective Job Descriptions</CardTitle>
              <CardDescription>
                Optimize your job descriptions for better candidate matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Be specific about skills and experience</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Clearly list required technical skills, years of experience, and necessary qualifications.
                      Example: "5+ years of experience with React.js, Node.js, and AWS" instead of "Experience with web development".
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Use industry-standard job titles</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Use recognized job titles to improve matching accuracy. For example, "Frontend Developer"
                      instead of "Web Specialist" will match more relevant candidates.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Include soft skills and culture fit</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Mention important soft skills like "excellent communication," "problem-solving," or
                      "team collaboration" to help match candidates with the right work style.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Organize with clear sections</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Structure your job description with clear sections for responsibilities, requirements,
                      benefits, and company information to improve readability and matching.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job titles..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No job descriptions found</h3>
              <p className="text-muted-foreground">
                Try changing your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg hover:text-primary cursor-pointer" onClick={() => handleViewJob(job.id)}>
                            {job.title}
                          </h3>
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status === 'active' ? 'Active' : 'Closed'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {job.department}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.client}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Posted: {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applicants} applicants
                          </div>
                        </div>
                        <p className="text-sm line-clamp-2 mt-2">
                          {job.description}
                        </p>
                      </div>
                      <Button onClick={() => handleViewJob(job.id)}>View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {selectedJob && (
          <TabsContent value="view" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{selectedJob.title}</CardTitle>
                      <Badge variant={selectedJob.status === 'active' ? 'default' : 'secondary'}>
                        {selectedJob.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {selectedJob.department} · {selectedJob.location} · Posted {new Date(selectedJob.postedDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline">Edit</Button>
                    <Button onClick={handleFindMatches}>Find Matches</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Client</h4>
                    <p>{selectedJob.client}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">{canSeeClientBudget ? 'Client Budget' : 'Internal Budget'}</h4>
                    <p>${canSeeClientBudget ? selectedJob.clientBudget : selectedJob.internalBudget}/hr</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Applicants</h4>
                    <p>{selectedJob.applicants} total applications</p>
                  </div>
                </div>

                {/* Profit Configuration Details */}
                <Card className="mb-6 border-dashed">
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">
                      {canSeeClientBudget ? 'Profit Configuration' : 'Profit Split'}
                    </CardTitle>
                    <CardDescription>
                      {canSeeClientBudget ? 'Budget allocation and profit margins' : 'Internal budget allocation'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-3">
                    {canSeeClientBudget ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Budget Allocation</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Client Budget:</span>
                                <span className="font-medium">${selectedJob.clientBudget}/hr</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Internal Budget:</span>
                                <span className="font-medium">${selectedJob.internalBudget}/hr</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Client-to-Company Profit:</span>
                                <span className="font-medium text-green-600">
                                  ${(selectedJob.clientBudget - selectedJob.internalBudget).toFixed(2)}/hr
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Internal Budget Split</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Candidate Share:</span>
                                <span className="font-medium">{selectedJob.candidateSplit}% (${((selectedJob.internalBudget * selectedJob.candidateSplit) / 100).toFixed(2)}/hr)</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Company Share:</span>
                                <span className="font-medium">{selectedJob.companySplit}% (${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr)</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Company-to-Candidate Profit:</span>
                                <span className="font-medium text-green-600">
                                  ${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted p-3 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Profit:</span>
                            <span className="font-medium text-green-600">
                              ${(
                                (selectedJob.clientBudget - selectedJob.internalBudget) +
                                ((selectedJob.internalBudget * selectedJob.companySplit) / 100)
                              ).toFixed(2)}/hr
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-medium">Profit Margin:</span>
                            <span className="font-medium text-green-600">
                              {(
                                ((selectedJob.clientBudget - selectedJob.internalBudget) +
                                ((selectedJob.internalBudget * selectedJob.companySplit) / 100)) /
                                selectedJob.clientBudget * 100
                              ).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Limited view for scouts and team members */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Internal Budget</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Budget:</span>
                              <span className="font-medium">${selectedJob.internalBudget}/hr</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Budget Split</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Candidate Share:</span>
                                <span className="font-medium">{selectedJob.candidateSplit}% (${((selectedJob.internalBudget * selectedJob.candidateSplit) / 100).toFixed(2)}/hr)</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">Company Share:</span>
                                <span className="font-medium">{selectedJob.companySplit}% (${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr)</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Company Profit:</span>
                              <span className="font-medium text-green-600">
                                ${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Job Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {selectedJob.description}
                    </p>
                  </div>

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Searching for matching candidates...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  {showMatches && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Matching Candidates</h3>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {matchedCandidates.length} matches found
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {matchedCandidates.map((candidate) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            onView={handleViewCandidate}
                            onAction={handleNextStep}
                            actionLabel="Send Screening"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default JobDescriptionPage;
