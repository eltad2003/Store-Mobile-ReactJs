import React, { useContext, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { AccountCircle, ShoppingCart } from '@mui/icons-material'
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
            <div className='bg p-2 position-sticky top-0 z-2 shadow'>
                <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand ms-3 fw-bold text-white" href="/"><ComputerIcon style={{ color: 'yellow' }} /> SHOP888</a>
                    <div className="navbar-collapse d-flex justify-content-between" id="navbarNav">

                        <ul className="navbar-nav ">
                            <li className="nav-item ">
                                <button className="nav-link  text-white" onClick={() => setShowCategory(true)}>Danh mục</button>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link  text-white" href="/order">Tra cứu đơn hàng</a>
                            </li>
                        </ul>
                        <>
                            <Offcanvas show={showCategory} onHide={() => setShowCategory(false)}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title >Danh mục</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <ul className="list-unstyled p-2">
                                        <li className="fw-bold mt-3"><Link className="text-decoration-none text-black" to="/tv">TV</Link></li>
                                        <li className="fw-bold mt-3"><Link className="text-decoration-none text-black" to="/audio">Audio</Link></li>
                                        <li className="fw-bold mt-3"><Link className="text-decoration-none text-black" to="/laptop">Laptop</Link></li>
                                        <li className="fw-bold mt-3"><Link className="text-decoration-none text-black" to="/mobile">Mobile</Link></li>
                                        <li className="fw-bold mt-3"><Link className="text-decoration-none text-black" to="/gaming">Gaming</Link></li>
                                        <li className="fw-bold mt-3"><Link className="text-decoration-none text-black" to="/appliances">Appliances</Link></li>
                                    </ul>
                                </Offcanvas.Body>
                            </Offcanvas>
                        </>


                        <div className="w-50">
                            <input
                                className="form-control rounded-pill"
                                type="search"
                                placeholder="Bạn tìm gì.."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true) }}
                            />
                        </div>

                        {/* Danh sách gợi ý (Dropdown) */}
                        {showSuggestions && (
                            <>
                                {/* Backdrop làm mờ */}
                                <div
                                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
                                    onClick={() => { setShowSuggestions(false); setSearch('') }}>
                                </div>

                                {/* Hộp sản phẩm gợi ý */}
                                <div className="position-absolute top-100 start-50 translate-middle-x card rounded shadow-lg p-3 w-50 bg-white z-1">
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
                                                    <p className="text-truncate" style={{ maxWidth: 600 }}>{item.title}</p>
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


                        <ul className="navbar-nav mx-3">
                            <li className="nav-item p-2">
                                <Link to={'/cart'} class="position-relative me-2" style={{ color: 'white' }}>
                                    <ShoppingCart />
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-danger" >
                                        {cartItems.length}
                                    </span>
                                </Link>
                            </li>
                            <li className="nav-item dropdown p-2 position-relative">
                                <Link
                                    style={{ color: 'white' }}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <AccountCircle />
                                </Link>

                                {isOpen && (
                                    <div className="dropdown-menu show end-0 mt-2">
                                        {user ? (
                                            <div >
                                                <p className='dropdown-item fw-bolder'>Hello, {user.name.firstname} {user.name.lastname}</p>
                                                <Link className="dropdown-item" onClick={() => { handleLogout(); setIsOpen(false) }}>
                                                    Đăng xuất
                                                </Link>
                                            </div>

                                        ) : (
                                            <Link className="dropdown-item" to="/login" onClick={() => setIsOpen(false)}>
                                                Đăng nhập
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </li>
                        </ul>

                    </div>
                </nav >
            </div >
            <Outlet />
        </>
    )
}

export default Navbar
