const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { producer } = require('../kafka/connection');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Basic health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Example: Create User (Producer)
app.post('/api/users', (req, res) => {
    const payloads = [
        { topic: 'user-topic', messages: JSON.stringify({ action: 'CREATE_USER', data: req.body }), partition: 0 }
    ];

    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending to Kafka:', err);
            res.status(500).json({ error: 'Failed to queue request' });
        } else {
            console.log('Message sent to Kafka:', data);
            res.status(202).json({ message: 'User creation request queued' });
        }
    });
});

// Admin: Create Listing
app.post('/api/listings', (req, res) => {
    const payloads = [
        { topic: 'admin-topic', messages: JSON.stringify({ action: 'CREATE_LISTING', data: req.body }), partition: 0 }
    ];

    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending to Kafka:', err);
            res.status(500).json({ error: 'Failed to queue request' });
        } else {
            console.log('Message sent to Kafka:', data);
            res.status(202).json({ message: 'Listing creation request queued' });
        }
    });
});

// Booking: Create Booking
app.post('/api/bookings', (req, res) => {
    const payloads = [
        { topic: 'booking-topic', messages: JSON.stringify({ action: 'CREATE_BOOKING', data: req.body }), partition: 0 }
    ];

    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending to Kafka:', err);
            res.status(500).json({ error: 'Failed to queue request' });
        } else {
            console.log('Message sent to Kafka:', data);
            res.status(202).json({ message: 'Booking request queued' });
        }
    });
});

// Search API (Direct Database Access for Read)
const db = require('../database/mysql_connection');

app.get('/api/search', async (req, res) => {
    try {
        const { type, destination, date, price_min, price_max, rating } = req.query;

        let query = 'SELECT * FROM Listings WHERE 1=1';
        const params = [];

        if (type) {
            query += ' AND type = ?';
            params.push(type);
        }
        if (destination) {
            query += ' AND (city LIKE ? OR state LIKE ? OR address LIKE ?)';
            const destParam = `%${destination}%`;
            params.push(destParam, destParam, destParam);
        }
        // Note: Date filtering would depend on availability tables, keeping it simple for now
        if (price_min) {
            query += ' AND price >= ?';
            params.push(price_min);
        }
        if (price_max) {
            query += ' AND price <= ?';
            params.push(price_max);
        }
        if (rating) {
            query += ' AND rating >= ?';
            params.push(rating);
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Gateway Service running on port ${PORT}`);
});
