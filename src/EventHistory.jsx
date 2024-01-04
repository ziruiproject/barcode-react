import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
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
                const reportsData = [];

                for (const docSnapshot of querySnapshot.docs) {
                    const reportData = docSnapshot.data();
                    const userUid = reportData.userId;

                    // Fetch user data using userUid from Firebase Authentication
                    const userDocRef = doc(collection(firestore, 'users'), userUid);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        const displayName = userData.displayName;

                        // Add displayName to reportData
                        reportData.displayName = displayName;
                    }

                    reportsData.push(reportData);
                }

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
            <div className="flex items-center justify-center h-screen align-middle">
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
        <div className="max-w-2xl p-4 mx-auto">
            <h1 className="mb-4 text-3xl font-bold">Riwayat Kejadian</h1>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="p-2 mb-4 border"
                dateFormat="dd/MM/yyyy"  // Set the date format here
            />
            {filteredReports.length === 0 ? (
                <p className="text-gray-500">Tidak ada kejadian pada tanggal ini.</p>
            ) : (
                <ul>
                    {filteredReports.map((report, index) => (
                        <li key={index} className="p-4 mb-4 border">
                            <p className="mb-2 font-bold">User: {report.displayName}</p>
                            <p>
                                Tanggal: {new Intl.DateTimeFormat('id-ID', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                }).format(new Date(report.date))}
                            </p>
                            <p>Judul: {report.title}</p>
                            <p>Lokasi: {report.location}</p>
                            <p>Deskripsi: {report.description}</p>
                            <p>Waktu: {report.timestamp.toDate().toLocaleString()}</p>
                            <div className="mt-4">
                                <p className="mb-2 font-bold">Gambar:</p>
                                <ul className="grid grid-cols-2 gap-4">
                                    {report.photos.map((photo, photoIndex) => (
                                        <li key={photoIndex} className="p-2 border">
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
