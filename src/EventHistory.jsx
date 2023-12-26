import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { firestore } from './firebase';
import { MutatingDots } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function EventHistory() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
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
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center align-middle h-screen">
                <MutatingDots
                    visible={true}
                    height="100"
                    width="100"
                    color="#2563EB"
                    secondaryColor="#2563EB"
                    radius="12.5"
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const filteredReports = reports.filter((report) => {
        const reportDate = new Date(report.date);
        return (
            reportDate.getFullYear() === selectedDate.getFullYear() &&
            reportDate.getMonth() === selectedDate.getMonth() &&
            reportDate.getDate() === selectedDate.getDate()
        );
    });


    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Riwayat Kejadian</h1>
            <DatePicker selected={selectedDate} onChange={handleDateChange} className="border p-2 mb-4" />
            {filteredReports.length === 0 ? (
                <p className="text-gray-500">Tidak ada kejadian pada tanggal ini.</p>
            ) : (
                <ul>
                    {filteredReports.map((report, index) => (
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
