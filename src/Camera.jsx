import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { auth } from "./firebase";
import { firestore } from "./firebase";
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

import successSound from './success.mp3'

export default function Camera() {
    const [result, setResult] = useState("");
    const [scanning, setScanning] = useState(false);

    // Use Barcode Scanner
    const { ref } = useZxing({
        readers: [],
        async onDecodeResult(result) {
            if (scanning) {
                // If already scanning, ignore the result
                return;
            }

            setScanning(true);
            setResult(result.getText());

            // Play a success sound when a barcode is successfully scanned
            try {
                const audio = new Audio(successSound);
                audio.play();
            } catch (error) {
                console.error('Error playing sound:', error);
            }

            const user = auth.currentUser;
            const userUid = user.uid;
            const timestamp = serverTimestamp();

            // Add the result to Firestore
            const barcodeResultsCollection = collection(firestore, `history`);

            // Create a new document with user UID, result, and timestamp
            await addDoc(barcodeResultsCollection, {
                userUid,
                scanned: result.getText(),
                timestamp,
            })
                .then(() => {
                    console.log('Result added to Firestore successfully');
                })
                .catch((error) => {
                    console.error('Error adding result to Firestore: ', error);
                });

            // Set a delay before allowing the next scan
            setTimeout(() => {
                setScanning(false);
            }, 2000); // Adjust the delay time (in milliseconds) as needed
        },
    });

    const Logout = () => {
        auth.signOut()
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
            console.log(user);
            if (!user) {
                window.location.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <video className="" ref={ref} />
            <p>
                <span>Hasil: </span>
                <span>{result}</span>
                <button onClick={Logout}>
                    Logout
                </button>
            </p>
        </>
    );
};