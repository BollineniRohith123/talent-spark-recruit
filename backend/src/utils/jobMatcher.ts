import { prisma } from './prisma';
import { logger } from './logger';

/**
 * Job Matcher Utility
 * 
 * This utility provides functions to match candidates with job postings
 * based on skills, experience, and other criteria.
 * 
 * In a production environment, this would use more sophisticated algorithms
 * and possibly integrate with AI/ML services for better matching.
 */
class JobMatcher {
  /**
   * Match a resume with a job posting
   * 
   * @param resumeData Parsed resume data
   * @param jobId Job ID to match against
   * @returns Match score from 0-100
   */
  async matchResumeWithJob(resumeData: any, jobId: number): Promise<number> {
    try {
      // Get job details
      const job = await prisma.job.findUnique({
        where: { id: jobId }
      });
      
      if (!job) {
        logger.warn(`Job not found for matching: ${jobId}`);
        return 0;
      }
      
      // Initialize scores for different criteria
      let skillScore = 0;
      let experienceScore = 0;
      let educationScore = 0;
      
      // Match skills (highest weight)
      skillScore = this.matchSkills(resumeData.skills || [], job.skills);
      
      // Match experience level
      experienceScore = this.matchExperience(resumeData.experience || [], job.experienceLevel);
      
      // Match education (if applicable)
      educationScore = this.matchEducation(resumeData.education || []);
      
      // Calculate weighted score
      const weightedScore = (
        (skillScore * 0.6) +
        (experienceScore * 0.3) +
        (educationScore * 0.1)
      );
      
      // Convert to 0-100 scale
      const finalScore = Math.round(weightedScore * 100);
      
      logger.info(`Match score for job ${jobId}: ${finalScore}%`);
      return finalScore;
      
    } catch (error) {
      logger.error(`Error in job matching: ${error}`);
      return 0;
    }
  }
  
  /**
   * Match candidate skills with job required skills
   * 
   * @param candidateSkills Array of candidate skills
   * @param jobSkills Array of job required skills
   * @returns Score from 0-1
   */
  private matchSkills(candidateSkills: string[], jobSkills: string[]): number {
    if (!jobSkills.length || !candidateSkills.length) {
      return 0;
    }
    
    // Normalize skills for comparison
    const normalizedCandidateSkills = candidateSkills.map(skill => 
      skill.toLowerCase().trim()
    );
    
    const normalizedJobSkills = jobSkills.map(skill => 
      skill.toLowerCase().trim()
    );
    
    // Count matching skills
    let matchCount = 0;
    
    for (const jobSkill of normalizedJobSkills) {
      for (const candidateSkill of normalizedCandidateSkills) {
        // Check for exact match or if candidate skill contains job skill
        if (candidateSkill === jobSkill || candidateSkill.includes(jobSkill)) {
          matchCount++;
          break;
        }
      }
    }
    
    // Calculate score as percentage of matched skills
    return matchCount / jobSkills.length;
  }
  
  /**
   * Match candidate experience with job required experience level
   * 
   * @param experience Array of candidate experience entries
   * @param requiredLevel Job required experience level
   * @returns Score from 0-1
   */
  private matchExperience(
    experience: Array<{from: Date, to?: Date, current: boolean}>,
    requiredLevel: string
  ): number {
    if (!experience.length) {
      return 0;
    }
    
    // Calculate total years of experience
    const totalYears = this.calculateTotalExperienceYears(experience);
    
    // Map required level to expected years
    const expectedYears = {
      'ENTRY': 0,
      'JUNIOR': 1,
      'MID': 3,
      'SENIOR': 5,
      'EXECUTIVE': 8
    }[requiredLevel] || 0;
    
    // Calculate score based on years
    if (totalYears >= expectedYears) {
      return 1; // Full match
    } else if (expectedYears === 0) {
      return 1; // Entry level always matches
    } else {
      return totalYears / expectedYears; // Partial match
    }
  }
  
  /**
   * Match candidate education with implicit job education requirements
   * 
   * @param education Array of candidate education entries
   * @returns Score from 0-1
   */
  private matchEducation(
    education: Array<{degree: string, fieldOfStudy: string}>
  ): number {
    if (!education.length) {
      return 0;
    }
    
    // Simple implementation - just check if candidate has a degree
    const hasDegree = education.some(edu => 
      edu.degree.toLowerCase().includes('bachelor') ||
      edu.degree.toLowerCase().includes('master') ||
      edu.degree.toLowerCase().includes('phd') ||
      edu.degree.toLowerCase().includes('doctorate')
    );
    
    return hasDegree ? 1 : 0.5;
  }
  
  /**
   * Calculate total years of experience from experience entries
   * 
   * @param experience Array of experience entries
   * @returns Total years of experience
   */
  private calculateTotalExperienceYears(
    experience: Array<{from: Date, to?: Date, current: boolean}>
  ): number {
    const now = new Date();
    
    return experience.reduce((total, exp) => {
      const fromDate = new Date(exp.from);
      const toDate = exp.current ? now : (exp.to ? new Date(exp.to) : now);
      
      const yearDiff = toDate.getFullYear() - fromDate.getFullYear();
      const monthDiff = toDate.getMonth() - fromDate.getMonth();
      
      // Calculate years including partial years
      const years = yearDiff + (monthDiff / 12);
      
      return total + years;
    }, 0);
  }
  
  /**
   * Find matching jobs for a candidate
   * 
   * @param candidateId Candidate user ID
   * @param limit Maximum number of job matches to return
   * @returns Array of job matches with scores
   */
  async findMatchingJobs(candidateId: number, limit: number = 10): Promise<any[]> {
    try {
      // Get candidate profile
      const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        include: {
          applications: {
            select: { jobId: true }
          }
        }
      });
      
      if (!candidate) {
        logger.warn(`Candidate not found for job matching: ${candidateId}`);
        return [];
      }
      
      // Get jobs the candidate hasn't applied to yet
      const appliedJobIds = candidate.applications.map(app => app.jobId);
      
      const availableJobs = await prisma.job.findMany({
        where: {
          status: 'OPEN',
          id: {
            notIn: appliedJobIds
          }
        }
      });
      
      // TODO: Implement real candidate skill extraction from applications/profile
      const candidateSkills = ['JavaScript', 'React', 'Node.js']; // Example skills
      
      // Match each job
      const jobMatches = await Promise.all(
        availableJobs.map(async (job) => {
          // Simple matching based on skills
          const skillMatchScore = this.matchSkills(candidateSkills, job.skills);
          
          return {
            job,
            score: Math.round(skillMatchScore * 100)
          };
        })
      );
      
      // Sort by score and limit results
      return jobMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      
    } catch (error) {
      logger.error(`Error finding matching jobs: ${error}`);
      return [];
    }
  }
}

export const jobMatcher = new JobMatcher();