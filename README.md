
# Internship Board – REST API & Secure Application Integration

A full-stack Internship Board application developed using **HTML, CSS, Bootstrap, JavaScript, Node.js, Express.js, and SQLite**.

The application allows users to browse internship opportunities, search and filter internships, view internship details, and submit applications with PDF resumes.

This project was developed as part of the EdVyro Full Stack Development Virtual Internship.

## Technologies Used

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3

### Security
- Helmet
- Express Rate Limit
- Multer
- Server-side input validation

## Features

### Internship Management
- Create internship records
- Retrieve all internships with pagination
- Retrieve an internship by ID
- Update internship details
- Delete internship records
- Validate incoming request data
- Handle duplicate internship IDs
- Persistent data storage using SQLite

### Frontend Integration
- Load internship data from the backend API
- Display internship cards dynamically
- Search internships
- Filter by domain and work mode
- View internship details
- Display loading and error states
- Retry failed API requests

### Application Management
- Submit internship applications
- Validate applicant details
- Upload PDF resumes
- Restrict resume uploads to 2 MB
- Store application details in SQLite
- Store uploaded resumes in a private folder

### Security Features
- Helmet security headers
- API rate limiting
- Application submission rate limiting
- Client-side and server-side validation
- Parameterized SQL queries
- PDF file type and signature validation
- Random filenames for uploaded resumes
- Private resume storage outside the public folder

## Project Structure

```text
internship-board-api/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads/
│   └── Generated PDF resumes (local only)
│
├── database.js
├── server.js
├── seed.js
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── TEST-REPORT.md
└── SECURITY-CHECKLIST.md
```

Note: The `uploads/` folder and SQLite database are excluded from Git.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/sandrasantosh04-coder/internship-board-api.git
```

### 2. Navigate to the project directory

```bash
cd internship-board-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Seed the database

```bash
node seed.js
```

Run this command to insert the sample internship records when setting up the project for the first time.

### 5. Start the server

```bash
node server.js
```

The application runs locally at:

http://localhost:3000

Open this address in your browser to access the Internship Board.

## API Endpoints

### Internship Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/internships` | Retrieve internships with pagination |
| GET | `/api/internships/:id` | Retrieve an internship by ID |
| POST | `/api/internships` | Create an internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |
| GET | `/api/health` | Check API availability |

### Application Endpoint

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Submit an internship application |

The application endpoint accepts multipart form data containing:

- `internship_id`
- `name`
- `email`
- `phone`
- `cover_letter`
- `resume`

The resume must be a valid PDF file not exceeding 2 MB.

## Pagination

Internship records can be retrieved using pagination.

Example:

```http
GET /api/internships?page=1&limit=2
```

The API response includes:

- `success`
- `page`
- `limit`
- `total`
- `totalPages`
- `data`

## Sample Internship Data

```json
{
  "id": "INT-106",
  "title": "Backend Developer Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "India",
  "skills": ["Node.js", "Express", "SQLite"],
  "openings": 2
}
```

## Validation

The application performs validation on both the frontend and backend.

- Required application fields must be provided.
- Applicant names must contain 2–100 characters.
- Email addresses must have a valid format.
- Phone numbers must contain exactly 10 digits.
- Cover letters cannot exceed 2000 characters.
- Internship IDs must exist before applications are submitted.
- Only PDF resumes are accepted.
- Resume file size is limited to 2 MB.
- Internship records are validated before creation or updating.

## Security Implementation

### Helmet
Adds security-related HTTP response headers.

### Rate Limiting
- General API limit: 100 requests per 15 minutes.
- Application submission limit: 5 requests per 15 minutes.

### Database Security
Parameterized SQL queries are used for database operations to reduce SQL injection risks.

### File Upload Security
- PDF extension and MIME type validation.
- Server-side PDF signature verification.
- Maximum file size of 2 MB.
- Randomly generated filenames.
- Uploaded resumes stored outside the public directory.

## HTTP Status Codes

| Status | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request data |
| 404 | Resource or endpoint not found |
| 409 | Duplicate internship ID |
| 429 | Too many requests |
| 500 | Internal server error |

## Database

The application uses SQLite for persistent data storage.

The database contains:

- `internships` – Stores internship information.
- `applications` – Stores applicant information and resume filenames.

Uploaded PDF resumes are stored separately in the local `uploads/` directory.

## Testing and Documentation

The following documentation files are included:

- `TEST-REPORT.md` – Integration, validation and security test results.
- `SECURITY-CHECKLIST.md` – Security implementation checklist.

## Project Objective

The objective of this project is to understand REST API development, CRUD operations, frontend-backend integration, persistent database storage, application form handling, input validation, file upload security, and API protection using Node.js and Express.js.

## Author

**Sandra Santhosh**

GitHub: https://github.com/sandrasantosh04-coder
