CREATE DATABASE IF NOT EXISTS kayak_db;
USE kayak_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    phone_number VARCHAR(20),
    profile_image VARCHAR(255),
    ssn VARCHAR(20) UNIQUE, -- User ID in SSN Format
    credit_card_number VARCHAR(20), -- Storing plain for demo (Encrypted in real app)
    user_type ENUM('USER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('HOTEL', 'FLIGHT', 'CAR') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    owner_id INT,
    available_from DATE,
    available_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Specific fields for Hotels
CREATE TABLE IF NOT EXISTS hotels (
    listing_id INT PRIMARY KEY,
    stars INT,
    room_type VARCHAR(100),
    amenities TEXT,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- Specific fields for Flights
CREATE TABLE IF NOT EXISTS flights (
    listing_id INT PRIMARY KEY,
    airline VARCHAR(100),
    departure_time DATETIME,
    arrival_time DATETIME,
    origin VARCHAR(100),
    destination VARCHAR(100),
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- Specific fields for Cars
CREATE TABLE IF NOT EXISTS cars (
    listing_id INT PRIMARY KEY,
    car_type VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('CONFIRMED', 'CANCELLED', 'PENDING') DEFAULT 'PENDING',
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE TABLE IF NOT EXISTS billing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    status ENUM('PAID', 'REFUNDED', 'FAILED') DEFAULT 'PAID',
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
