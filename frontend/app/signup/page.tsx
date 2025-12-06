'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        ssn: '',
        credit_card_number: ''
    });
    const [error, setError] = useState('');

    const validateForm = () => {
        const ssnRegex = /^\d{9}$/;
        const ccRegex = /^\d{16}$/;

        if (!ssnRegex.test(formData.ssn)) {
            setError('SSN must be exactly 9 digits (numbers only).');
            return false;
        }
        if (!ccRegex.test(formData.credit_card_number)) {
            setError('Credit Card must be exactly 16 digits (numbers only).');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            // Create User via Gateway -> User Service
            const res = await fetch('http://localhost:4000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Auto login or redirect to login
                router.push('/login');
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-900">First Name</label>
                                <input type="text" name="first_name" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900">Last Name</label>
                                <input type="text" name="last_name" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">Email address</label>
                            <input type="email" name="email" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">Password</label>
                            <input type="password" name="password" required onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">SSN (User ID)</label>
                            <input type="text" name="ssn" placeholder="9 digits (e.g. 123456789)" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900">Credit Card</label>
                            <input type="text" name="credit_card_number" placeholder="16 digits (e.g. 1234567812345678)" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" />
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                Sign up
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="text-orange-600 hover:text-orange-500 font-medium">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
