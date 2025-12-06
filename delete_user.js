const db = require('./backend/database/mysql_connection');

async function deleteUser() {
    try {
        const email = 'rajeswari.premanad@usa.com';

        // First get the ID
        const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            console.log('User not found.');
            process.exit(0);
        }

        const userId = users[0].id;
        console.log(`Deleting user with ID: ${userId} (${email})`);

        // Delete related data first to avoid FK constraints
        // Note: In a real app we might soft delete or cascade, but here we'll just try to delete.
        // If there are bookings/listings, this might fail if ON DELETE CASCADE isn't set.
        // Let's assume for this specific test user they might have empty data or we just try.
        // If it fails, I'll update the script to delete related data.

        await db.execute('DELETE FROM users WHERE id = ?', [userId]);
        console.log('User deleted successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error deleting user:', err);
        process.exit(1);
    }
}

deleteUser();
