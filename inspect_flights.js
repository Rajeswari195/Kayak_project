const db = require('./backend/database/mysql_connection');

async function inspect() {
    try {
        const [listings] = await db.execute('SELECT * FROM listings WHERE type="FLIGHT"');
        const [flights] = await db.execute('SELECT * FROM flights');

        console.log('Listings (Flights):');
        console.table(listings);

        console.log('Flights Details:');
        console.table(flights);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspect();
