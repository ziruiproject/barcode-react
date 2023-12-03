import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { auth } from "./firebase";
import { firestore } from "./firebase";
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

export default function Camera() {
    const [result, setResult] = useState("");
    const { ref } = useZxing({
        async onDecodeResult(result) {
            setResult(result.getText());
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

        },
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user)
            if (!user) {
                // Redirect or show login form
                // Example: Redirect to the login page
                window.location.replace('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <video ref={ref} />
            <p>
                <span>Hasil: </span>
                <span>{result}</span>
            </p>
        </>
    );
};