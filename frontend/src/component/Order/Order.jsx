import React, { useContext } from 'react'
import { CartContext } from '../CartProvider'
import { Link } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { AuthContext } from '../AuthProvider'

function Order() {
    const { cartItems, selectedItems } = useContext(CartContext)
    const { user } = useContext(AuthContext)
    const selectedProducts =  cartItems.filter(item => selectedItems.includes(item.id));
    

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
                                <img src={product.image} alt={product.title} width={80} height={80} />
                                <div className='ms-3 fw-semibold w-100'>
                                    <p>{product.title}</p>
                                    <p className='text-danger fw-bold'>{product.price}$</p>
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
                                <p className='fw-bold ms-2'>{user.name.firstname} {user.name.lastname}</p>
                            </div>
                            <div className='d-flex'>
                                <label >Điện thoại: </label>
                                <p className='fw-bold ms-2'>{user.phone}</p>
                            </div>

                            <div className='form-group'>
                                <label >Email</label>
                                <input className='w-50 ms-2 form-control' type="email" defaultValue={user.email} />
                            </div>
                        </div>
                    </div>


                    <div className='mt-3 mb-4'>
                        <h4 className='fw-semibold'>Thông tin nhận hàng</h4>
                        <div className='card p-3'>
                            <div className='form-group'>
                                <label >Tên người nhận</label>
                                <input className='w-50 ms-2 form-control' type="text" required />
                            </div>
                            <div className='form-group'>
                                <label >Điện thoại</label>
                                <input className='w-50 ms-2 form-control' type="text" required defaultValue={user.phone} />
                            </div>
                            <div className='form-group'>
                                <label >Tỉnh</label>
                                <input className='w-50 ms-2 form-control' type="text" required defaultValue={user.address.city} />
                            </div>
                            <div className='form-group'>
                                <label >Quận</label>
                                <input className='w-50 ms-2 form-control' type="text" defaultValue={user.address.street} />
                            </div>
                        </div>
                    </div>
                    <div className='card mb-4 p-3'>
                        <div className='d-flex'>
                            <div className='d-grid'>
                                <p className='fw-bold mb-1'>Tổng tiền tạm tính:</p>
                                <p className='fst-italic'>Chưa tính chiết khấu</p>
                            </div>
                            <p className='ms-auto text-danger fw-bolder fs-5'>${cartItems.reduce((a, b) => (a + b.price * b.quantity), 0)}</p>
                        </div>

                        <button className='btn btn-danger'>Tiếp tục</button>
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