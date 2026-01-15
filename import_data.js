const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function importData() {
    // Open SQLite database connection
    const db = await open({
        filename: './questions.sqlite',
        driver: sqlite3.Database
    });

    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

    // Insert data into the questions table
    for (const question of data.questions) {
        await db.run(
            'INSERT INTO questions (id, title, body, category, rank) VALUES (?, ?, ?, ?, ?)',
            [question.id, question.title, question.body, question.category, question.rank]
        );
    }


    // Close the database connection
    await db.close();
}

importData()
    .then(() => {
        console.log('Data imported successfully');
    })
    .catch((err) => {
        console.error('Error importing data:', err.message);
    });