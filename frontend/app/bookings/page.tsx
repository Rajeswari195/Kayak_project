"use client";

import React from 'react';
import { Calendar, MapPin, CreditCard, Clock } from 'lucide-react';

export default function BookingsPage() {
    const bookings = [
        {
            id: 1,
            type: 'Hotel',
            title: 'Grand Hyatt New York',
            location: 'New York, NY',
            date: 'Dec 15 - Dec 20, 2023',
            price: '$1,200',
            status: 'Upcoming',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 2,
            type: 'Flight',
            title: 'SFO -> JFK',
            location: 'New York, NY',
            date: 'Dec 15, 2023',
            price: '$450',
            status: 'Upcoming',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 3,
            type: 'Car',
            title: 'Tesla Model 3',
            location: 'New York, NY',
            date: 'Dec 15 - Dec 20, 2023',
            price: '$300',
            status: 'Upcoming',
            image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 4,
            type: 'Hotel',
            title: 'Hilton Paris Opera',
            location: 'Paris, France',
            date: 'Oct 10 - Oct 15, 2023',
            price: '$1,500',
            status: 'Completed',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Trips</h1>

                <div className="space-y-6">
                    {bookings.map((booking) => (
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
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

                                <div className="mt-6 flex gap-3">
                                    <button className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        View Details
                                    </button>
                                    {booking.status === 'Upcoming' && (
                                        <button className="flex-1 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors">
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
