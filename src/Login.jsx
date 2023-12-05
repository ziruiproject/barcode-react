// Login.js

import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful!');
            window.location.replace('/');
        } catch (error) {
            console.error('Error logging in:', error.message);
        }
    };

    const handleRegis = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Regis successful!');
            window.location.replace('/');
            // Redirect to / after successful registration
        } catch (error) {
            console.error('Error regis in:', error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen text-gray-700 bg-gray-200">
            <h1 className="text-2xl font-bold">Selamat Datang!</h1>
            <form className="flex flex-col p-12 mt-12 bg-white rounded shadow-lg" action="">
                <label className="text-xs font-semibold">Email</label>
                <input placeholder='' className="focus:outline-none focus:ring-2 flex items-center w-64 h-12 px-4 mt-2 bg-gray-200 rounded" type="text" />
                <label className="mt-3 text-xs font-semibold">Password</label>
                <input className="focus:outline-none focus:ring-2 flex items-center w-64 h-12 px-4 mt-2 bg-gray-200 rounded" type="password" />
                <button onClick={handleRegis} className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">Masuk</button>
                {/* <div className="flex justify-center mt-6 text-xs">
                    <a className="hover:text-blue-500 text-blue-400" href="#">Lupa Password</a>
                    <span className="mx-2 text-gray-300">/</span>
                    <a className="hover:text-blue-500 text-blue-400" href="#">Daftar</a>
                </div> */}
            </form>
        </div>
    );
};
