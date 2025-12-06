const db = require('./backend/database/mysql_connection');

async function listUsers() {
    try {
        const [rows] = await db.execute('SELECT id, email FROM users');
        console.log('Users:', rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listUsers();
