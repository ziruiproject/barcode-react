// Scanner.js
import React, { useState } from "react";
import { useZxing } from "react-zxing";
import { firestore } from "../firebase";

const Scanner = ({ user, handleLogout }) => {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      if (user) {
        console.log(user.uid)
        const result = firestore.collection("history").add({
          userId: user.uid,
          result: result.getText(),
          timestamp: new Date(),
        });

        result
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      }
    },
  });

  return (
    <div>
      <video ref={ref} />
      <p>
        <span>Result: </span>
        <span>{result}</span>
      </p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Scanner;
