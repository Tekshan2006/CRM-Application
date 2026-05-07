# CRM Lead Management System

A full-stack CRM (Customer Relationship Management) application built with **Next.js**, **Node.js + Express**, and **MySQL**. This system allows sales teams to manage leads, track their progress through a sales pipeline, add notes, and view performance analytics.

## 🎯 Features

### Core Features
- ✅ **User Authentication** - Email/password login with JWT tokens
- ✅ **Lead Management** - Create, read, update, and delete leads
- ✅ **Lead Status Tracking** - Track leads through sales pipeline (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- ✅ **Lead Notes** - Add internal notes to track communications and follow-ups
- ✅ **Dashboard** - View key metrics (total leads, new leads, qualified leads, won deals, etc.)
- ✅ **Search & Filtering** - Filter leads by status, source, and search by name/company/email
- ✅ **Lead Details** - Comprehensive view of each lead with contact info and notes
- ✅ **Data Persistence** - All data persisted in MySQL database

### Lead Attributes
- Lead Name
- Company Name
- Email
- Phone Number
- Lead Source (Website, LinkedIn, Referral, Cold Email, Event)
- Status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
- Estimated Deal Value
- Assigned Salesperson
- Created Date
- Last Updated Date

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework for production
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Zustand** - State management
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MySQL 2** - Database driver
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database

## 📋 Prerequisites

Before running the project, make sure you have:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v5.7 or higher)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd crm-system
```

### 2. Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your MySQL configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=crm_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

#### 2.3 Initialize Database
```bash
npm run migrate
```

This will:
- Create the `crm_db` database
- Create all required tables (users, leads, notes)
- Create test admin user (admin@example.com / password123)

#### 2.4 Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Configure Environment Variables
The `.env.local` file is already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### 3.3 Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Test Credentials

Use these credentials to log in:
- **Email**: admin@example.com
- **Password**: password123

You can also register a new account at the registration page.

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'salesperson',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

### Leads Table
```sql
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  lead_source VARCHAR(100),
  assigned_salesperson_id INT,
  status VARCHAR(50) DEFAULT 'New',
  deal_value DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (assigned_salesperson_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
)
```

### Notes Table
```sql
CREATE TABLE notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id INT NOT NULL,
  content TEXT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Leads
- `GET /api/leads` - Get all leads (with filters)
- `GET /api/leads/:id` - Get lead details
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/dashboard/stats` - Get dashboard statistics

### Notes
- `POST /api/notes` - Add note to lead
- `GET /api/notes/lead/:leadId` - Get notes for a lead
- `DELETE /api/notes/:id` - Delete note

## 📱 Frontend Pages

- `/` - Home (redirects to dashboard or login)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard with statistics
- `/leads` - List all leads with filtering
- `/leads/new` - Create new lead
- `/leads/:id` - View lead details and notes
- `/leads/:id/edit` - Edit lead information

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Color-Coded Status** - Easy visual identification of lead status
- **Real-time Filtering** - Filter leads by status and source
- **Search Functionality** - Search leads by name, company, or email
- **Clean Dashboard** - Key metrics at a glance
- **Intuitive Forms** - Easy-to-use forms for creating and editing leads
- **Status Badges** - Visual indicators for lead status and source

## 🐛 Known Limitations

1. **Single User Per Session** - Currently supports one logged-in user at a time per browser
2. **No Email Notifications** - System doesn't send email notifications
3. **No Advanced Reporting** - Limited to basic dashboard statistics
4. **No Bulk Operations** - Cannot perform bulk actions on multiple leads
5. **No File Attachments** - Cannot attach files to leads or notes
6. **Basic Auth** - No OAuth or SSO integration
7. **No Real-time Updates** - No WebSocket support for real-time collaboration

## 🔒 Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT token-based authentication
- ✅ Input validation on both client and server
- ✅ CORS enabled for frontend domain
- ✅ Environment variables for sensitive data
- ⚠️ IMPORTANT: Change `JWT_SECRET` in production
- ⚠️ IMPORTANT: Do not commit `.env` file with secrets

## 📈 Performance Optimizations

- Database connection pooling
- Query optimization with indexes
- Frontend code splitting with Next.js
- CSS optimization with Tailwind
- Efficient state management with Zustand

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables on hosting platform
2. Ensure MySQL database is accessible
3. Deploy Node.js application

### Frontend Deployment (e.g., Vercel, Netlify)
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy automatically on push

## 📝 Reflection & Learning

### What Went Well
- Clean separation of concerns (frontend/backend)
- Comprehensive CRUD functionality
- Responsive UI with Tailwind CSS
- Proper authentication with JWT
- Database relationships and integrity

### Challenges Overcome
- Managing state across multiple components
- API integration and error handling
- Database schema design for relational data
- Responsive design across devices

### Future Improvements
1. Add real-time notifications
2. Implement advanced filtering and sorting
3. Add email integration
4. Build reporting and analytics features
5. Implement user roles and permissions
6. Add activity tracking and audit logs
7. Mobile app version
8. AI-powered lead scoring

## 📧 Support

For issues or questions, please create a GitHub issue or contact the development team.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ for sales teams**
