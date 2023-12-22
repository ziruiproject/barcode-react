import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase';

export default function EventHistory() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const reportsCollection = collection(firestore, 'reports');
                const querySnapshot = await getDocs(reportsCollection);
                const reportsData = querySnapshot.docs.map((doc) => doc.data());
                setReports(reportsData);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setError('Error fetching reports. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []); // Empty dependency array ensures that the effect runs once when the component mounts

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Laporan Kejadian</h1>
            {reports.length === 0 ? (
                <p className="text-gray-500">No reports available.</p>
            ) : (
                <ul>
                    {reports.map((report, index) => (
                        <li key={index} className="border p-4 mb-4">
                            <p className="font-bold mb-2">User: {report.userId}</p>
                            <p>Tanggal: {report.date}</p>
                            <p>Judul: {report.title}</p>
                            <p>Lokasi: {report.location}</p>
                            <p>Deskripsi: {report.description}</p>
                            <p>Waktu: {report.timestamp.toDate().toLocaleString()}</p>
                            <div className="mt-4">
                                <p className="font-bold mb-2">Gambar:</p>
                                <ul className="grid grid-cols-2 gap-4">
                                    {report.photos.map((photo, photoIndex) => (
                                        <li key={photoIndex} className="border p-2">
                                            <img
                                                src={photo.url}
                                                alt={`Photo ${photoIndex}`}
                                                className="w-full h-auto"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
