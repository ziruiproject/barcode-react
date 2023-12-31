import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth } from './firebase';

export default function Home() {

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.replace('/login');
            }
        });

        return () => unsubscribe;
    }, []);

    const Logout = () => {
        auth.signOut()
            .catch((error) => {
                console.error('Error signing out:', error.message);
            });
    };

    return (
        <ul className=' flex flex-col items-center justify-center h-screen'>
            <img src="/logo.png" className='h-[256px]' alt="" />
            <Link to="/scan">
                <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                    Scan di Lokasi
                </li>
            </Link>
            <Link to="/history/scan">
                <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                    Scan History
                </li>
            </Link>
            <Link to="/lapor">
                <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                    Lapor Kejadian
                </li>
            </Link>
            <Link to="/history/kejadian">
                <li className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                    History Kejadian
                </li>
            </Link>
            <Link to="/login">
                <button onClick={Logout} className="hover:bg-red-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-red-600 rounded">
                    Logout
                </button>
            </Link>
        </ul>
    )
}
