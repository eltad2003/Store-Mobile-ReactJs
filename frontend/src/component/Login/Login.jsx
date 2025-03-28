import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)


    const handleLogin = async (e) => {
        e.preventDefault()
        await login(username, password)
        navigate('/')
    }

    return (

        <div className="container d-flex justify-content-center mt-5 p-3">
            <div className="p-3 rounded w-25 mt-4 bg-light">
                <h1 className="text-center">Đăng nhập</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 w-100" >Đăng nhập</button>
                </form>
                <p className="mt-3">Bạn chưa có tài khoản?</p>
                <Link to={"/register"}><button className="btn btn-success w-100" >Đăng ký ngay</button></Link>
            </div>
        </div>
    )
}

export default Login