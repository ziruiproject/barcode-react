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
        <div class="flex flex-col items-center justify-center w-screen h-screen bg-gray-200 text-gray-700">
            <h1 class="font-bold text-2xl">Selamat Datang! :)</h1>
            <form class="flex flex-col bg-white rounded shadow-lg p-12 mt-12" action="">
                <label class="font-semibold text-xs" for="usernameField">Email</label>
                <input placeholder='' class="flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2" type="text" />
                <label class="font-semibold text-xs mt-3" for="passwordField">Password</label>
                <input class="flex items-center h-12 px-4 w-64 bg-gray-200 mt-2 rounded focus:outline-none focus:ring-2" type="password" />
                <button class="flex items-center justify-center h-12 px-6 w-64 bg-blue-600 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-blue-700">Masuk</button>
                {/* <div class="flex mt-6 justify-center text-xs">
                    <a class="text-blue-400 hover:text-blue-500" href="#">Lupa Password</a>
                    <span class="mx-2 text-gray-300">/</span>
                    <a class="text-blue-400 hover:text-blue-500" href="#">Daftar</a>
                </div> */}
            </form>
        </div>
    );
};
