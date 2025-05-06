# Talent Spark Recruit - Backend

This is the backend API for the Talent Spark Recruit application, a comprehensive recruitment and applicant tracking system.

## Features

- Complete recruitment workflow management
- Role-based access control (RBAC)
- Job posting and application management
- Interview scheduling and feedback
- Offer management
- Budget tracking
- Resume parsing
- PostgreSQL database with Prisma ORM

## Tech Stack

- Node.js with Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT for authentication
- Multer for file uploads
- Joi for validation
- Winston for logging

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talent-spark-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration settings.

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the development server:
```bash
npm run dev
```

### Environment Variables

- `PORT`: Server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `ACCESS_TOKEN_EXPIRY`: JWT token expiry (default: 24h)
- `NODE_ENV`: Environment (development, production)

## API Structure

The API follows a RESTful structure:

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/jobs` - Job posting management
- `/api/applications` - Application management
- `/api/interviews` - Interview management
- `/api/locations` - Location management
- `/api/departments` - Department management
- `/api/offers` - Offer management
- `/api/budgets` - Budget management

## RBAC (Role-Based Access Control)

The system implements a comprehensive role-based access control system with the following roles:

- **Superadmin**: Complete system access
- **Admin**: Administrative access (excluding some sensitive operations)
- **Manager**: Department management and hiring process oversight
- **Recruiter**: Application processing and candidate management
- **Interviewer**: Interview scheduling and feedback
- **Candidate**: Limited access to own applications and public job listings

## Development

### Commands

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

### Database Management

- `npx prisma migrate dev`: Create and apply migrations
- `npx prisma db seed`: Seed the database with initial data
- `npx prisma studio`: Launch Prisma Studio for database visualization

## License

[MIT](LICENSE)