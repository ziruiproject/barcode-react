import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase';
import { auth } from './firebase';

export default function ScanHistory() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scanHistory, setScanHistory] = useState([]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

        // Set the timezone to 'Asia/Jakarta' (WIB)
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Asia/Jakarta'
        };

        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);

        return formattedTime;
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);

        try {
            const scanHistoryCollection = collection(firestore, 'history');
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

            const q = query(
                scanHistoryCollection,
                where('timestamp', '>=', startOfDay.getTime() / 1000),
                where('timestamp', '<', endOfDay.getTime() / 1000)
            );

            const querySnapshot = await getDocs(q);
            const scanHistoryData = [];

            for (const docSnapshot of querySnapshot.docs) {
                const historyData = docSnapshot.data();
                const userUid = historyData.userUid;

                // Fetch user data using userUid from Firebase Authentication
                const userDocRef = doc(collection(firestore, 'users'), userUid);

                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    console.log(userData)
                    const displayName = userData.displayName;

                    // Add displayName to historyData
                    historyData.displayName = displayName;
                }

                scanHistoryData.push(historyData);
            }

            // console.log('Fetched Scan History Data:', scanHistoryData);
            setScanHistory(scanHistoryData);

        } catch (error) {
            console.error('Error fetching scan history:', error);
        }
    };

    const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    };

    useEffect(() => {
        // Fetch scan history for the initial selected date (today)
        handleDateChange(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user);
            if (!user) {
                window.location.replace('/login');
            }
        });

        return () => unsubscribe;
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Riwayat Scan</h1>
            <div className="mb-4">
                <label className="mr-2">Select Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    className="border p-2"
                    dateFormat="dd/MM/yyyy"  // Set the date format here
                />
            </div>
            <div>
                <p className="mb-2">Riwayat hasil scan pada {formatDate(selectedDate)}</p>
                {scanHistory.length === 0 ? (
                    <p className="text-gray-500">Tidak ada data</p>
                ) : (
                    <ul>
                        {scanHistory.map((scan, index) => (
                            <li key={index} className="border p-2 mb-2">
                                <span className="font-bold">User:</span> {scan.displayName} <br />
                                <span className="font-bold">Data:</span> {scan.scanned} <br />
                                <span className="font-bold">Waktu:</span> {formatTimestamp(scan.timestamp)} <span>WIB</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
