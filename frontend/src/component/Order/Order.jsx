import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../CartProvider'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { AuthContext } from '../AuthProvider'
import formatPrice from '../../formatPrice'

function Order() {
    const { user } = useContext(AuthContext)
    const { cartItems, selectedItems } = useContext(CartContext)
    const [addresses, setAddresses] = useState({})
    const navigate = useNavigate()
    const [order, setOrder] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('order'))
        return storage ?? []
    })
    const selectedProducts = cartItems.filter(item => selectedItems.includes(item.id));

    const handleOrder = async () => {
        try {
            const orderItems = selectedProducts.map(product => ({
                productId: product.id,
                quantity: product.quantity
            }));

            const res = await fetch('http://localhost:8080/orders', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify(orderItems)
            })
            if (res.ok) {
                const data = await res.json()
                setOrder(data)
                localStorage.setItem('order', JSON.stringify(data))
                alert('Tạo đơn hàng thành công, chuyển tới thanh toán')
                navigate('/order/payment')
            } else {
                alert("Tạo đơn hàng thất bại")
            }
        } catch (error) {
            alert("Lỗi kết nối server")
            console.error("Lỗi kết nối API: ", error);
        }
    }

    const fetchAddress = async () => {
        try {
            const res = await fetch('http://localhost:8080/user/address', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            })
            const data = await res.json()
            setAddresses(data)
        } catch (error) {
            console.error("Lỗi kết nối api: ", error);
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [])

    if (!user) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body text-center p-5">
                                <h5 className="card-title mb-4">Vui lòng đăng nhập để tiếp tục</h5>
                                <Link to="/login" className="btn btn-danger w-100">
                                    Đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex align-items-center mb-4">
                        <Link to="/cart" className="text-decoration-none text-dark">
                            <ArrowBack className="me-2" />
                        </Link>
                        <h4 className="mb-0">Đơn hàng của bạn</h4>
                    </div>

                    {/* Selected Products Section */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Sản phẩm đã chọn ({selectedItems.length})</h5>
                            {selectedProducts.map(product => (
                                <div key={product.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                                    <img
                                        src={product.listMedia[0]}
                                        alt={product.name}
                                        className="rounded-3"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-1">{product.name}</h6>
                                        <p className="text-danger fw-bold mb-1">{formatPrice(product.price)}</p>
                                        <div className="d-flex align-items-center">
                                            <span className="text-muted">Số lượng:</span>
                                            <span className="ms-2 fw-semibold">{product.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Information Section */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Thông tin khách hàng</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-2">Tên:</span>
                                        <span className="fw-semibold">{user.user.fullName}</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-2">Điện thoại:</span>
                                        <span className="fw-semibold">{user.user.phone}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        defaultValue={user.user.email}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information Section */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Thông tin nhận hàng</h5>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Địa chỉ (Số nhà, Xã, Quận)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={addresses.address}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Thành phố</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={addresses.city}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Khu vực</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        defaultValue={addresses.country}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 className="mb-1">Tổng tiền tạm tính</h6>
                                    <small className="text-muted">Chưa tính chiết khấu</small>
                                </div>
                                <h4 className="text-danger mb-0">
                                    {formatPrice(selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0))}
                                </h4>
                            </div>
                            <button
                                className="btn btn-danger w-100 py-2"
                                onClick={handleOrder}
                            >
                                Tiếp tục thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order