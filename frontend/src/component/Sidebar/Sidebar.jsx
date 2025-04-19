import { Tv, Speaker, LaptopChromebook, PhoneIphone, SportsEsports, Roofing } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {

    const [menu, setMenu] = useState('')
    return (
        <div className="sidebar card shadow p-2 h-100">
            <ul className="list-unstyled p-3 fw-semibold">
                <li className="mt-3 d-flex align-items-center">
                    <Tv />
                    <Link className="text-decoration-none text-black ms-2" to="/tv" onClick={() => setMenu('tv')}>TV</Link>
                </li>
                <li className="mt-3 d-flex align-items-center">
                    <Speaker />
                    <Link className="text-decoration-none text-black ms-2" to="/audio" onClick={() => setMenu('audio')}>Audio</Link>
                </li>
                <li className="mt-3 d-flex align-items-center">
                    <LaptopChromebook />
                    <Link className="text-decoration-none text-black ms-2" to="/laptop" onClick={() => setMenu('laptop')}>Laptop</Link>
                </li>
                <li className="mt-3 d-flex align-items-center">
                    <PhoneIphone />
                    <Link className="text-decoration-none text-black ms-2" to="/mobile" onClick={() => setMenu('mobile')}>Mobile</Link>
                </li>
                <li className="mt-3 d-flex align-items-center">
                    <SportsEsports />
                    <Link className="text-decoration-none text-black ms-2" to="/gaming" onClick={() => setMenu('gaming')}>Gaming</Link>
                </li>
                <li className="mt-3 d-flex align-items-center">
                    <Roofing />
                    <Link className="text-decoration-none text-black ms-2" to="/appliances" onClick={() => setMenu('appliances')}>Gia dụng</Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar