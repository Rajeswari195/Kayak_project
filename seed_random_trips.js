const db = require('./backend/database/mysql_connection');

const OWNER_ID = 2; // Rahul Pillai

const TRIPS = [
    { origin: 'San Francisco', originCode: 'SFO', dest: 'Tokyo', destCode: 'NRT', airline: 'JAL', price: 1200 },
    { origin: 'New York', originCode: 'JFK', dest: 'London', destCode: 'LHR', airline: 'British Airways', price: 800 },
    { origin: 'Los Angeles', originCode: 'LAX', dest: 'Paris', destCode: 'CDG', airline: 'Air France', price: 1100 },
    { origin: 'Chicago', originCode: 'ORD', dest: 'Dubai', destCode: 'DXB', airline: 'Emirates', price: 1400 },
    { origin: 'Miami', originCode: 'MIA', dest: 'Toronto', destCode: 'YYZ', airline: 'Air Canada', price: 400 },
    { origin: 'Seattle', originCode: 'SEA', dest: 'Sydney', destCode: 'SYD', airline: 'Qantas', price: 1600 },
    { origin: 'Boston', originCode: 'BOS', dest: 'Frankfurt', destCode: 'FRA', airline: 'Lufthansa', price: 900 },
    { origin: 'Atlanta', originCode: 'ATL', dest: 'Amsterdam', destCode: 'AMS', airline: 'KLM', price: 1000 },
    { origin: 'Dallas', originCode: 'DFW', dest: 'Hong Kong', destCode: 'HKG', airline: 'Cathay Pacific', price: 1500 },
    { origin: 'Houston', originCode: 'IAH', dest: 'Singapore', destCode: 'SIN', airline: 'Singapore Airlines', price: 1700 }
];

const HOTELS = [
    'Grand Hyatt', 'Marriott Marquis', 'Hilton Garden Inn', 'Sheraton', 'Four Seasons', 'Ritz Carlton', 'InterContinental', 'Westin', 'Radisson Blu', 'Holiday Inn'
];

const CARS = [
    'Toyota Camry', 'Honda Accord', 'Ford Mustang', 'Chevrolet Tahoe', 'BMW 3 Series', 'Mercedes C-Class', 'Tesla Model 3', 'Jeep Wrangler', 'Audi A4', 'Nissan Altima'
];

async function seed() {
    try {
        console.log('Clearing existing data...');
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE hotels');
        await db.execute('TRUNCATE TABLE flights');
        await db.execute('TRUNCATE TABLE cars');
        await db.execute('TRUNCATE TABLE listings');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Seeding 10 Trips...');

        for (let i = 0; i < TRIPS.length; i++) {
            const trip = TRIPS[i];
            const hotelName = HOTELS[i];
            const carName = CARS[i];

            // 1. Create Flight
            const flightTitle = `${trip.originCode} to ${trip.destCode}`;
            const [fRes] = await db.execute(
                'INSERT INTO listings (type, title, description, location, price, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
                ['FLIGHT', flightTitle, `Non-stop flight from ${trip.origin} to ${trip.dest}`, trip.dest, trip.price, OWNER_ID]
            );
            await db.execute(
                'INSERT INTO flights (listing_id, airline, departure_time, arrival_time, origin, destination, flight_code, duration, flight_class, available_seats, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [fRes.insertId, trip.airline, '2025-12-10 10:00:00', '2025-12-11 14:00:00', trip.origin, trip.dest, `${trip.airline.substring(0, 2).toUpperCase()}${100 + i}`, '12h 00m', 'ECONOMY', 200, 4.5]
            );

            // 2. Create Hotel in Destination
            const hotelTitle = `${hotelName} ${trip.dest}`;
            const [hRes] = await db.execute(
                'INSERT INTO listings (type, title, description, location, price, owner_id, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                ['HOTEL', hotelTitle, `Luxury stay at ${hotelName} in ${trip.dest}`, trip.dest, 250.00, OWNER_ID, '123 Main St', trip.dest, 'State', '10001']
            );
            await db.execute(
                'INSERT INTO hotels (listing_id, stars, room_type, amenities, number_of_rooms, rating, images) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [hRes.insertId, 5, 'Deluxe Suite', 'Pool, Spa, WiFi, Gym', 100, 4.8, JSON.stringify(['https://example.com/hotel1.jpg', 'https://example.com/hotel2.jpg'])]
            );

            // 3. Create Car in Destination
            const carTitle = `${carName} Rental in ${trip.dest}`;
            const [cRes] = await db.execute(
                'INSERT INTO listings (type, title, description, location, price, owner_id, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                ['CAR', carTitle, `Rent a ${carName} in ${trip.dest}`, trip.dest, 80.00, OWNER_ID, 'Airport Rental Center', trip.dest, 'State', '10001']
            );
            await db.execute(
                'INSERT INTO cars (listing_id, car_type, brand, model, year, transmission, seats, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [cRes.insertId, 'Standard', carName.split(' ')[0], carName.split(' ').slice(1).join(' '), 2024, 'Automatic', 5, 4.5, 'AVAILABLE']
            );
        }

        console.log('\n--- TEST DATA GENERATED ---');
        console.log('Here are 10 combinations to test:');
        TRIPS.forEach((trip, i) => {
            console.log(`${i + 1}. Flight: ${trip.origin} (${trip.originCode}) -> ${trip.dest} (${trip.destCode})`);
            console.log(`   Hotel: ${HOTELS[i]} ${trip.dest}`);
            console.log(`   Car:   ${CARS[i]} Rental in ${trip.dest}`);
            console.log('------------------------------------------------');
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
