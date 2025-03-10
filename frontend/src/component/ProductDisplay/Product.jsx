import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./Product.css"
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import { CartContext } from '../CartProvider';
import { Rating } from '@mui/material';
import { AccountCircle, Star } from '@mui/icons-material'
import CartItem from '../CartItem/CartItem';
import { products } from '../Home/ListProduct';


function Product() {
    const { productId } = useParams()
    const [product, setProduct] = useState()
    const { addToCart } = useContext(CartContext)
    const [reviews, setReviews] = useState([])
    const [showReview, setshowReview] = useState(false)

    useEffect(() => {
        fetch(`https://fakestoreapi.in/api/products/${productId}`)
            .then(res => res.json())
            .then(data => setProduct(data.product))
            .catch(err => console.log("error: ", err))

        fetch('https://fakeapi.net/reviews')
            .then(res => res.json())
            .then(res => setReviews(res.data))
            .catch(err => console.log("error: ", err))

    }, [productId])


    if (!product) {
        return (
            <div className='position-absolute top-50 start-50 translate-middle'>

                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden ">Loading...</span>
                </div>

            </div>
        )

    }

    return (
        <div className='p-4'>
            {/* Breadcrumb */}
            <div className='container mt-5 p-3'>
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item fw-semibold" ><HomeIcon /><Link to={"/"} className='text-decoration-none text-black '>Trang chủ</Link></li>
                    <li className="breadcrumb-item fw-semibold"><Link to={`/${product.category}`} className='text-decoration-none text-black text-uppercase'>{product.category}</Link ></li>
                    <li className="breadcrumb-item active text-truncate " style={{ maxWidth: 250 }} >{product.title}</li>
                </ol>
            </div>

            <div className='container'>
                {/* Product Details */}
                <div className='row'>
                    <div className='col-md-6 mt-3 '>
                        <div className='card bored-0 d-flex align-items-center'>
                            <img src={product.image} alt={product.title} width={400} height={400} />
                        </div>
                    </div>

                    <div className='col-md-6 mt-3' >
                        <div className='card shadow p-4'>
                            <h4 className='fw-bold'>{product.title}</h4>
                            {product.discount ? (
                                <div className='d-flex'>
                                    <p className='text-decoration-line-through'>${Math.round(product.price * (1 + product.discount / 100))}</p>
                                    <h5 className="text-success fw-bold ms-2">${product.price}</h5>
                                    <p className='ms-2 text-white bg-danger px-1 rounded-pill'> {product.discount}% off</p>
                                </div>
                            ) : (
                                <h5 className="text-danger fw-bold">${product.price}</h5>
                            )}
                            <ul className="list-unstyled text-uppercase">
                                <li >Hãng:  {product.brand}</li>
                                <div className='d-flex'>
                                    <li >Màu: {product.color} </li>
                                    <svg style={{ background: product.color, margin: '5 10' }} width={15} height={15}></svg>
                                </div>

                                <li>Loại sản phẩm: {product.model}</li>
                            </ul>
                            <div className='d-flex justify-content-center'>
                                <button className="btn btn-warning w-40 fw-semibold">Mua Ngay</button>
                                <button
                                    className="btn btn-danger w-40 ms-3 fw-semibold"
                                    onClick={() => addToCart(product)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>

                        <div className='card mt-3 box-more-promotion'>
                            <p className='card-header fw-bolder bg-body-secondary'>ƯU ĐÃI THÊM</p>
                            <ul className="list-unstyled box-more-promotion-list p-2">
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/hsbc_icon.png" alt="" style={{ marginRight: 10 }} />
                                    Hoàn tiền đến 2 triệu khi mở thẻ tín dụng HSBC
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/logo-techcom-update.png" alt="" style={{ marginRight: 10 }} />
                                    Giảm đến 800.000đ khi thanh toán qua Techcombank
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/image_1009_1_.png" alt="" style={{ marginRight: 10 }} />
                                    Giảm đến 500.000đ khi thanh toán qua VNPAY
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/logo-acb-bank.png" alt="" style={{ marginRight: 10 }} />
                                    Giảm đến 500.000đ khi thanh toán bằng thẻ tín dụng ACB
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:…om.vn/media/wysiwyg/Icon/logo-home-credit-new.png" alt="" style={{ marginRight: 10 }} />
                                    Giảm đến 400.000đ khi thanh toán bằng thẻ tín dụng Home Credit
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:40:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/DUMT_ZV0.png" alt="" style={{ marginRight: 10 }} />
                                    Giảm đến 500.000đ khi thanh toán qua Kredivo
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/image_1010_1_.png" alt="" style={{ marginRight: 10 }} />
                                    Giảm đến 200.000đ khi thanh toán qua MOMO
                                </li>
                                <li>Liên hệ B2B để được tư vấn giá tốt nhất cho khách hàng doanh nghiệp khi mua số lượng nhiều</li>

                            </ul>
                        </div>

                    </div>
                </div>

                {/* Product Description */}
                <div className="card mt-4 p-3" >
                    <h4>Mô tả sản phẩm</h4>
                    <p>{product.description}</p>
                </div>

                {/* Other Products */}
                <div className="mt-4">
                    <h4>Các sản phẩm khác</h4>
                    <div className="row mt-3">
                        {products.slice(product.id, product.id + 4).map((item) => (
                            <div className="col-md-3 my-2" key={item.id} >
                                <CartItem item={item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/**Review and rating  */}
                <div className='mt-5'>
                    <div className='w-75 my-2 p-3'>
                        <p className='fw-bold fs-4'>Đánh giá & nhận xét</p>

                        <div className="row">
                            <div className="col-md-5 text-center p-3">
                                <p className=' fw-bold'>5/5</p>
                                <Rating />
                                <Link to={'/'}><p>Đánh giá</p></Link>
                            </div>
                            <div className="col-md-7 d-grid p-3">
                                <div className='d-flex'>
                                    <p className='fw-bold'>5</p>
                                    <Star className="text-warning " />
                                    <div className='ms-3 mt-1 progress w-50' >
                                        <div className='progress-bar bg-danger w-100'></div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <p className='fw-bold'>4</p>
                                    <Star className="text-warning " />
                                    <div className='ms-3 mt-1 progress w-50' >
                                        <div className='progress-bar bg-danger w-75'></div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <p className='fw-bold'>3</p>
                                    <Star className="text-warning " />
                                    <div className='ms-3 mt-1 progress w-50' >
                                        <div className='progress-bar bg-danger w-50'></div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <p className='fw-bold'>2</p>
                                    <Star className="text-warning " />
                                    <div className='ms-3 mt-1 progress w-50' >
                                        <div className='progress-bar bg-danger w-25'></div>
                                    </div>
                                </div>
                                <div className='d-flex'>
                                    <p className='fw-bold'>1</p>
                                    <Star className="text-warning " />
                                    <div className='ms-3 mt-1 progress w-50' >
                                        <div className='progress-bar bg-danger'></div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='my-2 text-center'>
                            <p>Bạn nghĩ sao về sản phẩm này</p>
                            <button className='btn btn-danger' onClick={() => setshowReview(!showReview)} >Đánh giá ngay</button>
                        </div>
                        {showReview && (
                            <>
                                <div
                                    onClick={() => setshowReview(false)}
                                    className='position-fixed bg-dark opacity-50 w-100 h-100 top-0 start-0 '
                                >
                                </div>
                                <div className='z-1 position-fixed top-50 start-50 translate-middle card p-3 review'>
                                    <p className='bg-light fw-bold fs-5'>Đánh giá và nhận xét</p>
                                    <div className='my-3'>
                                        <p className='fw-bold'>Đánh giá chung</p>
                                        <Rating size='large' />
                                    </div>
                                    <div className='my-3'>
                                        <textarea className="form-control" placeholder='Cảm nhận về sản phẩm' rows={3}></textarea>
                                    </div>
                                    <input className='form-control mb-3' type="file" accept="image/*" multiple />
                                    <button className='btn btn-danger'>Gửi đánh giá</button>
                                </div>
                            </>
                        )}
                        <div className='my-2'>
                            <p className='fw-bold fs-4'>Nhật xét</p>
                            {reviews.map(review => (

                                <div className='my-2'>

                                    <div className='ms-4 d-flex '>
                                        <AccountCircle />
                                        <p className='fw-bold mx-2 mb-0'>User {review.userId}</p>
                                        <p className='text-muted mt-1' style={{ fontSize: 12 }}>{review.date}</p>
                                    </div>

                                    <div className='mt-2 ms-4 d-flex'>
                                        <div className='mb-0'>
                                            <Rating defaultValue={review.rating} size='small' readOnly />
                                            <p>{review.content}</p>
                                        </div>
                                    </div>
                                </div>

                            ))}
                        </div>

                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Product