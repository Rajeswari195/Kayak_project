const db = require('./backend/database/mysql_connection');

const hotels = [
    { title: 'Grand Hyatt New York', description: 'Luxury hotel in midtown Manhattan', location: 'New York, NY', price: 450.00, stars: 5, room_type: 'King Suite', amenities: 'Pool, Spa, Gym, WiFi' },
    { title: 'Hilton San Francisco', description: 'Central location near Union Square', location: 'San Francisco, CA', price: 300.00, stars: 4, room_type: 'Queen Room', amenities: 'Gym, WiFi, Breakfast' },
    { title: 'Marriott Chicago', description: 'Downtown comfort and style', location: 'Chicago, IL', price: 250.00, stars: 4, room_type: 'Double Room', amenities: 'WiFi, Bar' },
    { title: 'The Ritz-Carlton Los Angeles', description: 'Experience luxury in LA', location: 'Los Angeles, CA', price: 600.00, stars: 5, room_type: 'Deluxe Suite', amenities: 'Pool, Spa, Valet' },
    { title: 'Holiday Inn Miami', description: 'Affordable stay near the beach', location: 'Miami, FL', price: 150.00, stars: 3, room_type: 'Standard Room', amenities: 'Pool, WiFi' }
];

const flights = [
    { title: 'JFK to LHR', airline: 'British Airways', origin: 'JFK', destination: 'LHR', price: 800.00, departure_time: '2023-12-10 18:00:00', arrival_time: '2023-12-11 06:00:00', flight_code: 'BA112', duration: '7h 00m', flight_class: 'ECONOMY', available_seats: 150, rating: 4.2 },
    { title: 'SFO to JFK', airline: 'Delta Airlines', origin: 'SFO', destination: 'JFK', price: 450.00, departure_time: '2023-12-15 08:00:00', arrival_time: '2023-12-15 16:30:00', flight_code: 'DL456', duration: '5h 30m', flight_class: 'ECONOMY', available_seats: 100, rating: 4.5 },
    { title: 'LAX to NRT', airline: 'Japan Airlines', origin: 'LAX', destination: 'NRT', price: 1200.00, departure_time: '2023-12-20 11:00:00', arrival_time: '2023-12-21 15:00:00', flight_code: 'JL061', duration: '11h 00m', flight_class: 'BUSINESS', available_seats: 40, rating: 4.9 },
    { title: 'ORD to DXB', airline: 'Emirates', origin: 'ORD', destination: 'DXB', price: 1500.00, departure_time: '2023-12-25 14:00:00', arrival_time: '2023-12-26 12:00:00', flight_code: 'EK236', duration: '13h 00m', flight_class: 'ECONOMY', available_seats: 200, rating: 4.7 },
    { title: 'MIA to EZE', airline: 'American Airlines', origin: 'MIA', destination: 'EZE', price: 900.00, departure_time: '2023-12-30 20:00:00', arrival_time: '2023-12-31 06:00:00', flight_code: 'AA907', duration: '9h 00m', flight_class: 'ECONOMY', available_seats: 120, rating: 4.0 }
];

const cars = [
    { title: 'Tesla Model 3', brand: 'Tesla', model: 'Model 3', location: 'San Francisco, CA', price: 100.00, car_type: 'Electric' },
    { title: 'Ford Mustang', brand: 'Ford', model: 'Mustang', location: 'Los Angeles, CA', price: 120.00, car_type: 'Convertible' },
    { title: 'Toyota Camry', brand: 'Toyota', model: 'Camry', location: 'New York, NY', price: 60.00, car_type: 'Sedan' },
    { title: 'Chevrolet Tahoe', brand: 'Chevrolet', model: 'Tahoe', location: 'Chicago, IL', price: 150.00, car_type: 'SUV' },
    { title: 'BMW 3 Series', brand: 'BMW', model: '330i', location: 'Miami, FL', price: 110.00, car_type: 'Luxury' }
];

async function seed() {
    try {
        // Truncate tables to avoid duplicates
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE hotels');
        await db.execute('TRUNCATE TABLE flights');
        await db.execute('TRUNCATE TABLE cars');
        await db.execute('TRUNCATE TABLE listings');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Seeding Hotels...');
        for (const h of hotels) {
            const [res] = await db.execute('INSERT INTO listings (type, title, description, location, price, owner_id) VALUES (?, ?, ?, ?, ?, ?)', ['HOTEL', h.title, h.description, h.location, h.price, 2]);
            await db.execute('INSERT INTO hotels (listing_id, stars, room_type, amenities) VALUES (?, ?, ?, ?)', [res.insertId, h.stars, h.room_type, h.amenities]);
        }

        // Add San Jose flight
        flights.push({ title: 'SJC to JFK', airline: 'JetBlue', origin: 'San Jose', destination: 'New York', price: 350.00, departure_time: '2025-12-04 07:00:00', arrival_time: '2025-12-04 15:30:00', flight_code: 'B6543', duration: '5h 30m', flight_class: 'ECONOMY', available_seats: 150, rating: 4.3 });

        console.log('Seeding Flights...');
        for (const f of flights) {
            // Use city names for location to help search
            const location = f.destination === 'JFK' ? 'New York, NY' : f.destination;
            const [res] = await db.execute('INSERT INTO listings (type, title, description, location, price, owner_id) VALUES (?, ?, ?, ?, ?, ?)', ['FLIGHT', f.title, `Flight from ${f.origin} to ${f.destination}`, location, f.price, 2]);
            await db.execute('INSERT INTO flights (listing_id, airline, departure_time, arrival_time, origin, destination, flight_code, duration, flight_class, available_seats, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [res.insertId, f.airline, f.departure_time, f.arrival_time, f.origin, f.destination, f.flight_code, f.duration, f.flight_class, f.available_seats, f.rating]);
        }

        console.log('Seeding Cars...');
        for (const c of cars) {
            const [res] = await db.execute('INSERT INTO listings (type, title, description, location, price, owner_id) VALUES (?, ?, ?, ?, ?, ?)', ['CAR', c.title, `${c.brand} ${c.model} rental`, c.location, c.price, 2]);
            await db.execute('INSERT INTO cars (listing_id, car_type, brand, model) VALUES (?, ?, ?, ?)', [res.insertId, c.car_type, c.brand, c.model]);
        }

        console.log('Seeding Complete.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding Failed:', err);
        process.exit(1);
    }
}

seed();
