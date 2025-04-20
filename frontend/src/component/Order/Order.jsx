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
                console.log("Tạo đơn hàng thành công");
            }
            else {
                alert("Tạo đơn hàng thất bại")
                console.log("Tạo đơn hàng thất bại!");
            }
        } catch (error) {
            alert("Lỗi kết nối server")
            console.log("Lỗi kết nối API: ", error);
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
            console.log("Lỗi kết nối api: ", error);
        }
    }
    useEffect(() => {
        fetchAddress()
    }, [])


    return (

        <div className=''>
            {user ? (
                <div className='container w-50'>
                    <div className='mt-3'>
                        <Link to={'/cart'} className=''><ArrowBack /></Link>
                    </div>

                    <div className=' card p-3 mt-3'>
                        {selectedProducts.map(product => (
                            <div key={product.id} className='d-flex'>
                                <img src={product.listMedia[0]} alt={product.name} width={80} height={80} />
                                <div className='ms-3 fw-semibold w-100'>
                                    <p>{product.name}</p>
                                    <p className='text-danger fw-bold'>{formatPrice(product.price)}</p>
                                    <div className='d-flex'>
                                        <label className='ms-auto'>Số lượng: </label>
                                        <p className='text-danger ms-2'>{product.quantity}</p>
                                    </div>

                                </div>
                            </div>

                        ))}
                    </div>


                    <div className='mt-3'>
                        <h4 className='fw-semibold '>Thông tin khách hàng</h4>
                        <div className='card p-3'>
                            <div className='d-flex'>
                                <label >Tên: </label>
                                <p className='fw-bold ms-2'>{user.user.fullName} </p>
                            </div>
                            <div className='d-flex'>
                                <label className='form-label' >Điện thoại: </label>
                                <p className='fw-bold ms-2'>{user.user.phone}</p>
                            </div>

                            <div className='form-group'>
                                <label className='form-label' >Email: </label>
                                <input className='w-50 ms-2 form-control' type="email" defaultValue={user.user.email} />
                            </div>
                        </div>
                    </div>


                    <div className='mt-3 mb-4'>
                        <h4 className='fw-semibold'>Thông tin nhận hàng</h4>
                        <div className='card p-3'>

                            <div className='form-group'>
                                <label >Địa chỉ (Số nhà, Xã, Quận)</label>
                                <input className='w-50 ms-2 form-control' type="text" defaultValue={addresses.address} />
                            </div>
                            <div className='form-group'>
                                <label >Thành Phố</label>
                                <input className='w-50 ms-2 form-control' type="text" defaultValue={addresses.city} />
                            </div>
                            <div className='form-group'>
                                <label >Khu Vực</label>
                                <input className='w-50 ms-2 form-control' type="text" defaultValue={addresses.country} />
                            </div>
                        </div>
                    </div>
                    <div className='card mb-4 p-3'>
                        <div className='d-flex'>
                            <div className='d-grid'>
                                <p className='fw-bold mb-1'>Tổng tiền tạm tính:</p>
                                <p className='fst-italic'>Chưa tính chiết khấu</p>
                            </div>
                            <p className='ms-auto text-danger fw-bolder fs-5'>{formatPrice(cartItems.reduce((a, b) => (a + b.price * b.quantity), 0))}</p>
                        </div>

                        <button className='btn btn-danger' onClick={() => handleOrder()}>Tiếp tục</button>
                    </div>

                </div>
            ) : (
                <div className="container w-25 text-center mt-5 p-5">
                    <p>Vui lòng đăng nhập để tiếp tục.</p>
                    <Link to={'/login'}><button className='btn btn-danger w-100'>Đăng nhập</button></Link>
                </div>
            )}

        </div >

    )
}

export default Order