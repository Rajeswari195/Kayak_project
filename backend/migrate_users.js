const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'rootpassword',
        database: 'kayak_db'
    });

    try {
        console.log('Adding SSN column...');
        await connection.query('ALTER TABLE users ADD COLUMN ssn VARCHAR(20) UNIQUE');
    } catch (e) {
        console.log('SSN column might already exist:', e.message);
    }

    try {
        console.log('Adding Credit Card column...');
        await connection.query('ALTER TABLE users ADD COLUMN credit_card_number VARCHAR(20)');
    } catch (e) {
        console.log('Credit Card column might already exist:', e.message);
    }

    console.log('Migration complete.');
    await connection.end();
}

migrate();
