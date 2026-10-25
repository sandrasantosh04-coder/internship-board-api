# Internship Board REST API

A RESTful API built using **Node.js, Express.js, and SQLite** to manage internship records. This project supports creating, retrieving, updating, deleting, validating, and paginating internship data.

## Technologies Used

- Node.js
- Express.js
- SQLite
- better-sqlite3
- JavaScript

## Features

- Create internship records
- Retrieve all internships with pagination
- Retrieve a single internship by ID
- Update internship details
- Delete internship records
- Validate incoming request data
- Handle duplicate internship IDs
- Persistent data storage using SQLite
- Seed sample internship records

## Project Structure

```text
internship-board-api/
├── database.js
├── server.js
├── seed.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

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

### 5. Start the server

```bash
node server.js
```

The API runs locally at:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Welcome message |
| GET | `/api/internships` | Retrieve internships with pagination |
| GET | `/api/internships/:id` | Retrieve an internship by ID |
| POST | `/api/internships` | Create an internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |

## Pagination

Use query parameters to retrieve internship records page by page.

Example:

```http
GET /api/internships?page=1&limit=2
```

The response includes:

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

The API validates internship data before creating or updating records.

- Required fields must be provided.
- Text fields must contain valid non-empty values.
- Skills must be provided as an array.
- Openings must be a positive integer.
- Duplicate internship IDs are rejected.

## HTTP Status Codes

| Status | Description |
|---|---|
| 200 | Request successful |
| 201 | Internship created |
| 400 | Invalid request data |
| 404 | Internship or endpoint not found |
| 409 | Duplicate internship ID |
| 500 | Internal server error |

## Database

The project uses SQLite for persistent storage.

The internship records are stored in the `internships` table.

The database file is generated locally and is excluded from Git using `.gitignore`.

## Sample Data

The project includes a seed script to insert sample internship records into the database.

Run:

```bash
node seed.js
```

## Project Objective

The objective of this project is to understand REST API development, CRUD operations, request validation, pagination, and persistent database integration using Node.js and Express.

## Author

Sandra Santhosh

GitHub: [sandrasantosh04-coder](https://github.com/sandrasantosh04-coder)
