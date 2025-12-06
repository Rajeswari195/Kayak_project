const db = require('./backend/database/mysql_connection');

async function migrate() {
    try {
        console.log('Starting Schema Migration v2...');

        // 1. Update Listings Table (Address fields)
        try {
            await db.execute('ALTER TABLE listings ADD COLUMN address VARCHAR(255)');
            await db.execute('ALTER TABLE listings ADD COLUMN city VARCHAR(100)');
            await db.execute('ALTER TABLE listings ADD COLUMN state VARCHAR(100)');
            await db.execute('ALTER TABLE listings ADD COLUMN zip_code VARCHAR(20)');
            console.log('Added address fields to listings table.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error updating listings:', e.message);
        }

        // 2. Update Hotels Table
        try {
            await db.execute('ALTER TABLE hotels ADD COLUMN number_of_rooms INT');
            await db.execute('ALTER TABLE hotels ADD COLUMN rating DECIMAL(3,1) DEFAULT 0.0');
            await db.execute('ALTER TABLE hotels ADD COLUMN images TEXT'); // JSON array
            console.log('Added fields to hotels table.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error updating hotels:', e.message);
        }

        // 3. Update Cars Table
        try {
            await db.execute('ALTER TABLE cars ADD COLUMN year INT');
            await db.execute('ALTER TABLE cars ADD COLUMN transmission VARCHAR(50)');
            await db.execute('ALTER TABLE cars ADD COLUMN seats INT');
            await db.execute('ALTER TABLE cars ADD COLUMN rating DECIMAL(3,1) DEFAULT 0.0');
            await db.execute("ALTER TABLE cars ADD COLUMN status ENUM('AVAILABLE', 'BOOKED', 'MAINTENANCE') DEFAULT 'AVAILABLE'");
            console.log('Added fields to cars table.');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error updating cars:', e.message);
        }

        console.log('Migration v2 Complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
