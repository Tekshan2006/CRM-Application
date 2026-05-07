# Backend API Documentation

## Overview
The backend is built with Node.js and Express, providing a RESTful API for the CRM system. It handles user authentication, lead management, and note management.

## Running the Backend

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Environment Variables

Create a `.env` file with:
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

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully"
}
```

### Leads

#### Get All Leads (with filters)
```
GET /api/leads?status=New&leadSource=Website&search=John
Authorization: Bearer <token>

Query Parameters:
- status: Filter by lead status
- leadSource: Filter by lead source
- assignedSalesperson: Filter by assigned salesperson ID
- search: Search by name, company, or email

Response:
[
  {
    "id": 1,
    "name": "John Smith",
    "company_name": "Acme Corp",
    "email": "john@acme.com",
    "phone_number": "555-1234",
    "lead_source": "Website",
    "assigned_salesperson_id": null,
    "status": "New",
    "deal_value": 5000,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "created_by": 1,
    "salesperson_name": null
  }
]
```

#### Get Single Lead
```
GET /api/leads/:id
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "name": "John Smith",
  "company_name": "Acme Corp",
  "email": "john@acme.com",
  "phone_number": "555-1234",
  "lead_source": "Website",
  "status": "New",
  "deal_value": 5000,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "salesperson_name": null,
  "notes": [
    {
      "id": 1,
      "lead_id": 1,
      "content": "Initial contact made",
      "created_by": 1,
      "created_at": "2024-01-15T11:00:00Z",
      "creator_name": "Admin User"
    }
  ]
}
```

#### Create Lead
```
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "companyName": "Tech Corp",
  "email": "jane@techcorp.com",
  "phoneNumber": "555-5678",
  "leadSource": "LinkedIn",
  "status": "New",
  "dealValue": 10000,
  "assignedSalespersonId": 2
}

Response:
{
  "id": 2,
  "message": "Lead created successfully"
}
```

#### Update Lead
```
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Qualified",
  "dealValue": 15000
}

Response:
{
  "message": "Lead updated successfully"
}
```

#### Delete Lead
```
DELETE /api/leads/:id
Authorization: Bearer <token>

Response:
{
  "message": "Lead deleted successfully"
}
```

#### Get Dashboard Stats
```
GET /api/leads/dashboard/stats
Authorization: Bearer <token>

Response:
{
  "total_leads": 25,
  "new_leads": 5,
  "qualified_leads": 8,
  "won_leads": 10,
  "lost_leads": 2,
  "total_deal_value": 250000,
  "won_deal_value": 150000
}
```

### Notes

#### Add Note
```
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "leadId": 1,
  "content": "Discussed pricing options. Client interested in premium plan."
}

Response:
{
  "id": 1,
  "message": "Note added successfully"
}
```

#### Get Notes for Lead
```
GET /api/notes/lead/:leadId
Authorization: Bearer <token>

Response:
[
  {
    "id": 1,
    "lead_id": 1,
    "content": "Discussed pricing options",
    "created_by": 1,
    "created_at": "2024-01-15T11:00:00Z",
    "creator_name": "Admin User"
  }
]
```

#### Delete Note
```
DELETE /api/notes/:id
Authorization: Bearer <token>

Response:
{
  "message": "Note deleted successfully"
}
```

## Error Handling

All errors return JSON with appropriate HTTP status codes:

```json
{
  "error": "Error message"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens expire in 7 days by default (configurable via JWT_EXPIRE).
