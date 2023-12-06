import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { auth } from "./firebase";
import { firestore } from "./firebase";
import BarcodeScanner from "./BarcodeScanner";
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

export default function Camera() {
    // const [result, setResult] = useState("");

    // // Use Barcode Scanner
    // const { ref } = useZxing({
    //     async onDecodeResult(result) {
    //         setResult(result.getText());
    //         const user = auth.currentUser;

    //         const userUid = user.uid;
    //         const timestamp = serverTimestamp();

    //         // Add the result to Firestore
    //         const barcodeResultsCollection = collection(firestore, `history`);

    //         // Create a new document with user UID, result, and timestamp
    //         await addDoc(barcodeResultsCollection, {
    //             userUid,
    //             scanned: result.getText(),
    //             timestamp,
    //         })
    //             .then(() => {
    //                 console.log('Result added to Firestore successfully');
    //             })
    //             .catch((error) => {
    //                 console.error('Error adding result to Firestore: ', error);
    //             });

    //     },
    // });

    const Logout = () => {
        auth.signOut(auth)
            .then(() => {
                console.log('Signed out successfully');
            })
            .catch((error) => {
                console.error('Error signing out:', error.message);
            });
    };

    // Check User Auth State
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user)
            if (!user) {
                window.location.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    const [scannedData, setScannedData] = useState('');

    const handleScan = (data) => {
        setScannedData(data);
    };


    return (
        <>
            <div>
                <h1>Barcode Scanner App</h1>
                <BarcodeScanner onScan={handleScan} />
                {scannedData && <p>Scanned Data: {scannedData}</p>}
            </div>
        </>
    );
};