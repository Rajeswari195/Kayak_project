"use client";

import React, { useState } from 'react';
import { Plus, Hotel, Plane, Car } from 'lucide-react';

export default function ListingsPage() {
    const [activeTab, setActiveTab] = useState('HOTEL');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        price: '',
        // Hotel specific
        stars: '4',
        room_type: 'Standard',
        // Flight specific
        airline: '',
        origin: '',
        destination: '',
        // Car specific
        brand: '',
        model: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting listing:', { type: activeTab, ...formData });
        // In a real app, this would call the API Gateway
        alert('Listing created! (Mock)');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Listings</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        {['HOTEL', 'FLIGHT', 'CAR'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === type ? 'bg-orange-50 text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {type === 'HOTEL' && <Hotel className="w-4 h-4" />}
                                {type === 'FLIGHT' && <Plane className="w-4 h-4" />}
                                {type === 'CAR' && <Car className="w-4 h-4" />}
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Luxury Ocean View Suite"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                    />
                                </div>

                                {/* Dynamic Fields based on Type */}
                                {activeTab === 'HOTEL' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Stars</label>
                                            <select
                                                name="stars"
                                                value={formData.stars}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                            >
                                                <option value="1">1 Star</option>
                                                <option value="2">2 Stars</option>
                                                <option value="3">3 Stars</option>
                                                <option value="4">4 Stars</option>
                                                <option value="5">5 Stars</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                            <input
                                                type="text"
                                                name="room_type"
                                                value={formData.room_type}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'FLIGHT' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                                            <input
                                                type="text"
                                                name="airline"
                                                value={formData.airline}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                                            <input
                                                type="text"
                                                name="origin"
                                                value={formData.origin}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                            <input
                                                type="text"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'CAR' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                            <input
                                                type="text"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                            <input
                                                type="text"
                                                name="model"
                                                value={formData.model}
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5" /> Create Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
