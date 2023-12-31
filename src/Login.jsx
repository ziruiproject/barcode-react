// Login.js

import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.replace('/');
        } catch (error) {
            setError('Email atau Password Salah!');
        }
    };

    const handleRegis = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.replace('/');
        } catch (error) {
            console.error('Error regis in:', error.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-evenly w-screen h-screen text-gray-700 bg-gray-200">
            <img src="/logo.png" className='h-[256px]' alt="" />
            <div>
                <h1 className="text-2xl font-bold text-center">Selamat Datang!</h1>
                <form className="flex flex-col p-12 mt-12 bg-white rounded shadow-lg" action="">
                    <label className="text-xs font-semibold">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} className="focus:outline-none focus:ring-2 flex items-center w-64 h-12 px-4 mt-2 bg-gray-200 rounded" type="text" />
                    <label className="mt-3 text-xs font-semibold">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className="focus:outline-none focus:ring-2 flex items-center w-64 h-12 px-4 mt-2 bg-gray-200 rounded" type="password" />
                    <button onClick={handleLogin} type='button' className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">Masuk</button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};
