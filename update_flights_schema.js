const db = require('./backend/database/mysql_connection');

async function migrate() {
    try {
        console.log('Updating Flights table...');
        await db.execute(`
            ALTER TABLE flights
            ADD COLUMN flight_code VARCHAR(20),
            ADD COLUMN duration VARCHAR(50),
            ADD COLUMN flight_class ENUM('ECONOMY', 'BUSINESS', 'FIRST') DEFAULT 'ECONOMY',
            ADD COLUMN available_seats INT DEFAULT 0,
            ADD COLUMN rating DECIMAL(3, 1) DEFAULT 0.0
        `);
        console.log('Flights table updated.');

        console.log('Creating Reviews table...');
        await db.execute(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                listing_id INT NOT NULL,
                user_id INT NOT NULL,
                rating INT NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Reviews table created.');

        process.exit(0);
    } catch (err) {
        // Ignore "Duplicate column name" error if already run
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Columns already exist, skipping...');
            process.exit(0);
        }
        console.error(err);
        process.exit(1);
    }
}

migrate();
