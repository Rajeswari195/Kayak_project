const db = require('./backend/database/mysql_connection');

async function findUser() {
    try {
        const email = 'rajeswari.premanand@usa.com';
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log('User found:');
            console.log('Email:', rows[0].email);
            console.log('Password:', rows[0].password);
        } else {
            console.log('User not found with email:', email);
            // List all users just in case of typo
            const [allUsers] = await db.execute('SELECT email, password FROM users');
            console.log('All users:', allUsers);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findUser();
