import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase';
import { auth } from './firebase';

export default function ScanHistory() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scanHistory, setScanHistory] = useState([]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return date.toLocaleString('id-ID'); // Use 'id-ID' locale for Indonesian format
    };

    const handleDateChange = async (date) => {
        setSelectedDate(date);

        try {
            const scanHistoryCollection = collection(firestore, 'history');
            const q = query(
                scanHistoryCollection,
                where('timestamp', '>=', new Date(date.getFullYear(), date.getMonth(), date.getDate())),
                where('timestamp', '<', new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))
            );

            const querySnapshot = await getDocs(q);
            const scanHistoryData = querySnapshot.docs.map((doc) => doc.data());
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
                                <span className="font-bold">User:</span> {scan.userUid} <br />
                                <span className="font-bold">Data:</span> {scan.scanned} <br />
                                <span className="font-bold">Waktu:</span> {formatTimestamp(scan.timestamp)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
