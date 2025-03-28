import React, { useContext, useState } from 'react'
import { CartContext } from '../CartProvider'
import { Link } from 'react-router-dom';
import { ArrowBack, RemoveShoppingCart } from '@mui/icons-material';
import { AuthContext } from '../AuthProvider';

function Cart() {

    const { cartItems, removeFromCart, increaseItem, decreaseItem } = useContext(CartContext);
    const { user } = useContext(AuthContext)

    const [selectedProducts, setSelectedProducts] = useState([]);

    // Xử lý chọn/bỏ chọn từng sản phẩm
    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId) // Bỏ chọn
                : [...prevSelected, productId] // Chọn thêm
        );
    };

    // Xử lý chọn tất cả hoặc bỏ chọn tất cả
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(cartItems.map((item) => item.id)); // Chọn tất cả
        } else {
            setSelectedProducts([]); // Bỏ chọn tất cả
        }
    };

    // Tính tổng giá dựa trên sản phẩm đã chọn
    const totalPrice = cartItems
        .filter((item) => selectedProducts.includes(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);



    return (
        <div className='container mt-3 p-3'>
            {cartItems.length === 0 ? (
                <div className=" d-grid justify-content-center align-items-center mt-3 p-3 text-center">
                    <h4 className='fw-bold'> Giỏ hàng trống</h4>
                    <RemoveShoppingCart className='w-100 h-50 text-danger' />
                    <p className='text-muted'>Không có sản phẩm nào trong giỏ hàng.</p>
                    <Link to={'/'}><button className='btn btn-danger w-100'>Tiếp tục mua sắm</button></Link>
                </div>
            ) : (
                <div className='p-3'>
                    <Link to={'/'}><button className='btn btn-secondary btn-sm mb-3'> <ArrowBack /> Tiếp tục mua sắm</button></Link>
                    {/* Chi tiết giỏ hàng */}
                    <div>
                        <label className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                onChange={(e) => handleSelectAll(e)}
                                checked={selectedProducts.length === cartItems.length && cartItems.length > 0}
                            />
                            <span className="ms-2 fw-semibold">Chọn tất cả</span>
                        </label>
                    </div>

                    <div className='row'>
                        <div className='col-md-7'>
                            {cartItems.map((product) => (
                                <div className='card my-3 p-2'>
                                    <div key={product.id} className='mt-3 mb-4 d-flex'>
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2"
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleSelectProduct(product.id)}
                                        />
                                        <img src={product.image} alt={product.title} width={70} height={70} />
                                        <div className='ms-3'>
                                            <h6>{product.title}</h6>
                                            {product.discount ? (
                                                <div className='d-flex'>
                                                    <p className='text-decoration-line-through'>${Math.round(product.price * (1 + product.discount / 100))}</p>
                                                    <h5 className="text-success fw-bold ms-2">${product.price}</h5>
                                                </div>
                                            ) : (
                                                <h5 className="text-danger fw-bold">${product.price}</h5>
                                            )}
                                            <div className='mt-3'>
                                                <button className='btn btn-secondary btn-sm' onClick={() => decreaseItem(product)}>-</button>
                                                <span className='mx-2'>{product.quantity}</span>
                                                <button className='btn btn-secondary btn-sm' onClick={() => increaseItem(product)}>+</button>
                                                <button className='btn btn-small ms-2' onClick={() => removeFromCart(product.id)}>Xóa</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Thông tin đơn hàng */}
                        <div className='col-md-5 mt-3'>
                            <div className='card p-3 bg-light'>
                                <h4 className='fw-bold text-center'>Thông tin đơn hàng</h4>
                                <hr />
                                <div className='d-flex'>
                                    <label className='fw-semibold me-2'>Tổng: </label>
                                    {/* <p className='fw-bold'>${cartItems.reduce((a, b) => (a + b.price * b.quantity), 0)}</p> */}
                                    <h4 className="fw-bold">${totalPrice}</h4>
                                </div>
                                <div className='d-flex'>
                                    <p className='me-2'>Phí vận chuyển: </p>
                                    <p className='text-success fw-bold'>Free</p>
                                </div>
                                <p>Khuyến mãi</p>
                                <hr />
                                <div className='d-flex'>
                                    <h4 className='fw-bold me-4'>Tạm tính: </h4>
                                    {/* <h4 className='fw-bolder'>${cartItems.reduce((a, b) => (a + b.price * b.quantity), 0)}</h4> */}
                                    <h4 className="fw-bold">${totalPrice}</h4>
                                </div>
                                {user ? (
                                    <Link to={'/order'}><button className="btn btn-danger w-100 mt-3">Thanh toán</button></Link>
                                ) : (
                                    <Link to={'/login'}><button className="btn btn-danger w-100 mt-3">Thanh toán</button></Link>
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
