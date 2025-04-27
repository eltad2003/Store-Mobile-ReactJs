import { Tv, Speaker, LaptopChromebook, PhoneIphone, SportsEsports, Roofing, ChevronRight } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
    const [menu, setMenu] = useState('')

    const categories = [
        { icon: <Tv />, name: 'TV', path: '/tv' },
        { icon: <Speaker />, name: 'Audio', path: '/audio' },
        { icon: <LaptopChromebook />, name: 'Laptop', path: '/laptop' },
        { icon: <PhoneIphone />, name: 'Mobile', path: '/mobile' },
        { icon: <SportsEsports />, name: 'Gaming', path: '/gaming' },
        { icon: <Roofing />, name: 'Gia dụng', path: '/appliances' }
    ]

    return (
        <div className="card sidebar rounded-3 h-100 me-3 border-0 shadow-sm">

            <ul className="list-unstyled mb-0">
                {categories.map((category, index) => (
                    <li key={index} className=" fw-bold">
                        <Link
                            className={`d-flex align-items-center justify-content-between text-decoration-none text-dark  py-2 px-4 ${menu === category.name.toLowerCase() ? 'active' : ''}`}
                            to={category.path}
                            onClick={() => setMenu(category.name.toLowerCase())}
                        >
                            <div className="d-flex align-items-center">
                                <span className="category-icon me-3">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </div>
                            <ChevronRight className="text-muted" />
                        </Link>
                    </li>
                ))}
            </ul>

        </div>
    )
}

export default Sidebar