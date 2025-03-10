import React from 'react'
import { Link } from 'react-router-dom'

function Register() {
    return (

        <div className="d-flex justify-content-center mt-4">
            <div className="mt-4 p-3 rounded w-25 bg-light">
                <h1 className="text-center">Đăng ký</h1>
                <form>
                    <div className="form-group">
                        <label>Tên đầy đủ</label>
                        <input required type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input required type="email" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input required type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input required type="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input required type="password" className="form-control" />
                    </div>
                    <button  type="submit" className="btn btn-success mt-3 w-100">Đăng ký</button>
                </form>
                <p className="mt-3">Bạn đã có tài khoản? </p>
                <Link to={"/login"}><button className="btn btn-secondary w-100">Đăng nhập</button></Link>
            </div>

        </div>
    )
}

export default Register