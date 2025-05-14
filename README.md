# Sports Events Management System

A full-stack application for managing sports events, registrations, teams, and payments.

## Project Overview

This application allows users to:
- Register and manage user accounts with different roles (admin, organizer, participant, team manager)
- Browse and filter sports events
- Create and manage teams
- Register for events (individually or as teams)
- Process payments
- View dashboards specific to user roles
- Provide feedback on events

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Chart.js for data visualization
- Zustand for state management

### Backend
- Flask (Python) for the REST API
- PostgreSQL for database
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v16+) and npm
- Python 3.8+ 
- PostgreSQL
- Docker and Docker Compose (optional, but recommended)

### Quick Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/sports-events.git
   cd sports-events
   ```

2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```
   
   This script will:
   - Create a `.env` file with default configuration
   - Install frontend dependencies
   - Start Docker containers (PostgreSQL, PGAdmin, and the backend server)
   - Initialize the database
   - Start the frontend development server

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - PGAdmin: http://localhost:3000 (admin@example.com / adminpassword)

### Manual Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/sports-events.git
   cd sports-events
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   npm run server:install
   ```

### Configuration

1. **Database Configuration**

   Create a `.env` file in the `DBMS/server` directory with the following variables:
   ```
   POSTGRES_USER=genai_super
   POSTGRES_PASSWORD=mypassword
   POSTGRES_DB=mydb
   POSTGRES_HOST=0.0.0.0  # Use 'postgres' if using Docker Compose
   POSTGRES_PORT=5432
   JWT_SECRET_KEY=your-secret-key-here
   ```

2. **Frontend Configuration**

   Create a `.env` file in the root directory with your Supabase configuration (if using Supabase features):
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## Running the Application

### Using Docker Compose

1. **Start all services (PostgreSQL, PGAdmin, and backend server):**
   ```bash
   docker-compose up -d
   ```

   This will:
   - Start PostgreSQL database with the database schema
   - Start PGAdmin for database management
   - Start the Flask backend server
   - Initialize the database automatically

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - PGAdmin: http://localhost:3000

4. **PGAdmin Credentials:**
   - Email: admin@example.com
   - Password: adminpassword

5. **Database Connection in PGAdmin:**
   - Host: postgres
   - Port: 5432
   - Database: mydb
   - Username: genai_super
   - Password: mypassword

### Running Locally (without Docker)

1. **Start PostgreSQL**
   
   Make sure your PostgreSQL instance is running on your machine or accessible via network.

2. **Initialize the database:**
   ```bash
   npm run server:init-db
   ```

3. **Start the backend server:**
   ```bash
   npm run server:postgres
   ```

4. **Start the frontend development server in another terminal:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get authentication token

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create a new event (admin/organizer only)
- `PUT /api/events/:id` - Update event (admin/organizer only)
- `DELETE /api/events/:id` - Delete event (admin/organizer only)

### Registrations
- `POST /api/registrations` - Register for an event
- `PUT /api/registrations/:id` - Update registration status (admin/organizer only)

### Teams
- Team management endpoints will be documented here

## Database Setup

The application uses PostgreSQL with ParadeDB extensions for enhanced functionality. The database schema includes the following tables:

- **users**: User accounts with different roles
- **events**: Sports events with details and status
- **teams**: Teams created by users
- **team_members**: Mapping between teams and users
- **registrations**: Event registrations by users or teams
- **payments**: Payment records for registrations
- **feedback**: User feedback and ratings for events
- **results**: Event results and rankings
- **communication_logs**: System communication logs

The database is automatically initialized when running with Docker Compose using the `db_init.sql` script. If you need to manually initialize the database, you can run:

```bash
# When using Docker
docker-compose exec backend python init_db.py

# Or when running locally
npm run server:init-db
```

## Folder Structure

```
sports-events/
├── DBMS/                 # Main application directory
│   ├── server/           # Backend code
│   │   ├── service/      # Business logic services
│   │   ├── app_postgres.py # Flask application with PostgreSQL
│   │   ├── app.py        # Original Flask application
│   │   ├── app2.py       # Alternative Flask application
│   │   ├── db.py         # Database utilities
│   │   ├── init_db.py    # Database initialization script
│   │   ├── Dockerfile    # Docker configuration for backend
│   │   └── requirements.txt # Python dependencies
│   ├── src/              # Frontend React code
│   │   ├── components/   # React components
│   │   ├── context/      # React context providers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
├── db_init.sql           # Database initialization SQL script
├── docker-compose.yml    # Docker Compose configuration
├── setup.sh              # Setup script for quick start
├── .env                  # Environment variables (create this file)
└── package.json          # Node.js dependencies
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```