

const Database = require("better-sqlite3");

const db = new Database("internships.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS internships (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        mode TEXT NOT NULL,
        location TEXT NOT NULL,
        skills TEXT NOT NULL,
        openings INTEGER NOT NULL
    );
`);

console.log("Internship database table created!");

module.exports = db;
