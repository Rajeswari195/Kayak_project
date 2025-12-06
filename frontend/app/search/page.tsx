'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Listing {
    id: number;
    title: string;
    type: string;
    description: string;
    price: number;
    city: string;
    state: string;
    rating: number;
    image_url: string;
    // Flight specific
    airline?: string;
    departure_time?: string;
    arrival_time?: string;
    origin?: string;
    destination?: string;
    flight_code?: string;
    duration?: string;
    flight_class?: string;
    available_seats?: number;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [priceRange, setPriceRange] = useState<number>(1000);
    const [minRating, setMinRating] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'hotel');

    const fetchListings = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedType) params.append('type', selectedType);
            const dest = searchParams.get('destination');
            if (dest) params.append('destination', dest);
            const origin = searchParams.get('origin');
            if (origin) params.append('origin', origin);
            if (priceRange) params.append('price_max', priceRange.toString());
            if (minRating) params.append('rating', minRating.toString());

            const res = await fetch(`http://localhost:4000/api/search?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setListings(data);
            }
        } catch (error) {
            console.error('Failed to fetch listings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [searchParams, priceRange, minRating, selectedType]);

    const handleBook = async (listing: Listing) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Please log in to book.');
            return;
        }
        const user = JSON.parse(storedUser);

        try {
            const res = await fetch('http://localhost:4003/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    listing_id: listing.id,
                    booking_date: new Date().toISOString().slice(0, 10),
                    total_price: listing.price,
                    payment_method: 'CREDIT_CARD'
                })
            });

            if (res.ok) {
                alert('Booking successful! Check your profile for details.');
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('An error occurred while booking.');
        }
    };

    const router = useRouter();
    const [user, setUser] = useState<{ firstName: string } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-orange-600 tracking-tighter">KAYAK</Link>
                    <nav className="space-x-4 text-sm font-medium text-gray-600 flex items-center">
                        <Link href="/?tab=flight" className="hover:text-orange-600">Flights</Link>
                        <Link href="/?tab=hotel" className="hover:text-orange-600">Hotels</Link>
                        <Link href="/?tab=car" className="hover:text-orange-600">Cars</Link>

                        {user ? (
                            <div className="relative group ml-4">
                                <button className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 py-2">
                                    Hi, {user.firstName}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                    <div className="p-2">
                                        <Link href="/profile?tab=profile" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium">
                                            Profile
                                        </Link>
                                        <Link href="/profile?tab=trips" className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium">
                                            My Trips
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-100 p-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-orange-600">Sign In</Link>
                        )}
                    </nav>
                </div>
            </header>

            <div className="pt-10 pb-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Filters</h2>

                        {/* Type Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
                            <div className="space-y-2">
                                {['hotel', 'flight', 'car'].map((type) => (
                                    <label key={type} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={selectedType === type}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Max Price: ${priceRange}</h3>
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="50"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                        </div>

                        {/* Rating Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <label key={star} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={star}
                                            checked={minRating === star}
                                            onChange={() => setMinRating(star)}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 flex items-center">
                                            {star} <span className="text-yellow-400 ml-1">★</span> & up
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="lg:col-span-3 space-y-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Results for "{searchParams.get('destination') || 'All Destinations'}"
                        </h1>

                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                                <p className="text-gray-500">No results found matching your criteria.</p>
                            </div>
                        ) : (
                            listings.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
                                    <div className="sm:w-48 h-48 sm:h-auto relative bg-gray-200">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                                                    {item.type === 'FLIGHT' ? (
                                                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                                                            <p className="font-medium text-gray-900">{item.airline} • {item.flight_code}</p>
                                                            <p>{item.origin} ➝ {item.destination}</p>
                                                            <p>{new Date(item.departure_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(item.arrival_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({item.duration})</p>
                                                            <p className="text-xs uppercase tracking-wide bg-gray-100 w-fit px-2 py-0.5 rounded">{item.flight_class}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">{item.city}, {item.state}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                                                    <span className="text-green-800 font-bold text-sm">{item.rating || 'N/A'}</span>
                                                    <span className="text-green-800 text-xs ml-1">/ 5</span>
                                                </div>
                                            </div>
                                            {item.type !== 'FLIGHT' && (
                                                <p className="mt-2 text-gray-600 line-clamp-2">{item.description}</p>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                                                <span className="text-gray-500 text-sm"> {item.type === 'FLIGHT' ? '' : '/ night'}</span>
                                            </div>
                                            <button
                                                onClick={() => handleBook(item)}
                                                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                                            >
                                                {item.type === 'FLIGHT' ? 'Select' : 'Book Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
