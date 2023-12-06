// Example of using Instascan in React
import React, { useEffect } from 'react';
import Instascan from 'instascan';

const BarcodeScanner = ({ onScan }) => {
    useEffect(() => {
        const scanner = new Instascan.Scanner({ video: document.getElementById('scanner-video') });

        scanner.addListener('scan', (content) => {
            onScan(content);
        });

        Instascan.Camera.getCameras().then((cameras) => {
            if (cameras.length > 0) {
                scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        });

        return () => {
            scanner.stop();
        };
    }, [onScan]);

    return <video id="scanner-video" playsInline autoPlay style={{ width: '100%', height: '100vh' }} />;
};

export default BarcodeScanner;
