import React, { useContext, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { AccountCircle, Person, ShoppingCart } from '@mui/icons-material'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import "./Navbar.css"
import { AuthContext } from '../AuthProvider'
import ComputerIcon from '@mui/icons-material/Computer';
import { CartContext } from '../CartProvider'
import { Offcanvas } from 'react-bootstrap'
import { products } from '../Home/ListProduct'
function Navbar() {

    const [isOpen, setIsOpen] = useState(false)
    const [showCategory, setShowCategory] = useState(false)
    const { user, logout } = useContext(AuthContext)
    const { cartItems } = useContext(CartContext)
    const navigate = useNavigate()
    const [search, setSearch] = useState("")

    const [showSuggestions, setShowSuggestions] = useState(false);

    const listSearch = products.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    )

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    return (
        <>
            <div className='bg-dark position-sticky top-0 z-2 p-2'>
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand ms-3 text-white fw-bold" href="/"><ComputerIcon style={{ color: 'yellow' }} /> SHOP888</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-lg-3 d-flex flex-row align-items-center">
                                <li className="nav-item me-3">
                                    <button className="nav-link text-white">Danh mục</button>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="/order">Tra cứu đơn hàng</a>
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

                            {showSuggestions && (
                                <>
                                    <div
                                        className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
                                        onClick={() => { setShowSuggestions(false); setSearch('') }}>
                                    </div>
                                    <div className="position-absolute top-100 start-50 translate-middle-x card rounded shadow-lg p-3 w-75 bg-white z-1">
                                        <p className="fw-bold">Sản phẩm gợi ý</p>
                                        {listSearch.length > 0 ? (
                                            listSearch.slice(0, 5).map((item) => (
                                                <Link
                                                    to={`/products/${item.id}`}
                                                    key={item.id}
                                                    className="text-decoration-none text-black d-flex align-items-center mt-2 p-2"
                                                    onClick={() => { setShowSuggestions(false); setSearch(''); }}
                                                >
                                                    <img src={item.image} alt={item.title} className="img-fluid" width={60} height={60} />
                                                    <div className="ms-3">
                                                        <p className="text-truncate" style={{ maxWidth: 1000 }}>{item.title}</p>
                                                        {item.discount ? (
                                                            <div className="d-flex">
                                                                <p className="text-decoration-line-through text-muted">${Math.round(item.price * (1 + item.discount / 100))}</p>
                                                                <h5 className="text-success fw-bold ms-2">${item.price}</h5>
                                                            </div>
                                                        ) : (
                                                            <h5 className="text-danger fw-bold">${item.price}</h5>
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
                                        <div className="dropdown-menu show end-0 mt-2">
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
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <Outlet />
        </>
    )
}

export default Navbar
