
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

async function setup() {
    // Open SQLite connection
    const db = await open({
        filename: './questions.sqlite',
        driver: sqlite3.Database
    });

    // Define table schema
    await db.exec(`
        CREATE TABLE IF NOT EXISTS questions
        (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            title    TEXT,
            body     TEXT,
            category TEXT,
            rank     TEXT
        );
    `)

    // Close connection
    await db.close()
}

setup()
    .catch(err => {
        console.error(err.message)
    })