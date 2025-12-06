const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { producer } = require('../kafka/connection');

const app = express();
const PORT = 4003;

app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Booking Service is running' });
});

// Create Booking
app.post('/', async (req, res) => {
    try {
        await producer.send({
            topic: 'booking-topic',
            messages: [
                { value: JSON.stringify({ action: 'CREATE_BOOKING', data: req.body }) }
            ],
        });
        console.log('Message sent to Kafka');
        res.status(202).json({ message: 'Booking request queued' });
    } catch (err) {
        console.error('Error sending to Kafka:', err);
        res.status(500).json({ error: 'Failed to queue request' });
    }
});

app.listen(PORT, () => {
    console.log(`Booking Service running on port ${PORT}`);
});
