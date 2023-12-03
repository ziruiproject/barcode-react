// Login.js

import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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
        <div>
            <h2>Login</h2>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegis}>Regis</button>
        </div>
    );
};
