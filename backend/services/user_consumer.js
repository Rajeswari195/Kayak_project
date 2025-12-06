const { kafka } = require('../kafka/connection');
const db = require('../database/mysql_connection');

const consumer = kafka.consumer({ groupId: 'user-group' });

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('User Service received message:', message.value.toString());
            try {
                const payload = JSON.parse(message.value.toString());

                if (payload.action === 'CREATE_USER') {
                    const { email, password, first_name, last_name, ssn, credit_card_number } = payload.data;
                    // Optional fields
                    const address = payload.data.address || null;
                    const city = payload.data.city || null;
                    const state = payload.data.state || null;
                    const zip_code = payload.data.zip_code || null;
                    const phone_number = payload.data.phone_number || null;

                    // Check if user exists
                    const [existing] = await db.execute('SELECT id FROM users WHERE email = ? OR ssn = ?', [email, ssn]);
                    if (existing.length > 0) {
                        console.log('User already exists, skipping.');
                        return;
                    }

                    // In a real app, hash the password here
                    const sql = 'INSERT INTO users (email, password, first_name, last_name, address, city, state, zip_code, phone_number, ssn, credit_card_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    const [result] = await db.execute(sql, [email, password, first_name, last_name, address, city, state, zip_code, phone_number, ssn, credit_card_number]);
                    console.log('User created with ID:', result.insertId);
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        },
    });
};

run().catch(console.error);

console.log('User Service Consumer started');
