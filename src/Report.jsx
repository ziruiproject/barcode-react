import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';
import { firestore } from './firebase'; // Import your Firebase configuration
import { auth } from './firebase';
import { v4 as uuidv4 } from 'uuid';

export default function Report() {
    const [reportDate, setReportDate] = useState('');
    const [reportTitle, setReportTitle] = useState('');
    const [reportLocation, setReportLocation] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [reportPhotos, setReportPhotos] = useState([]);
    const [userId, setUserId] = useState('');

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        setReportPhotos((prevPhotos) => [
            ...prevPhotos,
            ...files.map((file) => ({
                file,
                id: uuidv4(),
                storageRef: null, // Reference to the image in Firebase Storage
                url: null, // URL to display or download the image
            })),
        ]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const storage = getStorage();

            // Upload each image to Firebase Storage
            for (const photo of reportPhotos) {
                const storageRef = ref(storage, `reports/${photo.id}`);
                await uploadBytes(storageRef, photo.file);
                photo.storageRef = storageRef;

                // Get the download URL for each uploaded image
                const downloadURL = await getDownloadURL(storageRef);
                photo.url = downloadURL;
            }

            // Create a reference to the 'reports' collection in Firestore
            const reportsCollection = collection(firestore, 'reports');

            // Get the current user ID from Firebase Authentication
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
            } else {
                console.error('User not authenticated.');
                return;
            }

            // Add a new document with the report data and user ID
            await addDoc(reportsCollection, {
                userId: userId,
                date: reportDate,
                title: reportTitle,
                location: reportLocation,
                description: reportDescription,
                photos: reportPhotos.map((photo) => ({
                    id: photo.id,
                    url: photo.url,
                })),
                timestamp: Math.floor(new Date().getTime() / 1000),
            });
            window.location.replace('/history/kejadian');
        } catch (error) {
            console.error('Error adding report:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.error('User not authenticated.');
                window.location.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="max-w-2xl p-4 mx-auto">
            <h1 className="mb-4 text-3xl font-bold">Lapor Kejadian</h1>
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
                        className="p-2 border"
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
                        className="p-2 border"
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
                        className="p-2 border"
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
                        className="p-2 border"
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
                        className="p-2 border"
                        multiple
                    />
                </div>
                <button type="submit" className="p-2 text-white bg-blue-500">
                    Simpan
                </button>
            </form>
        </div>
    );
}
