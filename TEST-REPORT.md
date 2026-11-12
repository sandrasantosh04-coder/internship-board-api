
# Task 3 – Secure Application Integration
## Test Report

### 1. Project Information

- Project Name: Internship Board
- Task: Secure Application Integration
- Backend: Node.js and Express.js
- Database: SQLite
- Frontend: HTML, CSS, Bootstrap and JavaScript

### 2. Integration Testing

| Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|
| Load internship data | Data retrieved from API | Five internships displayed | PASS |
| Search internships | Matching results displayed | Search working | PASS |
| Filter by domain | Matching results displayed | Working | PASS |
| Filter by work mode | Matching results displayed | Working | PASS |
| Loading state | Loading message displayed | Working | PASS |
| Application submission | Application saved successfully | Successful submission | PASS |
| Database persistence | Application stored in SQLite | Record verified | PASS |

### 3. Form Validation Testing

| Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|
| Empty required fields | Validation message | Browser validation displayed | PASS |
| Invalid email | Email validation warning | Warning displayed | PASS |
| Invalid phone number | Phone format warning | Warning displayed | PASS |
| Invalid resume selection | PDF file restriction | Non-PDF selection prevented | PASS |
| Valid application | Application accepted | Successful submission | PASS |

### 4. Security Testing

| Security Feature | Test Result | Status |
|---|---|---|
| Helmet security headers | Security headers verified | PASS |
| General API rate limiting | HTTP 429 received after request limit | PASS |
| Application rate limiting | First five requests returned HTTP 400; next two returned HTTP 429 | PASS |
| Parameterized SQL queries | Used in database operations | IMPLEMENTED |
| Server-side application validation | Validation implemented | IMPLEMENTED |
| PDF upload validation | File type, size and PDF signature checks implemented | PASS |
| Private resume storage | Uploads stored outside public folder | IMPLEMENTED |

### 5. Database Verification

The application was successfully stored in the SQLite database.

Verified information:

- Application ID: 1
- Internship ID: INT-101
- Applicant Name: Test Applicant
- Email: test@example.com
- Phone: 9876543210
- Resume: Generated PDF filename

### 6. Conclusion

The Internship Board frontend was successfully integrated with the Express backend and SQLite database.

Internship data retrieval, search, filtering, application submission, database persistence, client-side validation, security headers and API rate limiting were tested successfully.

The application also includes server-side validation, secure PDF upload checks and parameterized database queries.
