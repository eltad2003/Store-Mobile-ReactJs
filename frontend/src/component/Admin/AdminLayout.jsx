import { Dashboard, LocalShipping, Logout, People, Report, ShoppingCart } from '@mui/icons-material'
import React from 'react'
import { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'

function AdminLayout() {

    const { user, logout } = useContext(AuthContext)

    const handleLogout = async () => {
        await logout()
    }

    return (
        (user && user.user.role === 'ADMIN' ? (
            <div >
                {/* <nav className="navbar z-1 navbar-expand-lg bg-dark text-white p-3 fixed-top">
            <div className='navbar-collapse'>
                <div>
                    <a className="navbar-brand ms-3 fw-bold text-white" href="/admin"> ADMIN PANEL</a>
                </div>
                <div className='ms-auto'>
                    <AccountCircleOutlined />
                </div>
            </div>
        </nav> */}
                <div className="z-1 bg-dark text-white p-3 top-0 h-100 position-fixed">
                    <div className='text-center my-3 rounded-5'>
                        <img src="https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-avatar-icon-png-image_313572.jpg" alt="" className='img-fluid rounded-circle' width={100} height={100} />
                        <p className='fw-semibold mt-3'>{user.user.fullName} </p>
                    </div>
                    <h3 className='mt-5'>Quản lý</h3>
                    <ul className="list-unstyled fw-semibold p-2 mt-2">
                        <li className=" my-4">
                            <Dashboard />
                            <Link className="text-decoration-none text-white ms-2" to="/admin" >DashBoard</Link>
                        </li>
                        <li className=" my-4">
                            <People />
                            <Link className="text-decoration-none text-white ms-2" to="/admin/users" >Quản lý người dùng</Link>
                        </li>
                        <li className=" my-4">
                            <ShoppingCart />
                            <Link className="text-decoration-none text-white ms-2" to="/admin/products" >Quản lý Sản Phẩm</Link>
                        </li>
                        <li className=" my-4">
                            <LocalShipping />
                            <Link className="text-decoration-none text-white ms-2" to="/admin/orders" >Quản lý Đơn Hàng</Link>
                        </li>
                        <li className=" my-4">
                            <Report />
                            <Link className="text-decoration-none text-white ms-2" to="/admin/reports" >Báo cáo</Link>
                        </li>
                    </ul>
                    <div className='mt-5'>
                        <button className='btn btn-danger' onClick={() => handleLogout()}>Đăng xuất <Logout /></button>

                    </div>
                </div>
                <Outlet /> {/* Hiển thị trang con */}
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