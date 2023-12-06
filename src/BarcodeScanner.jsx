// BarcodeScanner.js
import React, { useRef, useEffect } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

const BarcodeScanner = ({ onScan }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserBarcodeReader();
        let videoStream;

        codeReader
            .getVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length > 0) {
                    return codeReader.decodeOnceFromVideoDevice(videoInputDevices[0].deviceId, videoRef.current);
                }
            })
            .then((result) => {
                onScan(result.text);
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            codeReader.reset();
            if (videoStream) {
                videoStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [onScan]);

    return <video ref={videoRef} playsInline autoPlay style={{ width: '100%', height: '100vh' }} />
};

export default BarcodeScanner;
