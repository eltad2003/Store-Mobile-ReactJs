import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../CartProvider'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowBack, RemoveShoppingCart } from '@mui/icons-material';
import { AuthContext } from '../AuthProvider';
import formatPrice from '../../formatPrice';
import './Cart.css'

function Cart() {
    const { cartItems, removeFromCart, increaseItem, decreaseItem, selectedItems, toggleSelectItem, selectAllItems, updateQuantity } = useContext(CartContext);
    const { user } = useContext(AuthContext)
    const navigation = useNavigate()

    // Tính tổng giá dựa trên sản phẩm đã chọn
    const totalPrice = cartItems
        .filter((item) => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = (e) => {
        if (selectedItems.length === 0) {
            e.preventDefault()
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!")
        }
    }

    return (
        <div className="container py-4">
            {cartItems.length === 0 ? (
                <div className=" d-grid justify-content-center align-items-center mt-3 text-center">
                    <h4 className='fw-bold mb-3'> Giỏ hàng trống</h4>
                    <RemoveShoppingCart className='w-100 h-50 text-danger' />
                    <p className='text-muted'>Không có sản phẩm nào trong giỏ hàng.</p>
                    <Link to={'/'}><button className='btn bg text-white w-100'>Tiếp tục mua sắm</button></Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm mb-4  position-sticky top-0">
                            <div className="card-header bg-cart text-white py-3">
                                <div className="d-flex align-items-center">
                                    <Link to="/" className="text-decoration-none text-white me-3">
                                        <ArrowBack />
                                    </Link>
                                    <h5 className="mb-0">Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="selectAll"
                                            onChange={selectAllItems}
                                            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                                        />
                                        <label className="form-check-label fw-semibold" htmlFor="selectAll">
                                            Chọn tất cả
                                        </label>
                                    </div>
                                </div>

                                {cartItems.map((product) => (
                                    <div key={product.id} className=" mb-3 border-0">
                                        <div className="card-body p-3">
                                            <div className="row align-items-center">
                                                <div className="col-auto">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`product-${product.id}`}
                                                            checked={selectedItems.includes(product.id)}
                                                            onChange={() => toggleSelectItem(product.id)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <img
                                                        src={product.listMedia[0]}
                                                        alt={product.name}
                                                        className="rounded-3"
                                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <h6 className="mb-1 fw-bold">{product.name}</h6>
                                                    <p className='text-muted fst-italic fs-6'>Còn: {product.stockQuantity} SP</p>
                                                    {product.discount ? (
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="text-decoration-line-through text-muted me-2">
                                                                {formatPrice(Math.round(product.price * (1 + product.discount / 100)))}
                                                            </span>
                                                            <span className="badge bg-cart me-2">-{product.discount}%</span>
                                                            <span className="text-success fw-bold">{formatPrice(product.price)}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="mb-2">
                                                            <span className="text-danger fw-bold">{formatPrice(product.price)}</span>
                                                        </div>
                                                    )}
                                                    <div className="d-flex align-items-center">
                                                        <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => decreaseItem(product)}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="form-control text-center"
                                                                value={product.quantity}
                                                                onChange={(e) => updateQuantity(product, e.target.value)}

                                                            />
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => increaseItem(product)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            className="btn btn-link text-danger ms-3 p-0"
                                                            onClick={() => removeFromCart(product.id)}
                                                        >
                                                            <i className="bi bi-trash"></i> Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow position-sticky top-0" style={{ top: '20px' }}>
                            <div className="card-header bg-cart text-white py-3 ">
                                <h5 className="mb-0">Thông tin đơn hàng</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tổng tiền hàng:</span>
                                    <span className="fw-bold">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="text-success">Miễn phí</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Khuyến mãi:</span>
                                    <span className="text-success">-0đ</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold">Tổng cộng:</span>
                                    <span className="h5 mb-0 text-danger fw-bold">{formatPrice(totalPrice)}</span>
                                </div>

                                {user ? (
                                    <Link to="/order" onClick={handleCheckout} className="text-decoration-none">
                                        <button className="btn bg text-white w-100 py-2">
                                            Thanh toán
                                        </button>
                                    </Link>
                                ) : (
                                    <Link to="/login" onClick={() => alert("Bạn cần đăng nhập để thanh toán")} className="text-decoration-none">
                                        <button className="btn bg text-white w-100 py-2">
                                            Đăng nhập để thanh toán
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart
