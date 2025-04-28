import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal,
  Bell,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  JobListing, 
  JobStatus, 
  mockJobListings, 
  getStatusColor,
  getPriorityColor,
  getJobListingsByLocationId
} from '@/types/jobs';
import { mockLocations } from '@/types/organization';
import { AssignJobDialog } from '@/components/jobs/AssignJobDialog';

const JobListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'company-admin';
  const isHiringManager = user?.role === 'hiring-manager';
  const isScout = user?.role === 'talent-scout';
  const isTeamMember = user?.role === 'team-member';
  
  // State for job listings
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<JobListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  
  // State for assign job dialog
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  // Load job listings based on user role
  useEffect(() => {
    let jobs: JobListing[] = [];
    
    if (isAdmin) {
      // Admin sees all jobs
      jobs = [...mockJobListings];
    } else if (isHiringManager) {
      // Hiring manager sees jobs for their location
      // In a real app, we would get the manager's location from their profile
      const managerLocationId = 'loc-1'; // Miami for demo
      jobs = getJobListingsByLocationId(managerLocationId);
    } else if (isScout || isTeamMember) {
      // Scouts and team members see jobs assigned to them
      jobs = mockJobListings.filter(job => job.assignedTo === user?.id);
    }
    
    setJobListings(jobs);
    setFilteredListings(jobs);
  }, [user, isAdmin, isHiringManager, isScout, isTeamMember]);

  // Filter job listings based on search query and filters
  useEffect(() => {
    let filtered = [...jobListings];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(job => job.locationId === locationFilter);
    }
    
    // Apply assigned filter
    if (assignedFilter === 'assigned') {
      filtered = filtered.filter(job => job.assignedTo !== null);
    } else if (assignedFilter === 'unassigned') {
      filtered = filtered.filter(job => job.assignedTo === null);
    }
    
    setFilteredListings(filtered);
  }, [jobListings, searchQuery, statusFilter, locationFilter, assignedFilter]);

  // Handle job assignment
  const handleAssignJob = (job: JobListing) => {
    setSelectedJob(job);
    setIsAssignDialogOpen(true);
  };

  // Handle job assignment completion
  const handleAssignmentComplete = (jobId: string, userId: string, userName: string) => {
    // In a real app, this would be an API call
    const updatedListings = jobListings.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          assignedTo: userId,
          assignedToName: userName,
          updatedAt: new Date().toISOString()
        };
      }
      return job;
    });
    
    setJobListings(updatedListings);
    
    toast({
      title: "Job Assigned",
      description: `Job has been assigned to ${userName}`,
    });
  };

  // Handle view job details
  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  // Handle edit job
  const handleEditJob = (jobId: string) => {
    navigate(`/jobs/${jobId}/edit`);
  };

  // Handle delete job
  const handleDeleteJob = (jobId: string) => {
    // In a real app, this would be an API call
    const updatedListings = jobListings.filter(job => job.id !== jobId);
    setJobListings(updatedListings);
    
    toast({
      title: "Job Deleted",
      description: "Job listing has been deleted",
    });
  };

  // Handle create new job
  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin 
              ? "Manage all job listings across locations" 
              : isHiringManager 
                ? "Manage job listings for your location" 
                : "Manage your assigned job listings"}
          </p>
        </div>
        
        {(isAdmin || isHiringManager) && (
          <Button onClick={handleCreateJob}>
            <Plus className="mr-2 h-4 w-4" /> Create Job
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as JobStatus | 'all')}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              
              {isAdmin && (
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Assignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="flex items-center">
                  Job Title
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-center">Applicants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length > 0 ? (
              filteredListings.map((job) => (
                <TableRow key={job.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewJob(job.id)}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(job.priority)}`}>
                      {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.assignedToName ? (
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          {job.assignedToName.charAt(0)}
                        </div>
                        <span>{job.assignedToName}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{job.applicantsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewJob(job.id);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        
                        {(isAdmin || isHiringManager || job.assignedTo === user?.id) && (
                          <>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleAssignJob(job);
                            }}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Assign Job
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditJob(job.id);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Job
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {(isAdmin || isHiringManager) && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteJob(job.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Job
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No job listings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Job Dialog */}
      {selectedJob && (
        <AssignJobDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          job={selectedJob}
          onAssign={handleAssignmentComplete}
        />
      )}
    </div>
  );
};

export default JobListingsPage;
