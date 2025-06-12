import { Category, Dashboard, LocalShipping, Logout, People, Report, ShoppingCart, Menu, ViewCarousel } from '@mui/icons-material'
import React, { useState } from 'react'
import { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

function AdminLayout() {
    const { user, logout } = useContext(AuthContext)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const handleLogout = async () => {
        await logout()
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        (user && user.user.role === 'ADMIN' ? (
            <div className="d-flex">
                {/* Sidebar Toggle Button */}
                <button className="btn btn-dark position-fixed top-0 start-0 m-3 z-3" onClick={toggleSidebar} ><Menu /></button>

                {/* Sidebar */}
                <div
                    className={`z-2 bg-dark text-white p-3 position-fixed h-100`}
                    style={{
                        left: isSidebarOpen ? 0 : '-250px',
                        transition: 'left 0.5s ease',

                    }}
                >
                    <div className='text-center my-5 rounded-5'>
                        <img
                            src={user.user.avatarUrl}
                            alt=""
                            className='img-fluid rounded-circle'
                            style={{ width: '100px', height: '100px' }}
                        />
                        <p className='fw-semibold mt-3'>{user.user.fullName}</p>
                    </div>
                    <h3 className='my-5'>Quản lý</h3>
                    <ul className="list-unstyled fw-semibold gap-4 d-flex flex-column px-2">
                        <li className=" align-items-center">
                            <Dashboard className="me-2" />
                            <Link className="text-decoration-none text-white" to="/admin"  >DashBoard</Link>
                        </li>
                        <li className=" align-items-center">
                            <People className="me-2" />
                            <Link className="text-decoration-none text-white" to="/admin/users"  >Quản lý người dùng</Link>
                        </li>
                        <li className=" align-items-center">
                            <ShoppingCart className="me-2" />
                            <Link className="text-decoration-none text-white" to="/admin/products"  >Quản lý Sản Phẩm</Link>
                        </li>
                        <li className=" align-items-center">
                            <Category className="me-2" />
                            <Link className="text-decoration-none text-white" to="/admin/categories"  >Quản lý Danh mục</Link>
                        </li>
                        <li className=" align-items-center">
                            <LocalShipping className="me-2" />
                            <Link className="text-decoration-none text-white" to="/admin/orders"  >Quản lý Đơn Hàng</Link>
                        </li>
                        <li className=" align-items-center">
                            <ViewCarousel className="me-2" />
                            <Link className="text-decoration-none text-white" to='/admin/banner'  >Quản lý Banner</Link>
                        </li>
                        <li className=" align-items-center">
                            <Report className="me-2" />
                            <Link className="text-decoration-none text-white" to="/admin/reports"  >Báo cáo</Link>
                        </li>
                    </ul>
                    <div className='mt-4'>
                        <button
                            className='btn btn-danger w-100  align-items-center justify-content-center'
                            onClick={handleLogout}
                        >
                            Đăng xuất <Logout className="ms-2" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow-1"
                    style={{
                        marginLeft: isSidebarOpen ? 250 : 0,
                        transition: 'margin-left 0.5s ease'
                    }}
                >
                    <Outlet />
                </div>
            </div>
        ) : (
            <div className='position-absolute start-50 top-50 translate-middle'>
                <h3>Bạn cần đăng nhập tài khoản Admin</h3>
                <div className='text-center mt-3'>
                    <Link to={"/login"}><button className='btn btn-danger'>Đăng nhập</button></Link>
                </div>
            </div>
        ))
    )
}

export default AdminLayout