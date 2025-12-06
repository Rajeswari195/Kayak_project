const { kafka } = require('../kafka/connection');
const db = require('../database/mysql_connection');

const consumer = kafka.consumer({ groupId: 'booking-service-group' });

const run = async () => {
    try {
        await consumer.connect();
        console.log('Booking Service Consumer connected');

        await consumer.subscribe({ topic: 'booking-topic', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Booking Service received message:', message.value.toString());
                try {
                    const payload = JSON.parse(message.value.toString());

                    if (payload.action === 'CREATE_BOOKING') {
                        const { user_id, listing_id, booking_date, total_price, payment_method } = payload.data;

                        // Insert into bookings table
                        const sql = 'INSERT INTO bookings (user_id, listing_id, booking_date, total_price, status) VALUES (?, ?, ?, ?, ?)';
                        const [result] = await db.execute(sql, [user_id, listing_id, booking_date, total_price, 'CONFIRMED']);
                        const bookingId = result.insertId;

                        console.log('Booking created with ID:', bookingId);

                        // Insert into billing table
                        const billingSql = 'INSERT INTO billing (booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?)';
                        await db.execute(billingSql, [bookingId, total_price, payment_method, 'PAID']);

                        console.log('Billing record created for Booking ID:', bookingId);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });
    } catch (error) {
        console.error('Booking Consumer error:', error);
    }
};

run();
