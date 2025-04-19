import { FavoriteBorder, Star } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CartItem.css'

function CartItem({ item }) {
    return (
        <div className="card my-2 shadow h-100">
            <div className="mt-2 text-center h-100">
                <Link
                    to={`/products/${item.id}`}
                    style={{ textDecoration: 'none' }}
                    className='p-2 d-block'
                >
                    <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.category}
                        className="img-fluid img-hover"
                        style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                    />
                </Link>
            </div>
            <div className="card-body mt-2 px-3">
                <h4 className="text-truncate mb-2">
                    <Link
                        to={`/products/${item.id}`}
                        className="text-decoration-none fw-bold fs-6 text-black"
                    >
                        {item.title}
                    </Link>
                </h4>

                {item.discount ? (
                    <div className='d-flex align-items-center flex-wrap gap-2 mb-2'>
                        <p className='text-decoration-line-through mb-0'>${Math.round(item.price * (1 + item.discount / 100))}</p>
                        <h5 className="text-success fw-bold mb-0">${item.price}</h5>
                        <p className='text-white bg-danger px-2 rounded-pill mb-0'>{item.discount}% off</p>
                    </div>
                ) : (
                    <h5 className="text-danger fw-bold mb-2">${item.price}</h5>
                )}
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                        {[...Array(5)].map((_, index) => (
                            <Star key={index} className="text-warning fs-6" />
                        ))}
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="text-muted small d-none d-sm-inline">Yêu thích</span>
                        <Link className="ms-1 text-danger"><FavoriteBorder /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem