

const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// Track incoming requests
app.use((req, res, next) => {
    console.log("Request:", req.method, req.url);
    next();
});

// Welcome route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Internship Board API is running!",
        database: "SQLite connected"
    });
});

// GET all internships with pagination
app.get("/api/internships", (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        // Validate pagination
        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be at least 1 and limit must be between 1 and 100"
            });
        }

        const offset = (page - 1) * limit;

        // Get total internships
        const total = db.prepare(
            "SELECT COUNT(*) AS count FROM internships"
        ).get().count;

        // Get internships for the requested page
        const internships = db.prepare(
            "SELECT * FROM internships LIMIT ? OFFSET ?"
        ).all(limit, offset);

        // Convert skills JSON string into an array
        const formattedInternships = internships.map((internship) => ({
            ...internship,
            skills: JSON.parse(internship.skills)
        }));

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: formattedInternships
        });

    } catch (error) {
        console.error("Error retrieving internships:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve internships"
        });
    }
});

// GET internship by ID
app.get("/api/internships/:id", (req, res) => {
    try {
        const id = req.params.id;

        const internship = db.prepare(
            "SELECT * FROM internships WHERE id = ?"
        ).get(id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        const formattedInternship = {
            ...internship,
            skills: JSON.parse(internship.skills)
        };

        res.status(200).json({
            success: true,
            data: formattedInternship
        });

    } catch (error) {
        console.error("Error retrieving internship:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve internship"
        });
    }
});

// POST create a new internship
app.post("/api/internships", (req, res) => {
    try {
        const {
            id,
            title,
            domain,
            mode,
            location,
            skills,
            openings
        } = req.body;

        // Validate required fields
        if (
            !id ||
            !title ||
            !domain ||
            !mode ||
            !location ||
            !Array.isArray(skills) ||
            openings === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required. Skills must be an array."
            });
        }

        // Validate text fields
        if (
            typeof id !== "string" ||
            typeof title !== "string" ||
            typeof domain !== "string" ||
            typeof mode !== "string" ||
            typeof location !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Text fields must contain valid strings."
            });
        }

        // Validate text fields are not empty
        if (
            !id.trim() ||
            !title.trim() ||
            !domain.trim() ||
            !mode.trim() ||
            !location.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Text fields cannot be empty."
            });
        }

        // Validate skills
        if (
            skills.length === 0 ||
            !skills.every(
                skill => typeof skill === "string" && skill.trim() !== ""
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Skills must contain at least one valid string."
            });
        }

        // Validate openings
        if (!Number.isInteger(openings) || openings < 1) {
            return res.status(400).json({
                success: false,
                message: "Openings must be a positive integer."
            });
        }

        // Insert internship into database
        const insertInternship = db.prepare(`
            INSERT INTO internships
            (id, title, domain, mode, location, skills, openings)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        insertInternship.run(
            id.trim(),
            title.trim(),
            domain.trim(),
            mode.trim(),
            location.trim(),
            JSON.stringify(skills),
            openings
        );

        res.status(201).json({
            success: true,
            message: "Internship created successfully!",
            data: {
                id: id.trim(),
                title: title.trim(),
                domain: domain.trim(),
                mode: mode.trim(),
                location: location.trim(),
                skills,
                openings
            }
        });

    } catch (error) {
        // Handle duplicate internship ID
        if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
            return res.status(409).json({
                success: false,
                message: "Internship ID already exists."
            });
        }

        console.error("Error creating internship:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to create internship"
        });
    }
});

// PUT update an existing internship
app.put("/api/internships/:id", (req, res) => {
    console.log("PUT REQUEST RECEIVED");

    try {
        const id = req.params.id;

        const {
            title,
            domain,
            mode,
            location,
            skills,
            openings
        } = req.body;

        // Check whether internship exists
        const existingInternship = db.prepare(
            "SELECT * FROM internships WHERE id = ?"
        ).get(id);

        if (!existingInternship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        // Validate required fields
        if (
            !title ||
            !domain ||
            !mode ||
            !location ||
            !Array.isArray(skills) ||
            openings === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required. Skills must be an array."
            });
        }

        // Validate text fields
        if (
            typeof title !== "string" ||
            typeof domain !== "string" ||
            typeof mode !== "string" ||
            typeof location !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Text fields must contain valid strings."
            });
        }

        // Validate text fields are not empty
        if (
            !title.trim() ||
            !domain.trim() ||
            !mode.trim() ||
            !location.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Text fields cannot be empty."
            });
        }

        // Validate skills
        if (
            skills.length === 0 ||
            !skills.every(
                skill => typeof skill === "string" && skill.trim() !== ""
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Skills must contain at least one valid string."
            });
        }

        // Validate openings
        if (!Number.isInteger(openings) || openings < 1) {
            return res.status(400).json({
                success: false,
                message: "Openings must be a positive integer."
            });
        }

        // Update internship
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
            openings,
            id
        );

        res.status(200).json({
            success: true,
            message: "Internship updated successfully!",
            data: {
                id,
                title: title.trim(),
                domain: domain.trim(),
                mode: mode.trim(),
                location: location.trim(),
                skills,
                openings
            }
        });

    } catch (error) {
        console.error("Error updating internship:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to update internship"
        });
    }
});

// DELETE an internship
app.delete("/api/internships/:id", (req, res) => {
    try {
        const id = req.params.id;

        // Check whether internship exists
        const existingInternship = db.prepare(
            "SELECT * FROM internships WHERE id = ?"
        ).get(id);

        if (!existingInternship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        // Delete internship
        db.prepare(
            "DELETE FROM internships WHERE id = ?"
        ).run(id);

        res.status(200).json({
            success: true,
            message: "Internship deleted successfully!"
        });

    } catch (error) {
        console.error("Error deleting internship:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to delete internship"
        });
    }
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Handle invalid JSON and other errors
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format"
        });
    }

    console.error("Unexpected error:", error.message);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
