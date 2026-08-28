# TMS Backend - Node.js + MongoDB

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret:
```bash
cp .env.example .env
```

3. Create uploads directory:
```bash
mkdir uploads
```

4. Start the server:
```bash
npm run dev   # development with nodemon
npm start     # production
```

## Create SuperAdmin via Postman

POST http://localhost:5000/api/auth/register
Content-Type: application/json

```json
{
  "userName": "Super Admin",
  "phoneNumber": "9999999999",
  "email": "admin@tms.com",
  "password": "Admin@123",
  "roleName": "SuperAdmin"
}
```

## API Endpoints

### Auth
- POST /api/auth/register - Create user (Postman)
- POST /api/auth/login - Login, returns JWT

### Masters (SuperAdmin only)
- GET/POST/PUT/DELETE /api/departments
- GET/POST/PUT/DELETE /api/programmes
- GET/POST/PUT/DELETE /api/blocks
- GET/POST/PUT/DELETE /api/rooms
- GET/POST/PUT/DELETE /api/roles
- GET/POST/PUT/DELETE /api/users

### Complaints (All authenticated)
- GET /api/complaints/dashboard - Stats
- GET /api/complaints - List (filtered by role)
- POST /api/complaints - Create (User/SuperAdmin)
- PATCH /api/complaints/:id/assign - Assign (SuperAdmin)
- PATCH /api/complaints/:id/status - Update status (Staff)

### Reports (SuperAdmin only)
- GET /api/reports?department=&programme=&complaintType=&status=&assignee=

## Role-Based Access

| Feature | SuperAdmin | User | Staff/Technician |
|---------|-----------|------|-----------------|
| Master Screens | ✅ | ❌ | ❌ |
| Raise Complaint | ✅ | ✅ | ❌ |
| View All Complaints | ✅ | ❌ | ❌ |
| View Own Complaints | ✅ | ✅ | ❌ |
| View Assigned Complaints | ❌ | ❌ | ✅ |
| Assign Complaints | ✅ | ❌ | ❌ |
| Update Status | ✅ | ❌ | ✅ |
| Reports | ✅ | ❌ | ❌ |
