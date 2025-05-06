import path from 'path';
import fs from 'fs';
import { logger } from './logger';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { jobMatcher } from './jobMatcher';

const readFileAsync = promisify(fs.readFile);

interface ResumeData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedIn?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  skills?: string[];
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    from: Date;
    to?: Date;
    current: boolean;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    description: string;
    from: Date;
    to?: Date;
    current: boolean;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  certifications?: string[];
  languages?: string[];
}

/**
 * Parse resume file and extract structured data
 * 
 * In a production environment, this would integrate with a real resume parsing API
 * or use a more sophisticated parsing library. For this example, we're implementing
 * a simplified version.
 */
export const parseResume = async (resumePath: string): Promise<ResumeData> => {
  try {
    logger.info(`Parsing resume: ${resumePath}`);
    
    // Get the absolute path
    let localPath = resumePath;
    if (resumePath.startsWith('/uploads/')) {
      localPath = path.join(__dirname, '../../', resumePath);
    }
    
    // Check if file exists
    if (!fs.existsSync(localPath)) {
      throw new Error(`Resume file not found at path: ${localPath}`);
    }
    
    // Extract file extension
    const fileExtension = path.extname(localPath).toLowerCase();
    
    // Initialize resume data
    const resumeData: ResumeData = {
      personalInfo: {},
      skills: [],
      education: [],
      experience: []
    };
    
    // Parse based on file type
    if (fileExtension === '.pdf') {
      await parsePdf(localPath, resumeData);
    } else if (['.doc', '.docx'].includes(fileExtension)) {
      await parseWord(localPath, resumeData);
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }
    
    // Extract skills from resume text
    await extractSkills(resumeData);
    
    logger.info(`Resume parsed successfully: ${resumePath}`);
    return resumeData;
    
  } catch (error) {
    logger.error(`Error parsing resume: ${error}`);
    throw new Error(`Resume parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Parse PDF file using external tools
 * 
 * In a real implementation, this would use a proper PDF parsing library
 * or service like pdfjs-dist, pdf-parse, or a third-party API.
 */
async function parsePdf(filePath: string, resumeData: ResumeData): Promise<void> {
  try {
    // This is a placeholder for PDF parsing logic
    // In a real implementation, we would use a proper PDF parsing library
    
    logger.info(`PDF parsing not fully implemented. Using mock data for ${filePath}`);
    
    // For demonstration purposes, populate with mock data based on filename
    const filename = path.basename(filePath);
    
    // Simple mock data
    resumeData.personalInfo = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      linkedIn: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe'
    };
    
    resumeData.skills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git'];
    
    resumeData.education = [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        from: new Date('2015-09-01'),
        to: new Date('2019-05-31'),
        current: false
      }
    ];
    
    resumeData.experience = [
      {
        company: 'Tech Solutions Inc.',
        position: 'Software Engineer',
        description: 'Developed web applications using React and Node.js',
        from: new Date('2019-06-01'),
        to: new Date('2022-12-31'),
        current: false
      },
      {
        company: 'Innovation Labs',
        position: 'Senior Developer',
        description: 'Leading development team for cloud applications',
        from: new Date('2023-01-01'),
        to: undefined,
        current: true
      }
    ];
    
  } catch (error) {
    logger.error(`Error parsing PDF: ${error}`);
    throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse Word document
 * 
 * In a real implementation, this would use a proper Word document parsing library
 * or service like mammoth, docx-parser, or a third-party API.
 */
async function parseWord(filePath: string, resumeData: ResumeData): Promise<void> {
  try {
    // This is a placeholder for Word parsing logic
    // In a real implementation, we would use a proper Word parsing library
    
    logger.info(`Word parsing not fully implemented. Using mock data for ${filePath}`);
    
    // For demonstration purposes, populate with mock data based on filename
    const filename = path.basename(filePath);
    
    // Simple mock data - similar to PDF mock for simplicity
    resumeData.personalInfo = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      linkedIn: 'https://linkedin.com/in/janesmith',
      github: 'https://github.com/janesmith'
    };
    
    resumeData.skills = ['Java', 'Python', 'Spring', 'Docker', 'Kubernetes', 'AWS'];
    
    resumeData.education = [
      {
        institution: 'State University',
        degree: 'Master of Science',
        fieldOfStudy: 'Software Engineering',
        from: new Date('2017-09-01'),
        to: new Date('2019-05-31'),
        current: false
      }
    ];
    
    resumeData.experience = [
      {
        company: 'Enterprise Systems',
        position: 'Backend Developer',
        description: 'Built Java microservices with Spring Boot',
        from: new Date('2019-06-01'),
        to: new Date('2021-12-31'),
        current: false
      },
      {
        company: 'Cloud Technologies',
        position: 'DevOps Engineer',
        description: 'Managing Kubernetes clusters and CI/CD pipelines',
        from: new Date('2022-01-01'),
        to: undefined,
        current: true
      }
    ];
    
  } catch (error) {
    logger.error(`Error parsing Word document: ${error}`);
    throw new Error(`Word parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract skills from resume text using NLP techniques
 * 
 * In a real implementation, this would use NLP libraries or
 * ML-based skill extraction.
 */
async function extractSkills(resumeData: ResumeData): Promise<void> {
  try {
    // This is a placeholder for skill extraction
    // In a real implementation, we would use NLP or ML techniques
    
    // If skills are already populated, skip
    if (resumeData.skills && resumeData.skills.length > 0) {
      return;
    }
    
    // Extract skills from experience descriptions
    const skillKeywords = [
      // Programming languages
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift',
      // Frontend
      'React', 'Angular', 'Vue', 'HTML', 'CSS', 'SASS', 'LESS', 'Redux', 'Next.js', 'Gatsby',
      // Backend
      'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Ruby on Rails',
      // Databases
      'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB', 'Cassandra',
      // DevOps
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
      // Tools
      'Git', 'Webpack', 'Babel', 'NPM', 'Yarn', 'ESLint', 'Prettier'
    ];
    
    const extractedSkills = new Set<string>();
    
    // Extract from experience descriptions
    if (resumeData.experience) {
      for (const exp of resumeData.experience) {
        for (const skill of skillKeywords) {
          if (exp.description.includes(skill)) {
            extractedSkills.add(skill);
          }
        }
      }
    }
    
    // If no skills were extracted, add some default skills
    if (extractedSkills.size === 0) {
      extractedSkills.add('Communication');
      extractedSkills.add('Problem Solving');
      extractedSkills.add('Team Collaboration');
    }
    
    resumeData.skills = Array.from(extractedSkills);
    
  } catch (error) {
    logger.error(`Error extracting skills: ${error}`);
    // Don't throw here, just log the error and continue
  }
}

/**
 * Match resume with job requirements
 * 
 * This is a simple implementation. In a real app, this would use more
 * sophisticated matching algorithms or ML-based approaches.
 */
export const matchResumeWithJob = async (resumeData: ResumeData, jobId: number): Promise<number> => {
  try {
    return await jobMatcher.matchResumeWithJob(resumeData, jobId);
  } catch (error) {
    logger.error(`Error matching resume with job: ${error}`);
    return 0; // Return 0 match score on error
  }
};