import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./Product.css"
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import { CartContext } from '../CartProvider';
import { Rating } from '@mui/material';
import { AccountCircle, AddShoppingCart, ArrowLeft, ArrowRight, ExpandMore, Star } from '@mui/icons-material'
import CartItem from '../CartItem/CartItem';
import Review from './Review';
import Chatbot from '../Chatbot/Chatbot';
import { Carousel } from 'react-bootstrap';
import formatPrice from '../../formatPrice';
import { services } from '../Home/Service';



function Product() {
    const { productId } = useParams()
    const [product, setProduct] = useState()
    const [products, setProducts] = useState([])
    const { addToCart } = useContext(CartContext)
    const [showFullDesc, setShowFullDesc] = useState(false);

    function processDescriptionImages(html) {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;

        // Xử lý ảnh như cũ
        const imgs = div.querySelectorAll('img');
        imgs.forEach(img => {
            img.style.maxWidth = '900px';
            img.style.maxHeight = '1200px';
            img.style.height = 'auto';
            img.style.width = 'auto';
            img.style.display = 'block';
            img.style.margin = '10px 0';
            img.style.display = 'block';
            img.style.margin = '20px auto';
            img.style.objectFit = 'contain';
        });

        // Xử lý oembed YouTube
        const oembeds = div.querySelectorAll('oembed[url]');
        oembeds.forEach(oembed => {
            const url = oembed.getAttribute('url');
            if (!url) return;
            if (url.includes('youtube.com/watch')) {
                // Xử lý YouTube
                const videoId = url.split('v=')[1]?.split('&')[0];
                if (videoId) {
                    const iframe = document.createElement('iframe');
                    iframe.width = "900";
                    iframe.height = "600";
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.title = "YouTube video player";
                    iframe.frameBorder = "0";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                    iframe.allowFullscreen = true;
                    iframe.style.display = 'block';
                    iframe.style.margin = '20px auto';
                    oembed.parentNode.replaceChild(iframe, oembed);
                }
            } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
                // Xử lý video file trực tiếp
                const video = document.createElement('video');
                video.controls = true;
                video.style.maxWidth = "100%";
                video.style.maxHeight = "400px";
                const source = document.createElement('source');
                source.src = url;
                video.appendChild(source);
                video.innerHTML += "Trình duyệt của bạn không hỗ trợ video.";
                oembed.parentNode.replaceChild(video, oembed);
            }
        });

        return div.innerHTML;
    }
    const fetchData = async () => {
        try {
            const [productsRes, productRes] = await Promise.all([
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

    useEffect(() => {
        window.scrollTo(0, 0);
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
    function MediaCarousel({ mediaList, name }) {
        const [index, setIndex] = useState(0);
        const isVideo = (url) => url.match(/\.(mp4|webm|ogg)$/i);

        return (
            <div>
                <Carousel
                    activeIndex={index}
                    onSelect={(selectedIndex) => setIndex(selectedIndex)}
                    prevIcon={<ArrowLeft style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}
                    nextIcon={<ArrowRight style={{ color: 'white', fontSize: '40px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%', padding: '10px' }} />}
                    interval={null}
                    className="w-100"
                    style={{ maxWidth: 450, margin: "0 auto" }}
                >
                    {mediaList.map((url, idx) => (
                        <Carousel.Item key={idx}>
                            <div style={{ width: "100%", height: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", borderRadius: 8 }}>
                                {isVideo(url) ? (
                                    <video controls style={{ maxWidth: "100%", maxHeight: 380 }}>
                                        <source src={url} />
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                ) : (
                                    <img
                                        src={url}
                                        alt={name}
                                        style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }}
                                    />
                                )}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
                {/* Thumbnails */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {mediaList.map((url, idx) => (
                        <div
                            key={idx}
                            onClick={() => setIndex(idx)}
                            style={{
                                border: idx === index ? '1px solid rgb(245, 16, 16)' : '1px solid #ccc',
                                borderRadius: 6,
                                padding: 2,
                                cursor: 'pointer',
                                background: '#fff'
                            }}
                        >
                            {isVideo(url) ? (
                                <video
                                    src={url}
                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                    muted
                                    preload="metadata"
                                />
                            ) : (
                                <img
                                    src={url}
                                    alt={`thumb-${idx}`}
                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (

        <div className='container mt-3'>

            {/* Breadcrumb */}
            <div className='p-3'>
                <ol className="breadcrumb fs-5">
                    <li className="breadcrumb-item fw-bold"><HomeIcon /><Link to={"/"} className='text-decoration-none text-black'>Trang chủ</Link></li>
                    <li className="breadcrumb-item fw-bold"><Link to={`/${product.category}`} className='text-decoration-none text-black text-uppercase'>{product.category}</Link></li>
                    <li className="breadcrumb-item active " >{product.name}</li>
                </ol>
            </div>


            {/* Product Details */}
            <div className='row min-vh-100 border-0 p-3 '>
                <div className='col-12 col-lg-6 mt-3 d-flex align-items-start'>
                    <div className='card border-0 d-flex align-items-center position-sticky top-0 p-3 w-100'>
                        <MediaCarousel mediaList={product.listMedia} name={product.name} />
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

                        {product.stockQuantity > 0 ? (
                            <button className="btn btn-danger w-100" onClick={() => addToCart(product)}><AddShoppingCart /> Thêm vào giỏ hàng </button>
                        ) : (
                            <button className="btn btn-danger w-100" disabled><AddShoppingCart /> Hết hàng </button>
                        )}

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
                <hr className='shadow-lg' />
            </div>

            {/* Product Description */}
            <div className="shadow rounded-3 my-5 bg-light">
                <h4 className='p-3 fw-bold'>Mô tả sản phẩm</h4>
                <div
                    dangerouslySetInnerHTML={{ __html: processDescriptionImages(product.description) }}
                    className='p-5'
                    style={{
                        maxHeight: showFullDesc ? 2000 : 400,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'max-height 1s ease',
                    }}
                />

                <div className='d-flex justify-content-center z-2 mt-3' >
                    <button className="btn shadow fw-bold " onClick={() => setShowFullDesc(!showFullDesc)} >
                        {showFullDesc ? 'Ẩn bớt' : 'Xem thêm'} <ExpandMore />
                    </button>
                </div>

            </div>


            {/* Other Products */}
            <div className="my-5 ">
                <h4 className='p-2 fw-bold'>CÁC SẢN PHẨM LIÊN QUAN</h4>
                <div className="row mt-3">
                    {products.filter(item => item.category === product.category).slice(1, 5).map((item) => (
                        <div className="col-6 col-md-3 my-2" key={item.id}>
                            <CartItem item={item} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Review and Rating */}
            <Review productId={product.id} />
            {/* Chatbot */}
            <Chatbot />

        </div>
    )
}

export default Product