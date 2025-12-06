db = db.getSiblingDB('kayak_mongo_db');

db.createCollection('reviews');
db.reviews.createIndex({ "listing_id": 1 });
db.reviews.createIndex({ "user_id": 1 });

db.createCollection('logs');
db.logs.createIndex({ "timestamp": 1 });
db.logs.createIndex({ "user_id": 1 });

db.createCollection('images');
db.images.createIndex({ "listing_id": 1 });
