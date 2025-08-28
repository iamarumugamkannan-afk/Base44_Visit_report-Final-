# CANNA Visit Reports - Standalone Application

A complete, production-ready visit reporting system for CANNA sales representatives. This application allows sales teams to document shop visits, track product visibility, manage customer relationships, and generate comprehensive reports.

## 🚀 Features

- **Visit Management**: Create, edit, and track shop visits with comprehensive data collection
- **Customer Database**: Manage shop information and contact details
- **Product Visibility**: Track CANNA product placement and competitor analysis
- **Sales Analytics**: Generate insights from visit data and sales performance
- **Photo Documentation**: Upload and manage visit photos with drag-and-drop interface
- **Digital Signatures**: Capture customer signatures for visit confirmation
- **PDF Reports**: Generate professional PDF reports for each visit
- **Role-Based Access**: Admin, Manager, and Sales Rep roles with appropriate permissions
- **Real-time Dashboard**: Overview of recent visits, performance metrics, and action items

## 🛠 Technology Stack

### Frontend
- **React 18** with modern hooks and context
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **Framer Motion** for smooth animations and transitions
- **Radix UI** components for accessible, customizable UI elements
- **React Router** for client-side routing
- **Axios** for HTTP requests with interceptors
- **React Hook Form** with Zod validation
- **Date-fns** for date manipulation
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** with PostGIS for geospatial data
- **JWT** authentication with secure token handling
- **Multer** for file upload processing
- **Bcrypt** for password hashing
- **Express Rate Limiting** for API protection
- **Helmet** for security headers
- **Morgan** for request logging
- **CORS** configuration for cross-origin requests

### Infrastructure
- **Docker** and Docker Compose for containerization
- **Nginx** reverse proxy with SSL termination
- **PostgreSQL** with automated backups
- **File storage** with organized directory structure
- **Health checks** and monitoring endpoints

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 15+ with PostGIS extension
- **Docker** and Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd canna-visit-reports
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp server/.env.example server/.env
   
   # Edit the .env files with your configuration
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL (if using Docker)
   docker run --name canna-postgres -e POSTGRES_DB=canna_visits -e POSTGRES_USER=canna_user -e POSTGRES_PASSWORD=canna_password -p 5432:5432 -d postgis/postgis:15-3.3
   
   # Run migrations
   cd server
   npm run migrate
   
   # Seed initial data
   npm run seed
   ```

5. **Start Development Servers**
   ```bash
   # Start backend (from server directory)
   cd server
   npm run dev
   
   # Start frontend (from root directory)
   cd ..
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - Demo credentials:
     - Admin: admin@canna.com / admin123
     - Sales Rep: sales@canna.com / user123

### Production Deployment with Docker

1. **Configure Environment**
   ```bash
   # Update docker-compose.yml with production settings
   # Set strong passwords and JWT secrets
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Initialize Database**
   ```bash
   # Run migrations
   docker-compose exec api npm run migrate
   
   # Seed initial data
   docker-compose exec api npm run seed
   ```

4. **Access Production Application**
   - Application: http://localhost (or your domain)
   - API: http://localhost/api

## 📁 Project Structure

```
canna-visit-reports/
├── src/                          # Frontend source code
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── reports/            # Report-related components
│   │   └── visit-form/         # Visit form sections
│   ├── contexts/               # React contexts (Auth, etc.)
│   ├── lib/                    # Utility libraries
│   ├── pages/                  # Page components
│   ├── services/               # API service classes
│   └── utils/                  # Helper functions
├── server/                      # Backend source code
│   ├── config/                 # Database and app configuration
│   ├── middleware/             # Express middleware
│   ├── routes/                 # API route handlers
│   ├── scripts/                # Database scripts
│   └── uploads/                # File upload storage
├── supabase/migrations/        # Database migration files
├── nginx/                      # Nginx configuration
├── docker-compose.yml          # Docker orchestration
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=CANNA Visit Reports
VITE_UPLOAD_MAX_SIZE=10485760
```

#### Backend (server/.env)
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/canna_visits
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Database Configuration

The application uses PostgreSQL with PostGIS for geospatial features. The database schema includes:

- **Users**: Authentication and role management
- **Customers**: Shop and contact information
- **Shop Visits**: Main visit reports with comprehensive data
- **Configurations**: System settings and dropdown options
- **File Uploads**: File management and tracking

## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Role-Based Access Control** (Admin, Manager, Sales Rep)
- **Password Hashing** with bcrypt
- **Rate Limiting** on authentication endpoints
- **Input Validation** with express-validator
- **SQL Injection Protection** with parameterized queries
- **File Upload Security** with type and size validation
- **CORS Configuration** for cross-origin protection
- **Security Headers** with Helmet.js

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update current user profile

### Visit Management
- `GET /api/visits` - List visits (with filtering)
- `POST /api/visits` - Create new visit
- `GET /api/visits/:id` - Get visit by ID
- `PUT /api/visits/:id` - Update visit
- `DELETE /api/visits/:id` - Delete visit

### Customer Management
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer (Manager/Admin only)
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer (Manager/Admin only)
- `DELETE /api/customers/:id` - Delete customer (Admin only)

### File Uploads
- `POST /api/uploads/single` - Upload single file
- `POST /api/uploads/multiple` - Upload multiple files
- `GET /api/uploads/files/:filename` - Serve uploaded file
- `DELETE /api/uploads/:id` - Delete uploaded file

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server
npm test

# Run integration tests
npm run test:integration
```

## 📈 Performance Optimization

- **Database Indexing** on frequently queried columns
- **Image Optimization** with automatic compression
- **Lazy Loading** for large datasets
- **Caching** with appropriate cache headers
- **Gzip Compression** for static assets
- **Connection Pooling** for database connections

## 🔄 Backup and Recovery

### Database Backups
```bash
# Create backup
docker-compose exec postgres pg_dump -U canna_user canna_visits > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U canna_user canna_visits < backup.sql
```

### File Backups
```bash
# Backup uploaded files
docker-compose exec api tar -czf /tmp/uploads-backup.tar.gz /app/uploads
docker cp canna_api:/tmp/uploads-backup.tar.gz ./uploads-backup.tar.gz
```

## 🚀 Deployment Options

### Docker Compose (Recommended)
Complete containerized deployment with all services.

### Manual Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Build and deploy frontend to static hosting
4. Deploy backend to Node.js hosting service

### Cloud Deployment
- **AWS**: ECS/Fargate with RDS PostgreSQL
- **Google Cloud**: Cloud Run with Cloud SQL
- **Azure**: Container Instances with Azure Database
- **DigitalOcean**: App Platform with Managed Database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation at `/api/docs` when running

## 🔄 Version History

- **v1.0.0** - Initial standalone release
  - Complete Base44 dependency removal
  - Full PostgreSQL integration
  - Docker containerization
  - Production-ready security features