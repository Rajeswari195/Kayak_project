const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 4000;

app.use(cors());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway is running' });
});

// Proxy Rules
// User Service
app.use('/api/users', createProxyMiddleware({
    target: 'http://localhost:4001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '', // remove base path
    },
}));

// Listings Service (Search & Management)
app.use('/api/listings', createProxyMiddleware({
    target: 'http://localhost:4002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/listings': '', // remove base path
    },
}));
app.use('/api/search', createProxyMiddleware({
    target: 'http://localhost:4002',
    changeOrigin: true,
    // Keep /api/search or rewrite depending on Listings Service.
    // Listings Service has app.get('/api/search'), so NO rewrite needed here if we want to hit that.
    // But wait, Listings Service has app.get('/api/search').
    // If we send /api/search -> localhost:4002/api/search, it matches.
}));

// Booking Service
app.use('/api/bookings', createProxyMiddleware({
    target: 'http://localhost:4003',
    changeOrigin: true,
    pathRewrite: {
        '^/api/bookings': '', // remove base path
    },
}));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
