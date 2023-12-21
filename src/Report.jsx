import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase'; // Import your Firebase configuration
import { useEffect } from 'react';
import { auth } from './firebase';

export default function Report() {
    const [reportDate, setReportDate] = useState('');
    const [reportTitle, setReportTitle] = useState('');
    const [reportLocation, setReportLocation] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reportPhotos, setReportPhotos] = useState([]);
    const [userId, setUserId] = useState('');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setReportPhotos(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create a reference to the 'reports' collection in Firestore
            const reportsCollection = collection(firestore, 'reports');

            // Add a new document with the report data and user ID
            const newReportRef = await addDoc(reportsCollection, {
                userId: userId,
                date: reportDate,
                title: reportTitle,
                location: reportLocation,
                description: reportDescription,
                photos: reportPhotos.map((photo) => photo.name), // Store photo names or URLs in Firestore
                timestamp: serverTimestamp(), // Server timestamp for when the report is submitted
            });

            console.log('Report added with ID:', newReportRef.id);
            window.location.replace('/history/');
        } catch (error) {
            console.error('Error adding report:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                console.log(userId)
            } else {
                console.error('User not authenticated.');
                window.location.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Lapor Kejadian</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="reportDate" className="mr-2">
                        Tanggal Laporan:
                    </label>
                    <input
                        type="date"
                        id="reportDate"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reportTitle" className="mr-2">
                        Judul Laporan:
                    </label>
                    <input
                        type="text"
                        id="reportTitle"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reportLocation" className="mr-2">
                        Lokasi Laporan:
                    </label>
                    <input
                        type="text"
                        id="reportLocation"
                        value={reportLocation}
                        onChange={(e) => setReportLocation(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reportDescription" className="mr-2">
                        Deskripsi Laporan:
                    </label>
                    <textarea
                        id="reportDescription"
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        className="border p-2"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reportPhotos" className="mr-2">
                        Foto Laporan:
                    </label>
                    <input
                        type="file"
                        id="reportPhotos"
                        onChange={handleFileChange}
                        className="border p-2"
                        multiple
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2">
                    Simpan
                </button>
            </form>
        </div>
    );
}
