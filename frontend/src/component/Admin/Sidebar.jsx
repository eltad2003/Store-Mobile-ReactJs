import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <div className="z-1 position-absolute  bg-secondary text-white card shadow h-100">
            <ul className="list-unstyled p-3 fw-semibold mt-5">
                <h3 className='mb-5'>Quản lý</h3>
                <li className=" mt-3">
                    <Link className="text-decoration-none text-white ms-2" to="/admin/users" >Quản lý người dùng</Link>
                </li>
                <li className=" mt-3">
                    <Link className="text-decoration-none text-white ms-2" to="/admin/products" >Quản lý Sản Phẩm</Link>
                </li>
                <li className=" mt-3">

                    <Link className="text-decoration-none text-white ms-2" to="/admin/orders" >Quản lý đơn hàng</Link>
                </li>
                <li className=" mt-3">

                    <Link className="text-decoration-none text-white ms-2" to="/admin/reports" >Báo cáo</Link>
                </li>
            </ul>
        </div>
    )
}

export default Sidebar