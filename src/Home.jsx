import React from 'react'

export default function Home() {

    return (
        <div>
            <button onClick={() => {
                window.location.replace('/camera')
            }}> Scan </button>
        </div>
    )
}
