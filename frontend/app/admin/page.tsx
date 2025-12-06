"use client";

import React from 'react';
import { BarChart3, Users, DollarSign, Building, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
                        Download Report
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Revenue', value: '$124,500', change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
                        { label: 'Active Users', value: '8,240', change: '+5.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'Total Bookings', value: '1,450', change: '-2.1%', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-100' },
                        { label: 'Active Listings', value: '342', change: '+8.4%', icon: Building, color: 'text-orange-600', bg: 'bg-orange-100' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className={`flex items-center text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change}
                                    {stat.change.startsWith('+') ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Area Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Overview</h3>
                        <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            [Bar Chart Placeholder]
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-80 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Hotels</h3>
                        <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            [Pie Chart Placeholder]
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Listing</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-900">User #{i}</td>
                                        <td className="p-4">Hotel California</td>
                                        <td className="p-4">Oct 2{i}, 2023</td>
                                        <td className="p-4">$450.00</td>
                                        <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
