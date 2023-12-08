import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { auth } from "./firebase";
import { firestore } from "./firebase";
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

import successSound from './success.mp3'

export default function Camera() {
    const [result, setResult] = useState("");
    const [scanning, setScanning] = useState(false);
    const [torchOn, setTorchOn] = useState(false);

    const offlineScansKey = 'offlineScans';

    // Use Barcode Scanner
    const { ref } = useZxing({
        readers: [], // Empty array allows ZXing to attempt all supported barcode types
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

            // Check online status
            if (navigator.onLine) {
                // If online, add the result to Firestore
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
            } else {
                // If offline, store the result in localStorage
                const offlineScans = JSON.parse(localStorage.getItem(offlineScansKey)) || [];
                offlineScans.push({
                    userUid,
                    scanned: result.getText(),
                    timestamp,
                });
                localStorage.setItem(offlineScansKey, JSON.stringify(offlineScans));
            }

            // Set a delay before allowing the next scan
            setTimeout(() => {
                setScanning(false);
            }, 2000); // Adjust the delay time (in milliseconds) as needed
        },
    });

    const uploadOfflineScans = async () => {
        const offlineScans = JSON.parse(localStorage.getItem(offlineScansKey)) || [];

        for (const scan of offlineScans) {
            const barcodeResultsCollection = collection(firestore, `history`);

            await addDoc(barcodeResultsCollection, scan)
                .then(() => {
                    console.log('Offline scan uploaded successfully');
                })
                .catch((error) => {
                    console.error('Error uploading offline scan: ', error);
                });
        }

        // Clear offline scans from localStorage
        localStorage.removeItem(offlineScansKey);
    };

    const Logout = () => {
        uploadOfflineScans(); // Upload offline scans before logging out
        auth.signOut()
            .then(() => {
                console.log('Signed out successfully');
            })
            .catch((error) => {
                console.error('Error signing out:', error.message);
            });
    };

    const toggleTorch = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            if (capabilities.torch) {
                await track.applyConstraints({ advanced: [{ torch: torchOn }] });
                setTorchOn(!torchOn);
            } else {
                console.error('Torch is not supported on this device.');
            }

            stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
            console.error('Error toggling torch:', error);
        }
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
            <div className="flex flex-col items-center mt-0">
                <video
                    className="w-screen h-auto"
                    ref={ref}
                    style={{ objectFit: 'fill', maxHeight: '100vh' }}
                />
                <p className="md:text-4xl mt-4 text-lg font-semibold">
                    <span>Hasil: </span>
                    <span>{result}</span>
                </p>
                <div className="my-4 space-x-4">
                    <button className="md:text-3xl md:px-5 md:py-3 px-4 py-2 text-white bg-blue-500 rounded-md" onClick={toggleTorch}>
                        {torchOn ? 'Senter: Off' : 'Senter: On'}
                    </button>
                    <button className="md:text-3xl md:px-5 md:py-3 px-4 py-2 text-white bg-red-500 rounded-md" onClick={Logout}>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};
