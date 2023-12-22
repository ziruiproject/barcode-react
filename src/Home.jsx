import React from 'react'

export default function Home() {

    return (
        <div className=' flex flex-col items-center justify-center h-screen'>
            <button onClick={() => { window.location.replace('/camera') }}
                className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                Scan di Lokasi
            </button>
            <button onClick={() => { window.location.replace('/history/scan') }}
                className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                History Scan
            </button>
            <button onClick={() => { window.location.replace('/lapor') }}
                className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                Lapor Kejadian
            </button>
            <button onClick={() => { window.location.replace('/history/lapor') }}
                className="hover:bg-blue-700 flex items-center justify-center w-64 h-12 px-6 mt-8 text-sm font-semibold text-blue-100 bg-blue-600 rounded">
                History Kejadian
            </button>
        </div>
    )
}
