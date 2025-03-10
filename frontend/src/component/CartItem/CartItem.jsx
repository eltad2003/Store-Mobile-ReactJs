import { FavoriteBorder, Star } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CartItem.css'

function CartItem({ item }) {


    return (
        <div className="card my-3 shadow h-100">
            <div className="mt-2 text-center h-100">
                <Link
                    to={`/products/${item.id} `}
                    style={{ textDecoration: 'none' }}
                    className='p-2'
                >
                    <img src={item.image || " https://via.placeholder.com/150"} alt={item.category} width={150} height={150} className="img-hover" />
                </Link>
            </div>
            <div className="card-body mt-2">
                <h4 className="text-truncate">
                    <Link
                        to={`/products/${item.id} `}
                        className="text-decoration-none fw-bold fs-6 text-black"
                    >
                        {item.title}
                    </Link>
                </h4>

                {item.discount ? (
                    <div className='d-flex mt-2'>
                        <p className='text-decoration-line-through'>${Math.round(item.price * (1 + item.discount / 100))}</p>
                        <h5 className="text-success fw-bold mx-2">${item.price}</h5>
                        <p className='text-white bg-danger px-1 rounded-pill'> {item.discount}% off</p>
                    </div>
                ) : (
                    <h5 className="text-danger fw-bold ms-2">${item.price}</h5>
                )}
                <div className="d-flex">
                    {[...Array(5)].map(i => (
                        <Star className="text-warning mt-1 fs-5" />
                    ))}
                    <div className="ms-auto">
                        <span className="text-muted fs-6">Yêu thích</span>
                        <Link className="ms-1 text-danger"><FavoriteBorder /></Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CartItem