import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { Google } from '@mui/icons-material'
import ReCAPTCHA from 'react-google-recaptcha'


function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [capcha, setCapcha] = useState(null)
    const { login } = useContext(AuthContext)


    const handleLogin = async (e) => {
        e.preventDefault()
        if (!capcha) {
            alert('Vui lòng xác minh không phải Robot')
            return
        }
        await login(email, password)
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            if (user.user.role === "ADMIN") {
                navigate('/admin')
            } else {
                navigate('/')
            }
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
        <div className="container mt-5 d-flex justify-content-center align-items-center ">
            <div className="card shadow-lg p-4 rounded-4" style={{ minWidth: 370, maxWidth: 400, width: '100%' }}>
                <h2 className="text-center mb-4 fw-bold">Đăng nhập</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg rounded-3"
                            value={email}
                            name='email'
                            id="email"
                            placeholder="Nhập email..."
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control form-control-lg rounded-3"
                            value={password}
                            name='password'
                            id='password'
                            placeholder="Nhập mật khẩu..."
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <ReCAPTCHA
                            sitekey='6LdC_TArAAAAAGmaz1ra2JHjkKd66Ip7qx5NDLbR'

                            onChange={(value) => setCapcha(value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary  w-100 rounded-3 mt-2 fw-semibold">Đăng nhập</button>
                </form>
                <div className="d-flex align-items-center my-3">
                    <hr className="flex-grow-1" />
                    <span className="mx-2 text-muted">Hoặc</span>
                    <hr className="flex-grow-1" />
                </div>
                <button
                    className="btn btn-light border d-flex align-items-center justify-content-center gap-2 w-100 rounded-3 py-2 mb-2 shadow-sm"
                    style={{ fontWeight: 500 }}
                    onClick={handleLoginGoogle}
                >
                    <span style={{ color: '#4285F4', fontSize: 22 }}><Google /></span>
                    Đăng nhập bằng Google
                </button>
                <div className="text-center mt-3">
                    <span>Bạn chưa có tài khoản?</span>
                    <Link to="/register" className="d-block mt-2">
                        <button className="btn btn-success w-100 rounded-3 fw-semibold">Đăng ký ngay</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login