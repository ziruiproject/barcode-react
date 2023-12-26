import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

export default function Ganti() {
    const [auth, setAuth] = useState(null);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        const authInstance = getAuth();
        setAuth(authInstance);
        console.log(authInstance.currentUser);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName,
            });
            console.log('Profile updated successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
            <div className='flex items-center justify-center align-middle h-screen'>
                <h1>{auth && auth.currentUser ? `User: ${auth.currentUser.displayName}` : 'Loading...'}</h1>
                <form>
                    <input
                        type="text"
                        placeholder='Masukkan nama'
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <button onClick={handleSubmit}>Update Profile</button>
                </form>
            </div>
        </>
    );
}
