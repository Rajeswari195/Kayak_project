const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { producer } = require('../kafka/connection');
const db = require('../database/mysql_connection');

const app = express();
const PORT = 4002;

app.use(cors());
app.use(bodyParser.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Listings Service is running' });
});

// Create Listing (Admin)
app.post('/', async (req, res) => {
    try {
        await producer.send({
            topic: 'admin-topic',
            messages: [
                { value: JSON.stringify({ action: 'CREATE_LISTING', data: req.body }) }
            ],
        });
        console.log('Message sent to Kafka');
        res.status(202).json({ message: 'Listing creation request queued' });
    } catch (err) {
        console.error('Error sending to Kafka:', err);
        res.status(500).json({ error: 'Failed to queue request' });
    }
});

// Search Listings (Direct DB)
// Note: Gateway forwards /api/search here, but since we mount it at root in this service, 
// we need to handle the path correctly. 
// If Gateway forwards /api/search -> http://localhost:4002/api/search, then we need /api/search here.
// If Gateway strips the prefix, we need /. 
// Based on standard proxy config, it usually keeps the path.
// City to Airport Code Mapping
const CITY_AIRPORT_MAP = {
    'new york': ['JFK', 'LGA', 'EWR', 'New York'],
    'san jose': ['SJC', 'San Jose'],
    'san francisco': ['SFO', 'San Francisco'],
    'los angeles': ['LAX', 'ONT', 'SNA', 'Los Angeles'],
    'chicago': ['ORD', 'MDW', 'Chicago'],
    'london': ['LHR', 'LGW', 'STN', 'LCY', 'London'],
    'tokyo': ['NRT', 'HND', 'Tokyo'],
    'miami': ['MIA', 'FLL', 'Miami'],
    'washington': ['IAD', 'DCA', 'BWI', 'Washington'],
    'boston': ['BOS', 'Boston'],
    'las vegas': ['LAS', 'Las Vegas'],
    'orlando': ['MCO', 'SFB', 'Orlando'],
    'seattle': ['SEA', 'Seattle'],
    'atlanta': ['ATL', 'Atlanta'],
    'dallas': ['DFW', 'DAL', 'Dallas'],
    'houston': ['IAH', 'HOU', 'Houston'],
    'paris': ['CDG', 'ORY', 'Paris'],
    'dubai': ['DXB', 'DWC', 'Dubai'],
    'frankfurt': ['FRA', 'Frankfurt'],
    'amsterdam': ['AMS', 'Amsterdam'],
    'singapore': ['SIN', 'Singapore'],
    'hong kong': ['HKG', 'Hong Kong'],
    'sydney': ['SYD', 'Sydney'],
    'toronto': ['YYZ', 'YTZ', 'Toronto'],
    'vancouver': ['YVR', 'Vancouver']
};

const getSearchTerms = (term) => {
    if (!term) return [];
    const lowerTerm = term.toLowerCase();
    // Check for exact city match or partial match
    for (const [city, codes] of Object.entries(CITY_AIRPORT_MAP)) {
        if (lowerTerm.includes(city)) return codes;
    }
    return [term];
};

app.get('/api/search', async (req, res) => {
    try {
        const { type, destination, origin, date, price_min, price_max, rating } = req.query;

        let query = `
            SELECT l.*, 
                   f.airline, f.departure_time, f.arrival_time, f.origin, f.destination, f.flight_code, f.duration, f.flight_class, f.available_seats, f.rating as flight_rating,
                   h.number_of_rooms, h.rating as hotel_rating, h.images, h.stars, h.room_type, h.amenities,
                   c.year, c.transmission, c.seats, c.rating as car_rating, c.status, c.brand, c.model, c.car_type
            FROM listings l 
            LEFT JOIN flights f ON l.id = f.listing_id 
            LEFT JOIN hotels h ON l.id = h.listing_id
            LEFT JOIN cars c ON l.id = c.listing_id
            WHERE 1=1
        `;
        const params = [];

        if (type) {
            query += ' AND l.type = ?';
            params.push(type);
        }
        if (destination) {
            const destTerms = getSearchTerms(destination);
            // Construct OR clause for all possible terms
            const destConditions = destTerms.map(() => '(l.location LIKE ? OR f.destination LIKE ?)').join(' OR ');
            query += ` AND (${destConditions})`;
            destTerms.forEach(term => params.push(`%${term}%`, `%${term}%`));
        }
        if (origin) {
            const originTerms = getSearchTerms(origin);
            const originConditions = originTerms.map(() => 'f.origin LIKE ?').join(' OR ');
            query += ` AND (${originConditions})`;
            originTerms.forEach(term => params.push(`%${term}%`));
        }
        if (price_min) {
            query += ' AND l.price >= ?';
            params.push(price_min);
        }
        if (price_max) {
            query += ' AND l.price <= ?';
            params.push(price_max);
        }
        if (rating) {
            query += ' AND f.rating >= ?';
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
    console.log(`Listings Service running on port ${PORT}`);
});
