import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase';
import { auth } from './firebase';
import { Link } from 'react-router-dom';

export default function ScanHistory() {
    const [selectedDate, setSelectedDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)).getTime());
    const [userUid, setUserUid] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [userData, setUserData] = useState(null)

    const handleDateChange = (date) => {
        setSelectedDate(new Date(date.setHours(0, 0, 0, 0)));
    };

    const fetchData = async () => {
        try {

            if (!userUid) {
                return;
            }

            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);

            const startOfDayTimestamp = Math.floor(startOfDay.getTime() / 1000);
            const endOfDayTimestamp = Math.floor(endOfDay.getTime() / 1000);

            const ref = collection(firestore, 'histories');
            const historyQuery = query(
                ref,
                where('userData.uid', '==', userUid),
                where('timestamp', '>=', startOfDayTimestamp),
                where('timestamp', '<=', endOfDayTimestamp)
            );

            const historyDocs = await getDocs(historyQuery);

            setHistoryData(historyDocs.docs.map(docSnapshot => docSnapshot.data()));
        } catch (error) {
            console.error('Error fetching history data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                window.location.replace('/login');
                return;
            }

            setUserUid(user.uid);

            const userQuery = query(collection(firestore, 'users'), where('uid', '==', user.uid));
            const userDocQuery = await getDocs(userQuery);

            if (userDocQuery.docs.length > 0) {
                const userDocSnapshot = userDocQuery.docs[0];

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    console.log('userData:', userData);
                    setUserData(userData);
                } else {
                    console.error('User document is empty for userUid:', userUid);
                }
            } else {
                console.error('No user document found for userUid:', userUid);
            }

            await fetchData(); // Fetch data after setting userUid
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchData();
    }, [userUid, selectedDate]);

    return (
        <div className="max-w-2xl p-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h1 className="mb-2 text-3xl font-bold">Scan History</h1>
                <Link to="/scan">
                    <button className="hover:bg-blue-700 px-4 py-2 text-white transition-all duration-300 ease-in-out bg-blue-500 rounded-md">
                        Scan
                    </button>
                </Link>
            </div>
            <div className="gap-y-5 flex flex-col">
                <div className='gap-y-1 grid'>
                    <label className="">Select Date:</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        className="p-2 border rounded-md"
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                {userData && userData.roleId >= 2 && (
                    <select>
                        <option value="0">Diri Sendiri</option>
                        <option value="0">Satu Regu</option>
                        <option value="0">Option Text</option>
                    </select>
                )}
            </div>
            <div className='gap-y-5 grid'>
                {historyData.map((historyItem, index) => (
                    <div key={index} className=" rounded-xl gap-y-5 grid p-4 shadow-md">
                        <div className='flex justify-between'>
                            <span className='text-xl font-medium'>{historyItem.userData.displayName}</span>
                            <span className='w-fit px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full'>Regu {historyItem.userData.reguId}</span>
                        </div>
                        <span className='text-xl'>{historyItem.scanned}</span>
                        <div className='flex justify-between'>
                            <span className='w-fit px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full'>{new Date(historyItem.timestamp * 1000).toLocaleTimeString('en-US', { hour12: false })} WIB</span>
                            <span className='w-fit gap-x-1 flex px-3 py-1 text-sm text-blue-500 bg-blue-100 rounded-full'>
                                <span className=''>
                                    {historyItem.coordinates.latitude}
                                </span>,
                                <span className=''>
                                    {historyItem.coordinates.longitude}
                                </span>
                            </span>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
