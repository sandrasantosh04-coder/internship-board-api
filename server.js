
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const db = require("./database");

const app = express();
const PORT = 3000;

// --------------------------------------------------
// 1. BASIC CONFIGURATION
// --------------------------------------------------

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enable SQLite foreign key support
db.pragma("foreign_keys = ON");

// --------------------------------------------------
// 2. CREATE APPLICATIONS TABLE
// --------------------------------------------------

db.exec(`
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        internship_id TEXT NOT NULL,
        applicant_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        resume_filename TEXT NOT NULL,
        cover_letter TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (internship_id)
            REFERENCES internships(id)
            ON DELETE CASCADE
    )
`);

// --------------------------------------------------
// 3. SECURITY MIDDLEWARE
// --------------------------------------------------

// Add secure HTTP headers
app.use(helmet());

// Limit JSON request size
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// General API rate limit
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);

// Stricter rate limit for applications
const applicationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many application attempts. Please try again later."
    }
});

// Log incoming requests
app.use((req, res, next) => {
    console.log("Request:", req.method, req.url);
    next();
});

// --------------------------------------------------
// 4. RESUME UPLOAD CONFIGURATION
// --------------------------------------------------

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        if (
            extension !== ".pdf" ||
            file.mimetype !== "application/pdf"
        ) {
            return callback(
                new Error("Only PDF resume files are allowed.")
            );
        }

        callback(null, true);
    }
});

// --------------------------------------------------
// 5. HELPER FUNCTIONS
// --------------------------------------------------

function parseSkills(skills) {
    if (typeof skills !== "string") {
        return skills;
    }

    try {
        return JSON.parse(skills);
    } catch {
        return skills;
    }
}

function validateInternship(data) {
    const { id, title, domain, mode, location, skills, openings } = data;

    if (
        !id ||
        !title ||
        !domain ||
        !mode ||
        !location ||
        skills === undefined ||
        openings === undefined
    ) {
        return "All internship fields are required.";
    }

    if (
        typeof id !== "string" ||
        typeof title !== "string" ||
        typeof domain !== "string" ||
        typeof mode !== "string" ||
        typeof location !== "string"
    ) {
        return "Invalid internship field values.";
    }

    if (
        !id.trim() ||
        !title.trim() ||
        !domain.trim() ||
        !mode.trim() ||
        !location.trim()
    ) {
        return "Internship fields cannot be empty.";
    }

    if (id.length > 50 || title.length > 150) {
        return "Internship ID or title is too long.";
    }

    if (!Array.isArray(skills) && typeof skills !== "string") {
        return "Skills must be an array or string.";
    }

    if (
        Array.isArray(skills) &&
        !skills.every(skill => typeof skill === "string")
    ) {
        return "Each skill must be a string.";
    }

    const openingsNumber = Number(openings);

    if (
        !Number.isInteger(openingsNumber) ||
        openingsNumber < 0
    ) {
        return "Openings must be a non-negative whole number.";
    }

    return null;
}

function formatInternship(internship) {
    return {
        ...internship,
        skills: parseSkills(internship.skills)
    };
}

// --------------------------------------------------
// 6. HOME / HEALTH ROUTES
// --------------------------------------------------

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Internship Board API is running."
    });
});

// --------------------------------------------------
// 7. GET ALL INTERNSHIPS WITH PAGINATION
// --------------------------------------------------

app.get("/api/internships", (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;

        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or limit value."
            });
        }

        const offset = (page - 1) * limit;

        const countResult = db.prepare(
            "SELECT COUNT(*) AS total FROM internships"
        ).get();

        const internships = db.prepare(`
            SELECT *
            FROM internships
            ORDER BY rowid
            LIMIT ? OFFSET ?
        `).all(limit, offset);

        res.json({
            success: true,
            page,
            limit,
            total: countResult.total,
            totalPages: Math.ceil(countResult.total / limit),
            data: internships.map(formatInternship)
        });

    } catch (error) {
        console.error("Get internships error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve internships."
        });
    }
});

// --------------------------------------------------
// 8. GET ONE INTERNSHIP
// --------------------------------------------------

app.get("/api/internships/:id", (req, res) => {
    try {
        const internship = db.prepare(
            "SELECT * FROM internships WHERE id = ?"
        ).get(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found."
            });
        }

        res.json({
            success: true,
            data: formatInternship(internship)
        });

    } catch (error) {
        console.error("Get internship error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve internship."
        });
    }
});

// --------------------------------------------------
// 9. ADD INTERNSHIP
// --------------------------------------------------

