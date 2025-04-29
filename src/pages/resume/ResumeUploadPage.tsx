
import { useState, useCallback } from 'react';
import { Upload, FileUp, X, Check, AlertCircle, Search, FileText, Database, FolderUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { CandidateCard, Candidate } from '@/components/ui/candidate-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fileToText, parseResume, ParsedResume } from '@/utils/resumeParser';

// Mock candidates (matching results after upload)
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

// Mock candidates for database view
const mockCandidates: Candidate[] = [
  {
    id: '5',
    name: 'Jamie Garcia',
    position: 'Product Manager',
    skills: ['Product Strategy', 'Agile', 'User Research'],
    status: 'available',
    matchScore: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '6',
    name: 'Riley Johnson',
    position: 'UX Designer',
    skills: ['UI/UX', 'Figma', 'User Testing'],
    status: 'available',
    matchScore: 0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '7',
    name: 'Casey Martinez',
    position: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL'],
    status: 'available',
    matchScore: 0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

/**
 * ResumeUploadPage - Handles resume uploads and candidate matching
 * Admin users have full access to upload resumes, match with job descriptions,
 * and manage the resume database across the entire organization
 */
const ResumeUploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [parsedResumes, setParsedResumes] = useState<ParsedResume[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMatches, setShowMatches] = useState(false);
  const [selectedResumeIndex, setSelectedResumeIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [bulkUploadStatus, setBulkUploadStatus] = useState({
    total: 0,
    processed: 0,
    saved: 0,
  });
  const [showDatabaseInfo, setShowDatabaseInfo] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    handleNewFiles(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      handleNewFiles(newFiles);
    }
  };

  const handleNewFiles = async (newFiles: File[]) => {
    // Filter for only PDFs and DOCs
    const validFiles = newFiles.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ext === 'pdf' || ext === 'doc' || ext === 'docx';
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid File Type",
        description: "Only PDF, DOC, and DOCX files are accepted",
        variant: "destructive",
      });
    }

    setFiles(prev => [...prev, ...validFiles]);

    // Auto-parse new files
    setParsing(true);
    try {
      for (const file of validFiles) {
        const text = await fileToText(file);
        const parsedResume = parseResume(text);
        setParsedResumes(prev => [...prev, parsedResume]);
      }
    } catch (error) {
      toast({
        title: "Parsing Error",
        description: "An error occurred while parsing the resume",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedResumes(prev => prev.filter((_, i) => i !== index));
    if (selectedResumeIndex === index) {
      setSelectedResumeIndex(null);
    } else if (selectedResumeIndex !== null && selectedResumeIndex > index) {
      setSelectedResumeIndex(selectedResumeIndex - 1);
    }
  };

  const handleUpload = () => {
    if (!jobTitle.trim() && uploadMode === 'single') {
      toast({
        title: "Missing Information",
        description: "Please enter a job title",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one resume to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    if (uploadMode === 'single') {
      // Simulate upload progress for job matching
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setUploading(false);
          setShowMatches(true);
          setActiveTab("matches");
          toast({
            title: "Upload Complete",
            description: "Resumes uploaded and matched successfully",
          });
        }
      }, 200);
    } else {
      // Bulk upload to database
      const totalFiles = files.length;
      setBulkUploadStatus({
        total: totalFiles,
        processed: 0,
        saved: 0,
      });

      // Simulate bulk processing
      let processed = 0;
      const processInterval = setInterval(() => {
        processed++;
        setBulkUploadStatus(prev => ({
          ...prev,
          processed,
          saved: processed,
        }));
        setUploadProgress(Math.round((processed / totalFiles) * 100));

        if (processed >= totalFiles) {
          clearInterval(processInterval);
          setUploading(false);
          setShowDatabaseInfo(true);
          toast({
            title: "Bulk Upload Complete",
            description: `${totalFiles} resumes have been added to the database`,
          });
        }
      }, 200);
    }
  };

  const handleBulkUpload = () => {
    setUploadMode('bulk');
  };

  const handleSingleUpload = () => {
    setUploadMode('single');
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

  const renderResumeDetails = useCallback(() => {
    if (selectedResumeIndex === null || !parsedResumes[selectedResumeIndex]) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">Select a resume to view details</h3>
          <p className="text-sm text-muted-foreground">
            Click on a resume file to view the extracted information
          </p>
        </div>
      );
    }

    const resume = parsedResumes[selectedResumeIndex];

    return (
      <div className="space-y-6 p-4 animate-fade-in">
        <div>
          <h3 className="text-xl font-bold">{resume.name}</h3>
          <div className="space-y-1 mt-2">
            <p className="text-sm">{resume.email}</p>
            {resume.phone && <p className="text-sm">{resume.phone}</p>}
          </div>
        </div>

        {resume.summary && (
          <div>
            <h4 className="font-medium text-sm mb-2">Summary</h4>
            <p className="text-sm">{resume.summary}</p>
          </div>
        )}

        <div>
          <h4 className="font-medium text-sm mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <Badge key={i} variant="outline" className="capitalize">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Experience</h4>
          <div className="space-y-4">
            {resume.experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{exp.position}</p>
                  <p className="text-xs text-muted-foreground">{exp.duration}</p>
                </div>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
                <ul className="text-sm list-disc pl-5 space-y-1">
                  {exp.responsibilities.map((resp, j) => (
                    <li key={j}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2">Education</h4>
          <div className="space-y-2">
            {resume.education.map((edu, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.year}</p>
                </div>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }, [selectedResumeIndex, parsedResumes]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Resume Upload</h1>
        <p className="text-muted-foreground mt-2">
          Upload resumes and job descriptions to find matching candidates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-[500px]">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="parse">Resume Parsing</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Mode</CardTitle>
                <CardDescription>Choose how you want to upload resumes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={uploadMode === 'single' ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={handleSingleUpload}
                  >
                    <FileUp className="h-8 w-8 mb-2" />
                    <span className="font-medium">Match with Job</span>
                    <span className="text-xs text-muted-foreground mt-1">Upload and match with a job description</span>
                  </Button>
                  <Button
                    variant={uploadMode === 'bulk' ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={handleBulkUpload}
                  >
                    <FolderUp className="h-8 w-8 mb-2" />
                    <span className="font-medium">Bulk Upload</span>
                    <span className="text-xs text-muted-foreground mt-1">Upload multiple resumes to database</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description Form - Only shown in single upload mode */}
            {uploadMode === 'single' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                  <CardDescription>Enter details about the position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g. Senior Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      placeholder="Enter detailed job requirements, skills, and responsibilities..."
                      rows={10}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Resume Database</CardTitle>
                  <CardDescription>Upload resumes to the central database for future matching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-muted rounded-md">
                      <Database className="h-8 w-8 mr-4 text-primary" />
                      <div>
                        <h3 className="font-medium">Resume Database</h3>
                        <p className="text-sm text-muted-foreground">
                          Resumes uploaded to the database can be matched with any job description later.
                          This is useful for building a talent pool.
                        </p>
                      </div>
                    </div>

                    {showDatabaseInfo && (
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Database Statistics</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold">247</p>
                            <p className="text-sm text-muted-foreground">Total Resumes</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">32</p>
                            <p className="text-sm text-muted-foreground">Added Today</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold">18</p>
                            <p className="text-sm text-muted-foreground">Skills Indexed</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resume Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Upload</CardTitle>
                <CardDescription>Upload candidate resumes (.pdf, .doc, .docx)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drop Zone */}
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-1">Drag & Drop Files Here</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Input
                    id="fileInput"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm">
                    <FileUp className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">Selected Files ({files.length})</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className={`flex items-center justify-between bg-muted p-2 rounded-md ${
                            selectedResumeIndex === index ? 'ring-2 ring-primary' : ''
                          } hover:bg-muted/80 cursor-pointer`}
                          onClick={() => setSelectedResumeIndex(index)}
                        >
                          <div className="flex items-center overflow-hidden">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                              <FileUp className="h-4 w-4 text-primary" />
                            </div>
                            <div className="ml-2 overflow-hidden">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={uploading || parsing}
                  onClick={handleUpload}
                >
                  {uploading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadMode === 'single' ? 'Upload & Match Resumes' : 'Upload to Database'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parse" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Parsing Results</CardTitle>
              <CardDescription>
                Extracted information from uploaded resumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {parsing && (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center animate-pulse">
                    <p className="font-medium mb-2">Parsing Resumes...</p>
                    <p className="text-sm text-muted-foreground">
                      Extracting skills and information
                    </p>
                  </div>
                </div>
              )}

              {!parsing && files.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No Resumes Uploaded Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload resumes to extract skills and information
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Go to Upload
                  </Button>
                </div>
              )}

              {!parsing && files.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-1 border rounded-md overflow-hidden">
                    <div className="p-3 bg-muted font-medium text-sm">
                      Resume Files
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-3 border-b cursor-pointer hover:bg-muted/50 ${
                            selectedResumeIndex === index ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedResumeIndex(index)}
                        >
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 border rounded-md overflow-hidden">
                    <div className="p-3 bg-muted font-medium text-sm">
                      Parsed Information
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {renderResumeDetails()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          {/* Resume Database */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Resume Database</CardTitle>
                  <CardDescription>
                    Search and match resumes from the central database
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => {
                  setActiveTab("upload");
                  setUploadMode('bulk');
                }}>
                  Add More Resumes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-muted rounded-md">
                  <Database className="h-8 w-8 mr-4 text-primary" />
                  <div>
                    <h3 className="font-medium">Resume Database</h3>
                    <p className="text-sm text-muted-foreground">
                      The database contains 247 resumes that can be matched with any job description.
                      Use the search below to find candidates or upload a job description to match.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-md">
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-sm text-muted-foreground">Total Resumes</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-2xl font-bold">32</p>
                    <p className="text-sm text-muted-foreground">Added Today</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-sm text-muted-foreground">Skills Indexed</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Match with Job Description</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dbJobTitle">Job Title</Label>
                      <Input
                        id="dbJobTitle"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dbSkills">Required Skills</Label>
                      <Input
                        id="dbSkills"
                        placeholder="e.g. React, TypeScript, Node.js"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbJobDescription">Job Description</Label>
                    <Textarea
                      id="dbJobDescription"
                      placeholder="Enter detailed job requirements, skills, and responsibilities..."
                      rows={5}
                    />
                  </div>
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Find Matching Candidates
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Recently Added Resumes</h3>
                    <Button variant="link" className="h-auto p-0">View All</Button>
                  </div>
                  <div className="space-y-2">
                    {mockCandidates.slice(0, 3).map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.skills.join(', ')}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          {/* Matching Results */}
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
                  setActiveTab("upload");
                  setFiles([]);
                  setParsedResumes([]);
                  setJobTitle('');
                  setJobDescription('');
                }}>
                  New Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!showMatches && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No Matches Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload and process resumes to find matching candidates
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Go to Upload
                  </Button>
                </div>
              )}

              {showMatches && (
                <>
                  <div className="bg-recruit-success/30 p-4 rounded-md mb-6 flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Upload Complete</p>
                      <p className="text-sm">
                        {files.length} resumes were processed and matched with the job description for {jobTitle}
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeUploadPage;
