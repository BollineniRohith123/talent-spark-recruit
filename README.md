# TalentSpark Recruit

## Project Overview

TalentSpark Recruit is an advanced AI-powered recruitment platform specifically designed for US-based recruiting consultancies. The platform streamlines the hiring process while maximizing profits through a sophisticated two-level profit tracking system.

### Key Features

- **Role-Based Access Control**: Tailored dashboards and permissions for Company Admins, Hiring Managers, Talent Scouts, Team Members, and Applicants
- **Profit Optimization**: Two-level profit tracking (client-to-company and company-to-candidate) with configurable splits
- **AI-Powered Matching**: Resume parsing and semantic matching using Retrieval-Augmented Generation (RAG)
- **Automated Screening**: Integration with Ultravox AI for voice-based candidate screening
- **Comprehensive Analytics**: Detailed profit metrics, hiring efficiency, and team performance tracking
- **Hierarchical Organization Structure**: Branch-based management with locations, departments, and teams

## Current Implementation Status

The application currently has a fully implemented frontend with comprehensive UI components for all major features. The platform includes:

- ✅ Role-specific dashboards with appropriate metrics and visualizations
- ✅ Two-level profit tracking system with detailed analytics
- ✅ Job creation with profit configuration and real-time calculation
- ✅ Resume upload and candidate matching simulation
- ✅ Team and profile management interfaces
- ✅ Budget allocation and tracking with profit metrics
- ✅ Interview scheduling and feedback collection

See [Presentstatus.md](./Presentstatus.md) for a detailed breakdown of implemented features and pending items.

## Development Setup

### Prerequisites

- Node.js (v16+) & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Git

### Local Development

```sh
# Clone the repository
git clone https://github.com/BollineniRohith123/talent-spark-recruit.git

# Navigate to the project directory
cd talent-spark-recruit

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:8080

### Demo Credentials

You can access different role-specific dashboards using these credentials:

- **Company Admin**: admin@talentspark.com / admin123
- **Hiring Manager**: manager@talentspark.com / manager123
- **Talent Scout**: scout@talentspark.com / scout123
- **Team Member**: member@talentspark.com / member123
- **Applicant**: applicant@example.com / applicant123

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Shadcn UI components with Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## Deployment

The application is deployed on Vercel and can be accessed at:
[https://talent-spark-recruit.vercel.app](https://talent-spark-recruit.vercel.app)

### Deployment Instructions

1. Push changes to the GitHub repository
2. Vercel automatically deploys the updated code
3. Check deployment status in the Vercel dashboard

## Project Documentation

For more detailed information about the project, refer to these documents:

- [All About Project](./allaboutproject.md) - Comprehensive project documentation
- [Present Status](./Presentstatus.md) - Current implementation status
- [Tasks and Subtasks](./tasks-and-subtasks.md) - Detailed task breakdown and roadmap
- [User Flows](./flows.md) - Role-specific user flows and interactions

## License

This project is proprietary software. All rights reserved.
