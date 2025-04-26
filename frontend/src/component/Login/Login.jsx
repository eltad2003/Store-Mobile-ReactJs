import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { Google } from '@mui/icons-material'


function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)


    const handleLogin = async (e) => {
        e.preventDefault()
        await login(email, password)
        const user = JSON.parse(localStorage.getItem('user'))
        console.log(user);

        if (user) {
            if (user.user.role === "ADMIN") {
                navigate('/admin')
            } else {
                alert("Đăng nhập thành công")
                navigate('/')
            }
        } else {
            alert("Đăng nhập thất bại")
        }
    }
    const handleLoginGoogle = async (e) => {
        e.preventDefault()
        try {
            const popup = window.open('http://localhost:8080/google_login', '_blank', 'width=500,height=600');

            if (!popup) {
                alert('Không thể mở popup. Vui lòng tắt chặn popup.');
                return;
            }

            const interval = setInterval(() => {
                try {
                    if (popup.closed) {
                        clearInterval(interval);
                        alert('Đăng nhập thất bại hoặc popup đã đóng');
                    }

                    const url = popup.location.href;

                    if (url.includes('auth-success')) {
                        const params = new URLSearchParams(popup.location.search);
                        const token = params.get('token');
                        const userBase64 = params.get('user');

                        if (token && userBase64) {
                            const userJson = decodeURIComponent(escape(atob(userBase64)));
                            const user = JSON.parse(userJson);

                            const authData = {
                                token: token,
                                user: user
                            };

                            // Lưu chung vào localStorage
                            localStorage.setItem('user', JSON.stringify(authData));
                            popup.close();
                            alert('Đăng nhập thành công!');
                            navigate('/');
                            window.location.reload()
                        } else {
                            alert('Đăng nhập thất bại: Thiếu token hoặc user');
                            popup.close();
                        }

                        clearInterval(interval);
                    }
                } catch (error) {
                    // Ignore cross-origin error until popup redirect đúng domain
                }
            }, 1000);

        } catch (error) {
            alert('Đã xảy ra lỗi khi đăng nhập Google');
            console.error('Lỗi:', error);
        }
    };





    return (
        <div className="container d-flex justify-content-center align-items-center mt-5 p-3">
            <div className="p-3 rounded bg-light w-50">
                <h1 className="text-center">Đăng nhập</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="text"
                            className="form-control"
                            value={email}
                            name='email'
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            name='password'
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 w-100">Đăng nhập</button>



                </form>
                <p className='mt-3 text-center'>Hoặc</p>
                <button className="btn btn-primary w-100" onClick={handleLoginGoogle} >Đăng nhập bằng Google <Google /></button>
                <p className="mt-3 text-center">Bạn chưa có tài khoản?</p>
                <Link to={"/register"}>
                    <button className="btn btn-success w-100">Đăng ký ngay</button>
                </Link>
            </div>
        </div>
    )
}

export default Login