import { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Camera() {
    const [result, setResult] = useState("");
    const { ref } = useZxing({
        onDecodeResult(result) {
            setResult(result.getText());
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