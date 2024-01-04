import React, { useState, useEffect } from 'react';
import { auth, firestore } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { collection, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

export default function Regis() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (auth.currentUser.email !== "admin@guard.pjkpsas.com") {
            window.location.replace('/');
        }
    }, []);

    const handleRegistration = async () => {
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            const admin = await signInWithEmailAndPassword(auth, "admin@guard.pjkpsas.com", "securityguardadmin27")
            const adminData = admin.user

            await updateProfile(newUser, { displayName: name });

            const usersCollection = collection(firestore, 'users');
            const userData = {
                email: newEmail,
                name: newName,
                username: username,
            };

            await setDoc(doc(usersCollection, newUid), userData);

            setUsername('');
            setName('');
            setEmail('');
            setPassword('');

        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="max-w-md p-8 mx-auto mt-8 bg-white rounded shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Registration Form</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-1 text-sm font-semibold">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-1 text-sm font-semibold">Nama Lengkap:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-semibold">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1 text-sm font-semibold">Password (Minimal 6 karakter):</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleRegistration}
                        className="hover:bg-blue-700 px-4 py-2 text-white bg-blue-500 rounded"
                    >
                        Register
                    </button>
                </div>
                {error && <p className="mt-2 text-red-500">{error}</p>}
            </form>
        </div>
    );
}
