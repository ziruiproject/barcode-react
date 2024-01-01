// Login.js

import React, { useState } from 'react';
import { auth, firestore } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { collection, query, where, getDocs, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            const userCollection = collection(firestore, 'users');

            const q = query(userCollection, where('username', '==', userName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();

                await signInWithEmailAndPassword(auth, user.email, password);

                window.location.replace('/');
            } else {
                setError('Username atau Password Salah!');
            }
        } catch (error) {
            setError('Username atau Password Salah!');
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
        <div className="md:flex-row justify-evenly flex flex-col items-center w-screen h-screen text-gray-700 bg-gray-200">
            <img src="/logo.png" className='h-[256px]' alt="" />
            <div>
                <h1 className="text-2xl font-bold text-center">Selamat Datang!</h1>
                <form className="flex flex-col p-12 mt-12 bg-white rounded shadow-lg" action="">
                    <label className="text-xs font-semibold">Username</label>
                    <input onChange={(e) => setUserName(e.target.value)} className="focus:outline-none focus:ring-2 flex items-center w-64 h-12 px-4 mt-2 bg-gray-200 rounded" type="text" />
                    <label className="mt-3 text-xs font-semibold">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} className="focus:outline-none focus:ring-2 flex items-center w-64 h-12 px-4 mt-2 bg-gray-200 rounded" type="password" />
                    <button onClick={handleLogin} type='button' className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">Masuk</button>
                    {error && <p className="mt-2 text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};
