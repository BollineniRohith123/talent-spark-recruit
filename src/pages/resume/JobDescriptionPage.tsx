
import { useState } from 'react';
import { Search, FileUp, Check, AlertCircle, FileText, Building, Clock, Briefcase, Plus, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { CandidateCard, Candidate } from '@/components/ui/candidate-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    budget: '$120/hr',
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
    budget: '$130/hr',
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
    budget: '$95/hr',
    description: 'We are looking for a UX/UI Designer with a strong portfolio showcasing user-centered design solutions. Experience with Figma, Adobe Creative Suite, and user testing required.',
  },
];

// Mock candidates (matching results for testing)
const matchedCandidates: Candidate[] = [
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
    position: 'Software Engineer',
    skills: ['JavaScript', 'Python', 'Docker'],
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

const JobDescriptionPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');
  const [budget, setBudget] = useState('');
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

    setUploading(true);
    
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
          description: "Job description has been created and candidates matched successfully",
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
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        placeholder="e.g. $100/hr"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
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
                    setBudget('');
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
                      Your job description for {jobTitle} has been analyzed using AI matching
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
                    <h4 className="text-sm font-medium mb-1">Budget</h4>
                    <p>{selectedJob.budget}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Applicants</h4>
                    <p>{selectedJob.applicants} total applications</p>
                  </div>
                </div>

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
