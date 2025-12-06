'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from "@/components/ChatInterface";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hotel');
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [dates, setDates] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.refresh();
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (activeTab) params.append('type', activeTab);

    if (activeTab === 'flight') {
      if (origin) params.append('origin', origin);
      if (departureDate) params.append('departure_date', departureDate);
      if (returnDate) params.append('return_date', returnDate);
      params.append('travelers', travelers.toString());
    } else {
      if (dates) params.append('dates', dates);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600 tracking-tighter">KAYAK</h1>
          <nav className="space-x-4 text-sm font-medium text-gray-600 flex items-center">
            <a href="#" className="hover:text-orange-600">Flights</a>
            <a href="#" className="hover:text-orange-600">Hotels</a>
            <a href="#" className="hover:text-orange-600">Cars</a>

            {user ? (
              <div className="relative group ml-4">
                <button className="flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 py-2">
                  Hi, {user.first_name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="p-2">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium">
                      Profile
                    </Link>
                    <Link href="/profile?tab=trips" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium">
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
              <Link href="/login" className="hover:text-orange-600 ml-4">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Where to next?</h2>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('hotel')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'hotel' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Stays
              </button>
              <button
                onClick={() => setActiveTab('flight')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'flight' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Flights
              </button>
              <button
                onClick={() => setActiveTab('car')}
                className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'car' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                Cars
              </button>
            </div>

            {/* Search Form */}
            <div className={`grid gap-2 ${activeTab === 'flight' ? 'grid-cols-1 md:grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_0.8fr_auto]' : 'grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto]'}`}>

              {activeTab === 'flight' ? (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="From?"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="To?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Depart"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Return"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Traveler{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Where to?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Dates"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 flex items-center">
                    1 Traveler
                  </div>
                </>
              )}

              <button
                className="p-3 bg-orange-600 text-white rounded-lg font-bold px-6 hover:bg-orange-700 transition-colors h-full"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-blue-100 rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?auto=format&fit=crop&q=80&w=800)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="relative text-white text-xl font-bold">Explore New York</h3>
            </div>
            <div className="h-64 bg-green-100 rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="relative text-white text-xl font-bold">Relax in Paris</h3>
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="w-full md:w-[400px] shrink-0">
          <div className="sticky top-24">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
}
