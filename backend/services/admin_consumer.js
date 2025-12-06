const { kafka } = require('../kafka/connection');
const db = require('../database/mysql_connection');

const consumer = kafka.consumer({ groupId: 'admin-service-group' });

const run = async () => {
    try {
        await consumer.connect();
        console.log('Admin Service Consumer connected');

        await consumer.subscribe({ topic: 'admin-topic', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Admin Service received message:', message.value.toString());
                try {
                    const payload = JSON.parse(message.value.toString());

                    if (payload.action === 'CREATE_LISTING') {
                        const { type, title, description, location, price, owner_id } = payload.data;

                        // Insert into listings table
                        const sql = 'INSERT INTO listings (type, title, description, location, price, owner_id) VALUES (?, ?, ?, ?, ?, ?)';
                        const [result] = await db.execute(sql, [type, title, description, location, price, owner_id]);
                        const listingId = result.insertId;

                        console.log('Listing created with ID:', listingId);

                        // Handle specific types (Hotel, Flight, Car)
                        if (type === 'HOTEL') {
                            const { stars, room_type, amenities } = payload.data;
                            await db.execute('INSERT INTO hotels (listing_id, stars, room_type, amenities) VALUES (?, ?, ?, ?)', [listingId, stars, room_type, amenities]);
                        } else if (type === 'FLIGHT') {
                            const { airline, departure_time, arrival_time, origin, destination, flight_code, duration, flight_class, available_seats, rating } = payload.data;
                            await db.execute(
                                'INSERT INTO flights (listing_id, airline, departure_time, arrival_time, origin, destination, flight_code, duration, flight_class, available_seats, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [listingId, airline, departure_time, arrival_time, origin, destination, flight_code, duration, flight_class || 'ECONOMY', available_seats || 0, rating || 0.0]
                            );
                        } else if (type === 'CAR') {
                            const { car_type, brand, model } = payload.data;
                            await db.execute('INSERT INTO cars (listing_id, car_type, brand, model) VALUES (?, ?, ?, ?)', [listingId, car_type, brand, model]);
                        }
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });
    } catch (error) {
        console.error('Admin Consumer error:', error);
    }
};

run();
