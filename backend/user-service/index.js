const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { producer } = require('../kafka/connection');

const app = express();
const PORT = 4001;

app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'User Service is running' });
});

// Create User
app.post('/', async (req, res) => {
    try {
        await producer.send({
            topic: 'user-topic',
            messages: [
                { value: JSON.stringify({ action: 'CREATE_USER', data: req.body }) }
            ],
        });
        console.log('Message sent to Kafka');
        res.status(202).json({ message: 'User creation request queued' });
    } catch (err) {
        console.error('Error sending to Kafka:', err);
        res.status(500).json({ error: 'Failed to queue request' });
    }
});

// Login Endpoint
const db = require('../database/mysql_connection');

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // In a real app, compare hashed passwords
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

        if (rows.length > 0) {
            const user = rows[0];
            // Remove sensitive data
            delete user.password;
            // delete user.ssn; // Keeping SSN for profile display
            // delete user.credit_card_number; // Keeping CC for profile display

            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User Bookings
app.get('/:id/bookings', async (req, res) => {
    try {
        const userId = req.params.id;
        const query = `
            SELECT b.id, b.status, b.booking_date, b.total_price, 
                   l.title, l.location, l.type, l.description
            FROM bookings b
            JOIN listings l ON b.listing_id = l.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});
