import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { auth } from "./firebase";
import { firestore } from "./firebase";
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import successSound from './success.mp3'

export default function Camera() {
    const [result, setResult] = useState("");
    const [scanning, setScanning] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [offline, setOffline] = useState(!navigator.onLine);

    const offlineScansKey = 'offlineScans';

    const { ref } = useZxing({
        readers: [],
        async onDecodeResult(result) {
            if (scanning) {
                return;
            }

            setScanning(true);
            setResult(result.getText());

            const audio = new Audio(successSound);

            const user = auth.currentUser;

            if (user && user.uid) {
                const userUid = user.uid;
                const unixEpochTime = Math.floor(new Date().getTime() / 1000);

                if (navigator.onLine) {
                    const barcodeResultsCollection = collection(firestore, 'history');
                    try {
                        await addDoc(barcodeResultsCollection, {
                            userUid,
                            scanned: result.getText(),
                            timestamp: unixEpochTime,
                        });
                    } catch (error) {
                        console.error('Error adding result to Firestore: ', error);
                    } finally {
                        audio.play();
                        handleScanSuccess();
                    }
                } else {
                    const offlineScans = JSON.parse(localStorage.getItem(offlineScansKey)) || [];
                    offlineScans.push({
                        userUid,
                        scanned: result.getText(),
                        timestamp: unixEpochTime,
                    });
                    localStorage.setItem(offlineScansKey, JSON.stringify(offlineScans));
                    audio.play();
                    handleScanSuccess();
                }
            } else {
                console.warn('No authenticated user found.');
            }

            setTimeout(() => {
                setScanning(false);
            }, 2000);
        },
    });

    const uploadOfflineScans = async () => {
        const offlineScans = JSON.parse(localStorage.getItem(offlineScansKey)) || [];

        for (const scan of offlineScans) {
            const barcodeResultsCollection = collection(firestore, `history`);

            await addDoc(barcodeResultsCollection, scan)
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
                await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
                setTorchOn(!torchOn);
            } else {
                console.error('Torch is not supported on this device.');
            }

            stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
            console.error('Error toggling torch:', error);
        }
    };

    const handleScanSuccess = () => {
        setShowSuccessPopup(true);
    };

    // Check User Auth State
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.replace('/login');
            }
        });

        return () => unsubscribe;
    }, []);

    // Listen for the online event to upload offline scans when back online
    useEffect(() => {
        const handleOnline = () => {
            uploadOfflineScans(); // Upload offline scans when back online
        };

        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    useEffect(() => {
        const handleOnline = () => {
            setOffline(false);
        };

        const handleOffline = () => {
            setOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            {offline && (
                <div className="fixed top-0 left-0 right-0 p-2 text-center text-white bg-red-500">
                    Anda Offline! Hasil scan akan diupload saat Anda kembali Online.
                </div>
            )}
            <div className="flex flex-col items-center mt-0">
                <video
                    className="w-screen h-auto"
                    ref={ref}
                    style={{ objectFit: 'fill', maxHeight: '100vh' }}
                />
                <div className="my-4 space-x-4">
                    <button className="md:text-3xl md:px-5 md:py-3 px-4 py-2 text-white bg-blue-500 rounded-md" onClick={toggleTorch}>
                        {torchOn ? 'Senter: Off' : 'Senter: On'}
                    </button>
                    <button className="md:text-3xl md:px-5 md:py-3 px-4 py-2 text-white bg-red-500 rounded-md" onClick={Logout}>
                        Logout
                    </button>
                </div>
            </div>

            {showSuccessPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 text-center bg-white rounded-md">
                        <p className="mb-4 text-2xl font-semibold">Scan Berhasil!</p>
                        <p className="mb-4 text-lg">Hasil: {result}</p>
                        <button
                            className="px-4 py-2 text-white bg-blue-500 rounded-md"
                            onClick={() => {
                                setShowSuccessPopup(false);
                                setResult("");
                                window.location.replace("/history/scan")
                            }}
                        >
                            Lihat Hasil
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
