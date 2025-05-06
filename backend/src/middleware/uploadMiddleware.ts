import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
const resumeDir = path.join(uploadDir, 'resumes');
const profileImagesDir = path.join(uploadDir, 'profiles');

// Ensure directories exist
[uploadDir, resumeDir, profileImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created directory: ${dir}`);
  }
});

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    } else if (file.fieldname === 'profileImage') {
      cb(null, profileImagesDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'resume') {
    // Allow PDFs, DOCs, DOCXs
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  } else if (file.fieldname === 'profileImage') {
    // Allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed.'));
    }
  } else {
    // Default - accept all files
    cb(null, true);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Middleware for handling resume uploads
export const uploadResume = (req: Request, res: Response, next: NextFunction) => {
  const uploader = upload.single('resume');
  
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      logger.error(`Multer upload error: ${err.message}`);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'File too large. Maximum size is 10MB.'
        });
      }
      
      return res.status(400).json({
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // Other errors
      logger.error(`Upload error: ${err.message}`);
      return res.status(400).json({
        message: err.message
      });
    }
    
    // If file was uploaded, add the path to the request
    if (req.file) {
      // Store the path relative to the uploads directory
      const relativePath = `/uploads/resumes/${path.basename(req.file.path)}`;
      req.body.resumeUrl = relativePath;
      logger.info(`Resume uploaded: ${relativePath}`);
    }
    
    next();
  });
};

// Middleware for handling profile image uploads
export const uploadProfileImage = (req: Request, res: Response, next: NextFunction) => {
  const uploader = upload.single('profileImage');
  
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload
      logger.error(`Multer upload error: ${err.message}`);
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          message: 'File too large. Maximum size is 10MB.'
        });
      }
      
      return res.status(400).json({
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // Other errors
      logger.error(`Upload error: ${err.message}`);
      return res.status(400).json({
        message: err.message
      });
    }
    
    // If file was uploaded, add the path to the request
    if (req.file) {
      // Store the path relative to the uploads directory
      const relativePath = `/uploads/profiles/${path.basename(req.file.path)}`;
      req.body.avatarUrl = relativePath;
      logger.info(`Profile image uploaded: ${relativePath}`);
    }
    
    next();
  });
};

// Middleware for handling multiple document uploads
export const uploadDocuments = (fieldName: string, maxCount: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploader = upload.array(fieldName, maxCount);
    
    uploader(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during upload
        logger.error(`Multer upload error: ${err.message}`);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            message: 'File too large. Maximum size is 10MB.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            message: `Too many files. Maximum count is ${maxCount}.`
          });
        }
        
        return res.status(400).json({
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        // Other errors
        logger.error(`Upload error: ${err.message}`);
        return res.status(400).json({
          message: err.message
        });
      }
      
      // If files were uploaded, add the paths to the request
      if (req.files && Array.isArray(req.files)) {
        const filePaths = req.files.map(file => {
          const relativePath = `/uploads/${path.basename(file.path)}`;
          logger.info(`File uploaded: ${relativePath}`);
          return relativePath;
        });
        
        req.body[`${fieldName}Urls`] = filePaths;
      }
      
      next();
    });
  };
};