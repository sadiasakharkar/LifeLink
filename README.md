# LifeLink

LifeLink is a production-oriented MVP for organ donation matching, allocation approval, audit logging, notifications, richer transport visibility, and weighted allocation scoring. It uses a React frontend and a serverless-friendly Node.js backend with DynamoDB persistence.

## Structure

- `frontend/` React + Vite + Tailwind + React Router
- `backend/` Express API structured for AWS Lambda
- `shared/` shared matching rules
- `docs/` schema and AWS deployment notes

## Demo Accounts

When `SEED_DEMO_DATA=true`, these accounts are created automatically with password `Password@123`.

- `admin@lifelink.org` (`Hospital Admin`)
- `doctor@lifelink.org` (`Doctor`)
- `transport@lifelink.org` (`Transport Team`)

## Run Locally

1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Copy environment files:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
3. Start DynamoDB Local:
   - `docker compose -f docker-compose.local.yml up -d`
4. Create tables:
   - `npm run ddb:create-tables`
5. Seed demo data:
   - `npm run ddb:seed`
6. Start backend:
   - `cd backend && npm run dev`
7. Start frontend:
   - `cd frontend && npm run dev`

## Core MVP Features

- JWT authentication with bcrypt password hashing
- Role-based access control for Admin, Doctor, and Transport Team
- DynamoDB-backed persistence for users, donors, recipients, allocations, and audit logs
- Local DynamoDB runtime support through `docker-compose.local.yml`
- Allocation approval workflow:
  - `PENDING`
  - `APPROVED`
  - `REJECTED`
- Weighted allocation scoring with ranked candidate previews
- Polling-based refresh so the UI remains serverless-safe
- Transport stage updates with persistent progress checkpoints
- Notification feed derived from real system activity
- Audit log viewer for compliance review
- Functional UI flows with loading states and toast feedback

## Deployment

See [docs/aws-free-tier-mvp.md](/Users/sadiasakharkar/Hackathons/LifeLink/organ-allocation-system/docs/aws-free-tier-mvp.md) for:

- DynamoDB schema design
- API endpoint list
- AWS Free Tier deployment steps
- environment variables