app.post("/api/internships", (req, res) => {
    try {
        const validationError = validateInternship(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const {
            id,
            title,
            domain,
            mode,
            location,
            skills,
            openings
        } = req.body;

        const result = db.prepare(`
            INSERT INTO internships
            (id, title, domain, mode, location, skills, openings)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            id.trim(),
            title.trim(),
            domain.trim(),
            mode.trim(),
            location.trim(),
            JSON.stringify(skills),
            Number(openings)
        );

        res.status(201).json({
            success: true,
            message: "Internship added successfully.",
            id: id.trim()
        });

    } catch (error) {
        console.error("Add internship error:", error);

        if (
            error.code === "SQLITE_CONSTRAINT_PRIMARYKEY" ||
            error.code === "SQLITE_CONSTRAINT_UNIQUE"
        ) {
            return res.status(409).json({
                success: false,
                message: "An internship with this ID already exists."
            });
        }

        res.status(500).json({
            success: false,
            message: "Unable to add internship."
        });
    }
});

// --------------------------------------------------
// 10. UPDATE INTERNSHIP
// --------------------------------------------------

app.put("/api/internships/:id", (req, res) => {
    try {
        const internshipId = req.params.id;

        const existingInternship = db.prepare(
            "SELECT id FROM internships WHERE id = ?"
        ).get(internshipId);

        if (!existingInternship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found."
            });
        }

        const validationError = validateInternship({
            ...req.body,
            id: internshipId
        });

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const {
            title,
            domain,
            mode,
            location,
            skills,
            openings
        } = req.body;

        db.prepare(`
            UPDATE internships
            SET title = ?,
                domain = ?,
                mode = ?,
                location = ?,
                skills = ?,
                openings = ?
            WHERE id = ?
        `).run(
            title.trim(),
            domain.trim(),
            mode.trim(),
            location.trim(),
            JSON.stringify(skills),
            Number(openings),
            internshipId
        );

        res.json({
            success: true,
            message: "Internship updated successfully."
        });

    } catch (error) {
        console.error("Update internship error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update internship."
        });
    }
});

// --------------------------------------------------
// 11. DELETE INTERNSHIP
// --------------------------------------------------

app.delete("/api/internships/:id", (req, res) => {
    try {
        const internship = db.prepare(
            "SELECT id FROM internships WHERE id = ?"
        ).get(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found."
            });
        }

        db.prepare(
            "DELETE FROM internships WHERE id = ?"
        ).run(req.params.id);

        res.json({
            success: true,
            message: "Internship deleted successfully."
        });

    } catch (error) {
        console.error("Delete internship error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete internship."
        });
    }
});

// --------------------------------------------------
// 12. SUBMIT INTERNSHIP APPLICATION
// --------------------------------------------------

app.post(
    "/api/applications",
    applicationLimiter,
    upload.single("resume"),
    async (req, res) => {
        let savedFilePath = null;

        try {
            const {
                internship_id,
                name,
                email,
                phone,
                cover_letter
            } = req.body;

            // Validate required fields
            if (!internship_id || !name || !email || !phone) {
                return res.status(400).json({
                    success: false,
                    message: "Please complete all required fields."
                });
            }

            const applicantName = name.trim();
            const applicantEmail = email.trim();
            const applicantPhone = phone.trim();
            const applicantCoverLetter = (cover_letter || "").trim();

            if (
                applicantName.length < 2 ||
                applicantName.length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name must contain 2 to 100 characters."
                });
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                applicantEmail.length > 254 ||
                !emailPattern.test(applicantEmail)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email address."
                });
            }

            if (!/^[0-9]{10}$/.test(applicantPhone)) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number must contain exactly 10 digits."
                });
            }

            if (applicantCoverLetter.length > 2000) {
                return res.status(400).json({
                    success: false,
                    message: "Cover letter cannot exceed 2000 characters."
                });
            }

            // Check internship exists
            const internship = db.prepare(
                "SELECT id FROM internships WHERE id = ?"
            ).get(internship_id);

            if (!internship) {
                return res.status(404).json({
                    success: false,
                    message: "Selected internship does not exist."
                });
            }

            // Check resume exists
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload your PDF resume."
                });
            }

            // Check actual PDF file signature
            const pdfSignature = req.file.buffer
                .subarray(0, 5)
                .toString();

            if (pdfSignature !== "%PDF-") {
                return res.status(400).json({
                    success: false,
                    message: "The uploaded file is not a valid PDF."
                });
            }

            // Generate a random filename
            const resumeFilename = crypto.randomUUID() + ".pdf";

            savedFilePath = path.join(
                uploadsDir,
                resumeFilename
            );

            // Save resume outside the public folder
            await fs.promises.writeFile(
                savedFilePath,
                req.file.buffer,
                { flag: "wx" }
            );

            // Save application details using a prepared statement
            db.prepare(`
                INSERT INTO applications
                (
                    internship_id,
                    applicant_name,
                    email,
                    phone,
                    resume_filename,
                    cover_letter
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(
                internship_id,
                applicantName,
                applicantEmail,
                applicantPhone,
                resumeFilename,
                applicantCoverLetter
            );

            res.status(201).json({
                success: true,
                message: "Your application was submitted successfully."
            });

        } catch (error) {
            console.error("Application submission error:", error);

            // Remove uploaded file if saving the application failed
            if (savedFilePath) {
                try {
                    await fs.promises.unlink(savedFilePath);
                } catch (cleanupError) {
                    console.error("Resume cleanup error:", cleanupError);
                }
            }

            res.status(500).json({
                success: false,
                message: "Unable to submit your application. Please try again."
            });
        }
    }
);

// --------------------------------------------------
// 13. SERVE FRONTEND FILES
// --------------------------------------------------

app.use(express.static(path.join(__dirname, "public")));

// --------------------------------------------------
// 14. HANDLE UNKNOWN API ROUTES
// --------------------------------------------------

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found."
    });
});

// --------------------------------------------------
// 15. GLOBAL ERROR HANDLER
// --------------------------------------------------

app.use((error, req, res, next) => {
    console.error("Server error:", error);

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Resume must not exceed 2 MB."
            });
        }

        return res.status(400).json({
            success: false,
            message: "Resume upload failed."
        });
    }

    if (
        error.message === "Only PDF resume files are allowed."
    ) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error instanceof SyntaxError && error.status === 400) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request."
        });
    }

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

// --------------------------------------------------
// 16. START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
