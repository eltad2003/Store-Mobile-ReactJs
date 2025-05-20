import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { AccountCircle, Notifications, Person, ShoppingCart } from '@mui/icons-material'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import "./Navbar.css"
import { AuthContext } from '../AuthProvider'
import ComputerIcon from '@mui/icons-material/Computer';
import { CartContext } from '../CartProvider'
import formatPrice from '../../formatPrice'
import { urlBE, urlSocket } from '../../baseUrl'
import logo from '../asset/logo.png'
function Navbar() {

    const [isOpen, setIsOpen] = useState(false)
    const [showCategory, setShowCategory] = useState(false)
    const { user, logout } = useContext(AuthContext)
    const { cartItems } = useContext(CartContext)
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [showToast, setShowToast] = useState(false)
    const [products, setProducts] = useState([])



    const fetchProducts = async (type = search) => {
        try {
            const res = await fetch(`${urlBE}/products?search=${type}`);
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
        fetchProducts()
    }
        , [search])
    return (
        <>
            {/* Thông báo toast */}
            <div>
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
            </div>
            {/* Navbar */}
            <div className='bg-navbar position-sticky top-0 z-2 p-2'>
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container-fluid">
                        <a className="mt-2 navbar-brand ms-3 text-white fw-bold" href="/"><img src={logo} alt='Logo' width={50} height={50} className='img-fluid' />INFINITYSHOP</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-lg-3  me-5 d-flex flex-row align-items-center">
                                <li className="nav-item me-3">
                                    <button className="nav-link text-white">Danh mục</button>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="/viewOrder">Tra cứu đơn hàng</a>
                                </li>
                            </ul>

                            <div className="d-flex flex-grow-1 mx-5">
                                <div className="input-group">
                                    <input
                                        className="form-control rounded-pill"
                                        type="search"
                                        placeholder="Bạn tìm gì.."
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true) }}
                                    />
                                </div>
                            </div>

                            <ul className="navbar-nav ms-lg-3 d-flex flex-row align-items-center">
                                {user && user.user.role === 'ADMIN' && (
                                    <li className='nav-item me-3'>
                                        <Link to={'/admin'} className='text-white text-decoration-none'>Quản lý</Link>
                                    </li>
                                )}
                                <li className="nav-item me-3">
                                    <Link to={'/cart'} className="position-relative" style={{ color: 'white' }}>
                                        <ShoppingCart />
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-danger">
                                            {cartItems.length}
                                        </span>
                                    </Link>
                                </li>
                                <li className="nav-item dropdown ms-2">
                                    <Link
                                        style={{ color: 'white' }}
                                        onClick={() => setIsOpen(!isOpen)}

                                    >
                                        <AccountCircle />
                                    </Link>
                                    {isOpen && (
                                        <>

                                            <div className="dropdown-menu show end-0  mt-2">
                                                {user ? (
                                                    <div>
                                                        <p className='dropdown-item fw-bolder'>Hello, {user.user.fullName}</p>
                                                        <Link to={'/profile'} className='dropdown-item'><p>Hồ sơ</p></Link>
                                                        <Link className="dropdown-item" onClick={() => { handleLogout(); setIsOpen(false) }}>
                                                            Đăng xuất
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <Link className="dropdown-item" to="/login" onClick={() => setIsOpen(false)} >
                                                        Đăng nhập
                                                    </Link>
                                                )}
                                            </div>
                                        </>
                                    )}

                                </li>

                            </ul>


                        </div>
                    </div>
                </nav>
                {showSuggestions && (
                    <>
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
                            onClick={() => { setShowSuggestions(false); setSearch('') }}>
                        </div>
                        <div className="position-absolute top-100 start-50 translate-middle-x card rounded shadow p-3 bg-white z-3 w-50">
                            <p className="fw-bold">Sản phẩm gợi ý</p>
                            {products.length > 0 ? (
                                products.slice(0, 5).map((item) => (
                                    <Link
                                        to={`/products/${item.id}`}
                                        key={item.id}
                                        className="text-decoration-none text-black d-flex align-items-center mt-2 p-2"
                                        onClick={() => { setShowSuggestions(false); setSearch(''); }}
                                    >
                                        <img src={item.listMedia[0]} alt={item.name} className="img-fluid" width={60} height={60} />
                                        <div className="ms-3">
                                            <p >{item.name}</p>
                                            {item.discount ? (
                                                <div className="d-flex">
                                                    <p className="text-decoration-line-through text-muted">${formatPrice(Math.round(item.price * (1 + item.discount / 100)))}</p>
                                                    <h5 className="text-success fw-bold ms-2">${formatPrice(item.price)}</h5>
                                                </div>
                                            ) : (
                                                <h5 className="text-danger fw-bold">${formatPrice(item.price)}</h5>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center text-danger">Không tìm thấy sản phẩm nào.</div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Outlet />
        </>
    )
}

export default Navbar
