import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { HelpOutline, Notifications, Person, ShoppingCart } from '@mui/icons-material'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import "./Navbar.css"
import { AuthContext } from '../AuthProvider'
import { CartContext } from '../CartProvider'
import formatPrice from '../../formatPrice'
import { urlBE, urlSocket } from '../../baseUrl'
import logo from '../asset/logo.png'
import Sidebar from '../Sidebar/Sidebar'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenMobile, setIsOpenMobile] = useState(false)
    const { user, logout } = useContext(AuthContext)
    const { cartItems } = useContext(CartContext)
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [showToast, setShowToast] = useState(false)
    const [products, setProducts] = useState([])
    const [showMobileSearch, setShowMobileSearch] = useState(false)

    const fetchProducts = async (type = search) => {
        try {
            const res = await fetch(`${urlBE}/products?search=${type}`, {
                method: 'GET',
                headers: { 'content-type': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json()
                setProducts(data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }
    const userId = user?.user.id

    useEffect(() => {
        const socket = new WebSocket(`${urlSocket}?userId=${userId}`);
        socket.onopen = () => {
            console.log('✅ WebSocket connected');
        };
        socket.onmessage = (event) => {
            console.log('📩 Message received:', event.data);
            setToastMessage(event.data)
            setShowToast(true)
            fetchProducts()
        }

        socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('❌ WebSocket disconnected');
        };

        // Dọn dẹp WebSocket khi component bị unmount
        return () => {
            socket.close();
        };
    }, [userId])

    useEffect(() => {
        fetchProducts(search)
    }, [search])

    const UserDropdown = ({ user, onClose, onLogout, isMobile }) => (
        <div
            className={`dropdown-menu show position-fixed shadow border-0 end-0 me-1 ${isMobile ? 'bottom-0 translate-middle-x mb-5 ' : ''}`}
            style={{
                zIndex: 1050,
                minWidth: '250px',
                borderRadius: '15px'
            }}
        >
            {user ? (
                <>
                    <div className="dropdown-header bg-navbar text-white rounded-top" style={{ borderRadius: '15px 15px 0 0' }}>
                        <div className="d-flex align-items-center py-2">
                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-person-fill text-primary fs-5"></i>
                            </div>
                            <div>
                                <h6 className="mb-0 text-white">{user.user.fullName}</h6>
                                <small className="text-white-50">{user.user.email}</small>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown-divider m-0"></div>
                    <Link to="/profile" className="dropdown-item py-3" onClick={onClose}>
                        <i className="bi bi-person me-3 text-primary"></i>
                        Hồ sơ cá nhân
                    </Link>
                    <Link to="/viewOrder" className="dropdown-item py-3" onClick={onClose}>
                        <i className="bi bi-box-seam me-3 text-primary"></i>
                        Đơn hàng của tôi
                    </Link>
                    <Link to="/contact" className="dropdown-item py-3" onClick={onClose}>
                        <i className="bi bi-headset me-3 text-primary"></i>
                        Hỗ trợ
                    </Link>
                    {user.user.role === 'ADMIN' && (
                        <Link to="/admin" className="dropdown-item py-3" onClick={onClose}>
                            <i className="bi bi-gear me-3 text-primary"></i>
                            Quản lý hệ thống
                        </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button
                        className="dropdown-item py-3 text-danger"
                        onClick={() => { onLogout(); onClose(); }}
                    >
                        <i className="bi bi-box-arrow-right me-3"></i>
                        Đăng xuất
                    </button>
                </>
            ) : (
                <div className="p-4 text-center">
                    <i className="bi bi-person-circle display-4 text-muted mb-3"></i>
                    <h6 className="mb-3">Chưa đăng nhập</h6>
                    <Link
                        className="btn btn-primary w-100 rounded-pill"
                        to="/login"
                        onClick={onClose}
                    >
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Đăng nhập
                    </Link>
                </div>
            )}
        </div>
    );

    const canvas = () => {
        return (

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasLeft" aria-labelledby="offcanvasRightLabel" style={{ width: '250px' }}>
                <div className="offcanvas-header bg">
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body ">
                    <Sidebar />
                </div>
            </div>
        )
    }
    return (
        <>
            {/* Thông báo toast */}

            <div className={`toast shadow bg-dark position-fixed z-3 top-0 end-0 mt-5  ${showToast ? "show" : ""}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <Notifications className="text-danger" />
                    <strong className="me-auto">Thông báo</strong>
                    <small>Vừa xong</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body text-white" >
                    {toastMessage}
                </div>
            </div>

            {/* Desktop Navbar */}
            <div className='bg-navbar shadow-sm position-sticky top-0 z-3 py-2' >
                <nav className="navbar navbar-expand-md ">
                    <div className="container-fluid px-3">
                        {/* Brand */}
                        <Link className="navbar-brand d-flex align-items-center text-white fw-bold" to="/">
                            <img src={logo} alt="Logo" width={40} height={40} className="img-fluid me-2 rounded" />
                            <span className="d-none d-sm-inline">INFINITYSHOP</span>
                        </Link>
                        {/* Mobile Search Toggle */}
                        <button
                            className="btn btn-outline-light btn-sm d-lg-none me-2"
                            type="button"
                            onClick={() => setShowMobileSearch(!showMobileSearch)}
                        >
                            <i className="bi bi-search"></i>
                        </button>


                        <div className="collapse navbar-collapse" id="navbarNav">
                            {/* Left Navigation */}
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link className="nav-link text-white d-flex align-items-center" to="/contact">
                                        <i className="bi bi-headset me-2"></i>
                                        <span className="d-none d-xl-inline">Liên hệ</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link text-white d-flex align-items-center"
                                        data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft"
                                    >
                                        <i className="bi bi-layout-three-columns me-2"></i>
                                        <span className="d-none d-xl-inline">Danh mục</span>
                                    </Link>
                                </li>



                            </ul>

                            {/* Desktop Search */}
                            <div className="d-none d-lg-flex flex-grow-1 justify-content-center mx-4">
                                <div className="position-relative w-100" style={{ maxWidth: '700px' }}>
                                    <input
                                        className="form-control form-control-lg border-0 shadow-sm"
                                        type="search"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        style={{
                                            borderRadius: '25px',
                                            paddingLeft: '20px',
                                            paddingRight: '50px'
                                        }}
                                    />
                                    <button className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0">
                                        <i className="bi bi-search text-muted"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Right Navigation - Desktop */}
                            <ul className="navbar-nav d-none d-lg-flex">
                                <li className="nav-item me-3">
                                    <Link to="/cart" className="nav-link text-white position-relative d-flex align-items-center">
                                        <ShoppingCart />
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-danger">
                                            {cartItems.length}
                                        </span>
                                    </Link>
                                </li>
                                <li className="nav-item dropdown">
                                    <button
                                        className="btn nav-link text-white border-0 d-flex align-items-center"
                                        onClick={() => setIsOpen(!isOpen)}
                                    >
                                        <i className="bi bi-person-circle fs-5"></i>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Mobile Search Bar */}
                {showMobileSearch && (
                    <div className="d-lg-none bg-light p-3 border-top">
                        <div className="position-relative">
                            <input
                                className="form-control border-0 shadow-sm"
                                type="search"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                style={{
                                    borderRadius: '25px',
                                    paddingLeft: '20px',
                                    paddingRight: '50px'
                                }}
                            />
                            <button className="btn position-absolute top-50 end-0 translate-middle-y me-2 border-0">
                                <i className="bi bi-search text-muted"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Bottom Navbar */}
            <div className="d-lg-none d-md-block fixed-bottom bg-white border-top shadow-lg z-3" >
                <div className="container-fluid">
                    <div className="row g-0">
                        {/* Home */}
                        <div className="col text-center">
                            <Link to="/" className="nav-link text-decoration-none py-3 d-block">
                                <i className="bi bi-house fs-5 text-primary"></i>
                                <small className="d-block text-muted mt-1">Trang chủ</small>
                            </Link>
                        </div>

                        {/* Categories */}
                        <div className="col text-center">
                            <Link
                                className="nav-link text-decoration-none py-3 d-block"
                                data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft"
                                style={{ outline: 'none' }}
                            >
                                <i className="bi bi-grid fs-5 text-muted"></i>
                                <small className="d-block text-muted mt-1">Danh mục</small>
                            </Link>
                        </div>

                        {/* Cart */}
                        <div className="col text-center">
                            <Link to="/cart" className="nav-link text-decoration-none py-3 d-block position-relative">
                                <i className="bi bi-cart3 fs-5 text-muted"></i>
                                {cartItems.length > 0 && (
                                    <span className="position-absolute top-1 start-50 translate-middle-x badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                                        {cartItems.length}
                                    </span>
                                )}
                                <small className="d-block text-muted mt-1">Giỏ hàng</small>
                            </Link>
                        </div>

                        {/* Orders */}
                        <div className="col text-center">
                            <Link to="/viewOrder" className="nav-link text-decoration-none py-3 d-block">
                                <i className="bi bi-box-seam fs-5 text-muted"></i>
                                <small className="d-block text-muted mt-1">Đơn hàng</small>
                            </Link>
                        </div>

                        {/* Profile */}
                        <div className="col text-center">
                            <button
                                className="nav-link text-decoration-none py-3 d-block w-100 border-0 bg-transparent"
                                onClick={() => setIsOpenMobile(!isOpenMobile)}
                            >
                                <i className="bi bi-person-circle fs-5 text-muted"></i>
                                <small className="d-block text-muted mt-1">Tài khoản</small>
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* Search Suggestions */}
            {showSuggestions && search.length > 0 && (
                <>
                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                        style={{ zIndex: 1000 }}
                        onClick={() => { setShowSuggestions(false); setSearch(''); }}
                    >
                    </div>
                    <div
                        className="position-fixed card border-0 shadow-lg bg-white"
                        style={{
                            top: showMobileSearch ? '140px' : '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            maxWidth: '500px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            zIndex: 1010,
                            borderRadius: '15px'
                        }}
                    >
                        <div className="card-header bg-light border-0 py-3" style={{ borderRadius: '15px 15px 0 0' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0 fw-bold text-dark">
                                    <i className="bi bi-search me-2 text-primary"></i>
                                    Kết quả tìm kiếm
                                </h6>
                                <button
                                    className="btn btn-sm btn-outline-secondary rounded-circle"
                                    onClick={() => { setShowSuggestions(false); setSearch(''); }}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {products.length > 0 ? (
                                products.slice(0, 5).map((item, index) => (
                                    <Link
                                        to={`/products/${item.id}`}
                                        key={item.id}
                                        className="text-decoration-none text-dark d-flex align-items-center p-3 border-bottom"
                                        onClick={() => { setShowSuggestions(false); setSearch(''); }}
                                        style={{ transition: 'background-color 0.2s ease' }}
                                    >
                                        <div className="flex-shrink-0 me-3">
                                            <img
                                                src={item.listMedia[0]}
                                                alt={item.name}
                                                className="rounded"
                                                width={50}
                                                height={50}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fw-medium" style={{ fontSize: '14px' }}>
                                                {item.name.length > 60 ? `${item.name.substring(0, 60)}...` : item.name}
                                            </h6>
                                            {item.discount ? (
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-danger fw-bold small">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                    <span className="text-muted text-decoration-line-through small">
                                                        {formatPrice(Math.round(item.price * (1 + item.discount / 100)))}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-primary fw-bold small">
                                                    {formatPrice(item.price)}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <i className="bi bi-search display-4 text-muted mb-3"></i>
                                    <p className="text-muted mb-0">Không tìm thấy sản phẩm nào</p>
                                    <small className="text-muted">Hãy thử với từ khóa khác</small>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
            {isOpen && (
                <UserDropdown
                    user={user}
                    onClose={() => setIsOpen(false)}
                    onLogout={handleLogout}
                    isMobile={false}
                />
            )}
            {isOpenMobile && (
                <UserDropdown
                    user={user}
                    onClose={() => setIsOpenMobile(false)}
                    onLogout={handleLogout}
                    isMobile={true}
                />
            )}


            {canvas()}
            <Outlet />
        </>
    )
}

export default Navbar
