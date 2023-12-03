import { useState } from "react";
import { useZxing } from "react-zxing";

export default function Camera() {
    const [result, setResult] = useState("");
    const { ref } = useZxing({
        onDecodeResult(result) {
            setResult(result.getText());
        },
    });

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