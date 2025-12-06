"use client";

import React, { useState } from 'react';
import { User, Mail, MapPin, Phone, Camera, Calendar, CreditCard, Star, Plane, Car, Hotel } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab); // profile, trips, reviews
    const [tripFilter, setTripFilter] = useState('upcoming'); // upcoming, past, cancelled

    const [user, setUser] = useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        bio: '',
        ssn: '',
        creditCard: '',
        profileImage: ''
    });
    const [isEditingCC, setIsEditingCC] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({
                id: parsed.id,
                firstName: parsed.first_name || '',
                lastName: parsed.last_name || '',
                email: parsed.email || '',
                phone: parsed.phone_number || '',
                address: parsed.address || '',
                city: parsed.city || '',
                state: parsed.state || '',
                zip: parsed.zip_code || '',
                bio: 'Travel enthusiast.',
                ssn: parsed.ssn || '',
                creditCard: parsed.credit_card_number || '',
                profileImage: parsed.profile_image || ''
            });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prev => ({ ...prev, profileImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const updatedUser = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone_number: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            zip_code: user.zip,
            ssn: user.ssn,
            credit_card_number: user.creditCard,
            profile_image: user.profileImage
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        router.push('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/');
    };

    const getMaskedCC = (cc: string) => {
        if (!cc || cc.length < 4) return cc;
        return `XXXX-XXXX-XXXX-${cc.slice(-4)}`;
    };

    const getMaskedSSN = (ssn: string) => {
        if (!ssn) return '';
        return 'XXX-XX-XXXX';
    };

    const [bookings, setBookings] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchBookings = async () => {
            if (user && (user as any).id) { // Assuming user object has ID from localStorage
                try {
                    const res = await fetch(`http://localhost:4001/${(user as any).id}/bookings`);
                    if (res.ok) {
                        const data = await res.json();
                        // Map backend data to frontend format
                        const mappedBookings = data.map((b: any) => ({
                            id: b.id,
                            type: b.type,
                            title: b.title,
                            location: b.location,
                            date: new Date(b.booking_date).toLocaleDateString(),
                            price: `$${b.total_price}`,
                            status: b.status === 'CONFIRMED' ? 'upcoming' : 'past', // Simplified status logic
                            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800' // Placeholder image
                        }));
                        setBookings(mappedBookings);
                    }
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                }
            }
        };
        fetchBookings();
    }, [user]);

    // Mock Data for Reviews
    const reviews = [
        {
            id: 1,
            target: 'Grand Hyatt New York',
            rating: 5,
            date: 'Jan 15, 2023',
            comment: 'Absolutely stunning views and impeccable service. The room was spacious and clean.',
            type: 'Hotel'
        },
        {
            id: 2,
            target: 'Delta Airlines (SFO -> JFK)',
            rating: 4,
            date: 'Dec 22, 2022',
            comment: 'Smooth flight, but the food could be better. On time arrival.',
            type: 'Flight'
        },
        {
            id: 3,
            target: 'Hertz Car Rental',
            rating: 2,
            date: 'Nov 05, 2022',
            comment: 'Car was dirty when picked up and the service desk was very slow.',
            type: 'Car'
        }
    ];

    const filteredBookings = bookings.filter(b => b.status === tripFilter);

    return (
        <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-orange-600 tracking-tighter">KAYAK</Link>
                    <nav className="space-x-4 text-sm font-medium text-gray-600 flex items-center">
                        <Link href="/?tab=flight" className="hover:text-orange-600">Flights</Link>
                        <Link href="/?tab=hotel" className="hover:text-orange-600">Hotels</Link>
                        <Link href="/?tab=car" className="hover:text-orange-600">Cars</Link>

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
                                    <button onClick={() => setActiveTab('profile')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium">
                                        Profile
                                    </button>
                                    <button onClick={() => setActiveTab('trips')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium">
                                        My Trips
                                    </button>
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
                    </nav>
                </div>
            </header>

            <div className="p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="h-48 bg-gradient-to-r from-orange-400 to-pink-500 relative">
                            <div className="absolute -bottom-16 left-8">
                                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                                    <div
                                        className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                                        onClick={handleImageClick}
                                    >
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-400" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-20 px-8 pb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.firstName} {user.lastName}</h1>
                                <p className="text-gray-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {user.city || 'City'}, {user.state || 'State'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('trips')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'trips' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    My Trips
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'reviews' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    My Reviews
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Personal Info</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">First Name</label>
                                            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Last Name</label>
                                            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                            <input type="email" name="email" value={user.email} onChange={handleChange} className="w-full p-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Phone</label>
                                        <div className="relative">
                                            <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                            <input type="tel" name="phone" value={user.phone} onChange={handleChange} className="w-full p-2 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Address</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Street Address</label>
                                        <input type="text" name="address" value={user.address} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">City</label>
                                            <input type="text" name="city" value={user.city} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">State</label>
                                            <input type="text" name="state" value={user.state} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Zip Code</label>
                                        <input type="text" name="zip" value={user.zip} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" />
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-6 pt-6 border-t">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Secure Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">User ID</label>
                                            <input type="text" name="ssn" readOnly disabled value={getMaskedSSN(user.ssn)} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Credit Card Number</label>
                                            <div className="flex gap-2">
                                                <input type="text" name="creditCard" readOnly={!isEditingCC} value={isEditingCC ? user.creditCard : getMaskedCC(user.creditCard)} onChange={handleChange} className={`w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 ${!isEditingCC ? 'bg-gray-50' : ''}`} />
                                                <button onClick={() => setIsEditingCC(!isEditingCC)} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">{isEditingCC ? 'Done' : 'Edit'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-md">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'trips' && (
                        <div className="space-y-6">
                            <div className="flex gap-4 border-b border-gray-200 pb-4">
                                {['upcoming', 'past', 'cancelled'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setTripFilter(filter)}
                                        className={`text-sm font-medium capitalize ${tripFilter === filter ? 'text-orange-600 border-b-2 border-orange-600 -mb-4 pb-4' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {filter} Trips
                                    </button>
                                ))}
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                    <p className="text-gray-500">No {tripFilter} trips found.</p>
                                </div>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                                        <div className="md:w-64 h-48 md:h-auto relative">
                                            <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-gray-800">
                                                {booking.type}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{booking.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 flex items-center gap-2 mb-4">
                                                    <MapPin className="w-4 h-4" /> {booking.location}
                                                </p>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-orange-500" />
                                                        {booking.date}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="w-4 h-4 text-orange-500" />
                                                        {booking.price}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="grid grid-cols-1 gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium uppercase">{review.type}</span>
                                                <span className="text-sm text-gray-400">• {review.date}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">{review.target}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                                            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                            <span className="font-bold text-orange-700">{review.rating}.0</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
