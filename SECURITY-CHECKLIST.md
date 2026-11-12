
# Task 3 – Security Checklist

## Internship Board Application

### 1. Secure HTTP Headers
- [x] Helmet installed and configured.
- [x] Security response headers verified.
- [x] Content Security Policy enabled.

### 2. Rate Limiting
- [x] Express Rate Limit installed.
- [x] General API rate limit configured.
- [x] Application submission rate limit configured.
- [x] HTTP 429 response verified for excessive API requests.
- [ ] Application-specific rate limit final verification.

### 3. Input Validation
- [x] Required application fields checked.
- [x] Applicant name length validated.
- [x] Email format validated.
- [x] Phone number restricted to 10 digits.
- [x] Cover letter length restricted.
- [x] Internship ID checked against the database.

### 4. File Upload Security
- [x] Only PDF resume files accepted.
- [x] Maximum file size restricted to 2 MB.
- [x] PDF file signature checked on the server.
- [x] Random filenames generated for uploaded resumes.
- [x] Resume files stored outside the public folder.

### 5. Database Security
- [x] Parameterized SQL queries used.
- [x] SQLite foreign key support enabled.
- [x] Application records stored in the database.

### 6. Sensitive File Protection
- [x] `.env` excluded from Git.
- [x] Database file excluded from Git.
- [x] `uploads/` folder excluded from Git.
- [x] `node_modules/` excluded from Git.

### 7. Final Review
- [x] Frontend integrated with backend API.
- [x] Application submission tested.
- [x] Database persistence verified.
- [ ] Application-specific rate limit test completed.
- [ ] Final GitHub repository reviewed.
