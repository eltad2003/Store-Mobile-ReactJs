import { FavoriteBorder, Star } from '@mui/icons-material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './CartItem.css'
import formatPrice from '../../formatPrice'

function CartItem({ item }) {

    return (
        <div className="card h-100 shadow rounded-4 p-2 d-flex justify-content-between" >
            {/* Badge khuyến mãi */}
            {item.discount ? (
                <div className="position-absolute top-0 start-0 bg text-white px-2 py-1 rounded-end-3 z-1">
                    Giảm {item.discount}%
                </div>
            ) : (
                <span></span>
            )}


            {/* Ảnh */}
            <div className="text-center h-100" style={{ minHeight: '150px' }}>
                <Link
                    to={`/products/${item.id}`}
                    style={{ textDecoration: 'none' }}
                    className='p-2 '
                >
                    <img
                        src={item.listMedia[0] || "https://via.placeholder.com/150"}
                        alt={item.category}
                        width={150}
                        height={150}
                        className='img-fluid img-hover '
                    />
                </Link>
            </div>

            {/* Thông tin */}
            <div className="mt-2 px-2 py-3 h-100">
                <h6 className="fw-semibold flex-wrap" title={item.name} style={{ minHeight: '30px' }} >
                    <Link
                        to={`/products/${item.id}`}
                        className="text-decoration-none fw-bold fs-6 text-black"
                    >
                        {item.name}
                    </Link>
                </h6>
                <div>
                    {item.discount ? (
                        <div className="d-flex gap-1 flex-wrap align-items-center">
                            <span className="text-success fw-bold me-1">{formatPrice(item.price)}</span>
                            <span className="text-muted text-decoration-line-through small">
                                {formatPrice(Math.round(item.price * (1 + item.discount / 100)))}
                            </span>
                        </div>
                    ) : (
                        <span className="text-danger fw-bold">{formatPrice(item.price)}</span>
                    )}
                </div>
                <div className="small text-muted mt-1 bg-light rounded-3">
                    Không phí chuyển đổi khi trả góp 0%
                </div>
            </div>

            {/* Đánh giá và yêu thích */}
            <div className="px-2 py-2 d-flex justify-content-between align-items-center mt-auto border-top">
                <div className="d-flex">
                    {[...Array(5)].map((_, index) => (
                        <Star key={index} className="text-warning fs-6" />
                    ))}
                </div>
                <div className="text-muted small d-flex align-items-center">
                    <Link className="ms-1 " style={{ color: 'red' }}><FavoriteBorder /></Link>
                    <span className="d-none d-md-none d-lg-block me-1">Yêu thích</span>
                </div>
            </div>
        </div>
    )
}

export default CartItem