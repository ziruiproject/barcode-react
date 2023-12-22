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
        <div>
            <h1>Event History</h1>
            {reports.length === 0 ? (
                <p>No reports available.</p>
            ) : (
                <ul>
                    {reports.map((report, index) => (
                        <li key={index}>
                            <p>User ID: {report.userId}</p>
                            <p>Date: {report.date}</p>
                            <p>Title: {report.title}</p>
                            <p>Location: {report.location}</p>
                            <p>Description: {report.description}</p>
                            <p>Timestamp: {report.timestamp.toDate().toLocaleString()}</p>
                            <ul>
                                {report.photos.map((photo, photoIndex) => (
                                    <li key={photoIndex}>
                                        <p>Photo ID: {photo.id}</p>
                                        <img
                                            src={photo.url}
                                            alt={`Photo ${photoIndex}`}
                                            style={{ maxWidth: '200px' }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
