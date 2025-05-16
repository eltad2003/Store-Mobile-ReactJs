import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./Product.css"
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import { CartContext } from '../CartProvider';
import { Rating } from '@mui/material';
import { AccountCircle, Star } from '@mui/icons-material'
import CartItem from '../CartItem/CartItem';
import Review from './Review';
import Chatbot from '../Chatbot/Chatbot';



function Product() {
    const { productId } = useParams()
    const [product, setProduct] = useState()
    const [products, setProducts] = useState([])
    const { addToCart } = useContext(CartContext)

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, productRes, reviewsRes] = await Promise.all([
                    fetch('http://localhost:8080/products'),
                    fetch(`http://localhost:8080/products/${productId}`),

                ]);

                const productData = await productRes.json();
                const productsData = await productsRes.json();

                setProducts(productsData);
                setProduct(productData);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [productId]);


    if (!product) {
        return (
            <div className='position-absolute top-50 start-50 translate-middle'>
                <div className="spinner-border text-danger" role="status">
                </div>
            </div>
        )
    }

    return (
        <div className='mt-3'>
            {/* Breadcrumb */}
            <div className='container p-3'>
                <ol className="breadcrumb fs-5">
                    <li className="breadcrumb-item fw-semibold"><HomeIcon /><Link to={"/"} className='text-decoration-none text-black'>Trang chủ</Link></li>
                    <li className="breadcrumb-item fw-semibold"><Link to={`/${product.category}`} className='text-decoration-none text-black text-uppercase'>{product.category}</Link></li>
                    <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 500 }}>{product.name}</li>
                </ol>
            </div>

            <div className='container'>
                {/* Product Details */}
                <div className='row min-vh-100'>
                    <div className='col-12 col-lg-6 mt-3 d-flex align-items-start'>
                        <div className='card border-0 d-flex align-items-center position-sticky top-0'>
                            <img src={product.listMedia[0]} alt={product.name} className="img-fluid" style={{ maxHeight: '80vh' }} />
                        </div>
                    </div>

                    <div className='col-12 col-lg-6 mt-3 overflow-auto' style={{ maxHeight: '100vh' }}>
                        <div className='card shadow p-4'>
                            <h4 className='fw-bold mb-3'>{product.name}</h4>
                            {product.discount ? (
                                <div className='d-flex flex-wrap'>
                                    <h4 className='text-decoration-line-through '>${Math.round(product.price * (1 + product.discount / 100))}</h4>
                                    <h3 className="text-success fw-bold ms-2">{formatPrice(product.price)}</h3>
                                    <p className='ms-2 text-white bg-danger px-1 rounded-pill'>{product.discount}% off</p>
                                </div>
                            ) : (
                                <h5 className="text-danger fw-bold">{formatPrice(product.price)}</h5>
                            )}
                            <ul className="list-unstyled text-uppercase">
                                <li className='text-danger'>Còn lại: {product.stockQuantity} sản phẩm</li>
                                <li>Hãng: {product.brand}</li>
                            </ul>
                            <div className='d-flex flex-wrap justify-content-center'>
                                <button className="btn btn-warning w-100 my-2">Mua Ngay</button>
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={() => addToCart(product)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>

                        <div className='card box-more-promotion mt-5'>
                            <p className='card-header fw-bolder bg-body-secondary'>ƯU ĐÃI THÊM</p>
                            <ul className="list-unstyled box-more-promotion-list p-2">
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/hsbc_icon.png" alt="" className="me-2" />
                                    Hoàn tiền đến 2 triệu khi mở thẻ tín dụng HSBC
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/logo-techcom-update.png" alt="" className="me-2" />
                                    Giảm đến 800.000đ khi thanh toán qua Techcombank
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/image_1009_1_.png" alt="" className="me-2" />
                                    Giảm đến 500.000đ khi thanh toán qua VNPAY
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/logo-acb-bank.png" alt="" className="me-2" />
                                    Giảm đến 500.000đ khi thanh toán bằng thẻ tín dụng ACB
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/logo-home-credit-new.png" alt="" className="me-2" />
                                    Giảm đến 400.000đ khi thanh toán bằng thẻ tín dụng Home Credit
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:40:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/DUMT_ZV0.png" alt="" className="me-2" />
                                    Giảm đến 500.000đ khi thanh toán qua Kredivo
                                </li>
                                <li>
                                    <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Icon/image_1010_1_.png" alt="" className="me-2" />
                                    Giảm đến 200.000đ khi thanh toán qua MOMO
                                </li>
                                <li>Liên hệ B2B để được tư vấn giá tốt nhất cho khách hàng doanh nghiệp khi mua số lượng nhiều</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                {/* <div className="card mt-5 p-3 shadow">
                    <h4 className='p-2'>MÔ TẢ SẢN PHẨM</h4>
                    {product.description.split(/[|\r\n]/).map((line, index) => (
                        <p className='ms-2' key={index}>{line.trim()}</p>
                    ))}
                </div> */}

                <div className="card">
                    <h4 className='p-2'>Mô tả sản phẩm</h4>
                    <div
                        dangerouslySetInnerHTML={{ __html: product.description }}
                        className='p-2'
                    >
                    </div>
                </div>

                {/* Other Products */}
                <div className="mt-5">
                    <h4 className='p-2'>CÁC SẢN PHẨM LIÊN QUAN</h4>
                    <div className="row mt-3">
                        {products.filter(item => item.category === product.category).slice(product.id, product.id + 4).map((item) => (
                            <div className="col-6 col-md-3 my-2" key={item.id}>
                                <CartItem item={item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review and Rating */}
                <Review productId={product.id} />

                <Chatbot />
            </div>
        </div>
    )
}

export default Product