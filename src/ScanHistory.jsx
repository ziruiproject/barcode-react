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
        return date.toLocaleString(); // Adjust the format based on your preference
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
            <h1 className="text-3xl font-bold mb-4">Scan History</h1>
            <div className="mb-4">
                <label className="mr-2">Select Date:</label>
                <DatePicker selected={selectedDate} onChange={handleDateChange} className="border p-2" />
            </div>
            <div>
                <p className="mb-2">Scan history for {selectedDate.toDateString()}:</p>
                {scanHistory.length === 0 ? (
                    <p className="text-gray-500">Tidak ada data</p>
                ) : (
                    <ul>
                        {scanHistory.map((scan, index) => (
                            <li key={index} className="border p-2 mb-2">
                                <span className="font-bold">Scanned:</span> {scan.scanned},{' '}
                                <span className="font-bold">Timestamp:</span> {formatTimestamp(scan.timestamp)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
