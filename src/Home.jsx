import React from 'react'

export default function Home() {

    return (
        <div>
            <button onClick={() => { window.location.replace('/camera') }}>
                Scan di Lokasi
            </button>
            <button onClick={() => { window.location.replace('/history/scan') }}>
                History Scan
            </button>
            <button onClick={() => { window.location.replace('/') }}>
                Lapor Kejadian
            </button>
            <button onClick={() => { window.location.replace('/camera') }}>
                History Kejadian
            </button>
        </div>
    )
}
