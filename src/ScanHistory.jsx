import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase';
import { auth } from './firebase';
import { Link } from 'react-router-dom';

export default function ScanHistory() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scanHistory, setScanHistory] = useState([]);
    const [userUid, setUserUid] = useState("");

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta',
        };

        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedTime;
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);
    };

    const fetchData = async () => {
        try {
            const scanHistoryCollection = collection(firestore, 'history');
            const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

            if (!userUid) {
                return;
            }

            const q = query(
                scanHistoryCollection,
                where('userUid', '==', userUid),
                where('timestamp', '>=', startOfDay.getTime() / 1000),
                where('timestamp', '<', endOfDay.getTime() / 1000)
            );

            const querySnapshot = await getDocs(q);
            const scanHistoryData = [];

            for (const docSnapshot of querySnapshot.docs) {
                const historyData = docSnapshot.data();
                const userUid = historyData.userUid;

                const userDocRef = doc(collection(firestore, 'users'), userUid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    const displayName = userData.name;

                    historyData.displayName = displayName;
                }

                scanHistoryData.push(historyData);
            }

            scanHistoryData.sort((a, b) => b.timestamp - a.timestamp);

            setScanHistory(scanHistoryData);
        } catch (error) {
            console.error('Error fetching scan history:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserUid(user.uid);
            } else {
                window.location.replace('/login');
            }
        });

        return () => unsubscribe;
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedDate, userUid]);

    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

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
            <div className="mb-4">
                <label className="mr-2">Select Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    className="p-2 border rounded-md"
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            <div>
                <p className="mb-2">
                    Scan history on {formatDate(selectedDate)}
                </p>
                {scanHistory.length === 0 ? (
                    <p className="text-gray-500">No data</p>
                ) : (
                    <ul>
                        {scanHistory.map((scan, index) => (
                            <li key={index} className="p-4 mb-4 bg-gray-100 border rounded-md">
                                <div className="mb-2">
                                    <span className="font-bold">User:</span> {scan.displayName}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Data:</span> {scan.scanned}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Latitude:</span> {scan.coordinates?.latitude || 'N/A'}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Longitude:</span> {scan.coordinates?.longitude || 'N/A'}
                                </div>
                                <div>
                                    <span className="font-bold">Waktu:</span> {formatTimestamp(scan.timestamp)} WIB
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
