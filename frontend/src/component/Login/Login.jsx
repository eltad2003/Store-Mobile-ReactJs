import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'
import { Google } from '@mui/icons-material'
import ReCAPTCHA from 'react-google-recaptcha'
import { urlBE } from '../../baseUrl'


function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [capcha, setCapcha] = useState(null)
    const { login } = useContext(AuthContext)
    const [show, setShow] = useState(false)
    const [showForm, setShowForm] = useState('d-block')
    const [otp, setOtp] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

    }, [user])

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!capcha) {
            alert('Vui lòng xác minh không phải Robot');
            return;
        }

        const result = await login(email, password);

        if (!result.success) {
            alert(result.message || 'Đăng nhập thất bại');
            if (result.user && result.user.isVerified === false) {
                setShow(true);
                setShowForm('d-none');
            }
            return;
        }

        // Đăng nhập thành công
        if (result.user.role === "ADMIN") {
            navigate('/admin');
            alert('ADMIN đăng nhập thành công');
        } else {
            navigate('/');
            alert('Khách hàng đăng nhập thành công');
        }
    };

    const handleReSendOtp = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${urlBE}/otp/resend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                })
            })
            if (res.ok) {
                alert('Đã gửi OTP. Vui lòng kiểm tra email')

            }
            else {
                alert(await res.text())
            }
        } catch (error) {
            console.log("Lỗi api", error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleOTP = async () => {
        try {
            const res = await fetch(`${urlBE}/otp/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    code: otp
                })
            })
            if (res.ok) {
                alert('Xác minh thành công. Vui lòng đăng nhập lại')
                window.location.reload()
                navigate('/login')
            }
            else {
                alert(await res.text())
            }
        } catch (error) {
            console.log("Lỗi api", error);
        }
    }

    const handleLoginGoogle = async (e) => {
        e.preventDefault()
        try {
            const popup = window.open(`${urlBE}/google_login`, '_blank', 'width=500,height=600');
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

    console.log(show);




    return (
        <div className="container py-5 d-flex justify-content-center align-items-center ">
            <div className="card shadow-lg  rounded-4" style={{ minWidth: 370, maxWidth: 400, width: '100%' }}>
                <div className="card-header text-white bg">
                    <h2 className="text-center  mb-4 fw-bold">Đăng nhập</h2>
                </div>

                <form className={`${showForm} p-4`}>
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
                            sitekey='6LehoyorAAAAAPD3Z0LvRCpIvQNSw3gRztEzvGFz'

                            onChange={(value) => setCapcha(value)}
                        />
                    </div>
                </form>
                {show && (
                    <>
                        <Link className="text-center text-decoration-none text-danger fw-semibold mb-2" onClick={handleReSendOtp}>
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Vui lòng chờ giây lát...
                                </>
                            ) : (
                                'Gửi mã xác minh'
                            )}
                        </Link>
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">Nhập mã OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {/* Nút chính tùy theo trạng thái */}
                <div className='p-4'>
                    {show ? (
                        <button
                            type="button"
                            className="btn btn-warning w-100 rounded-3 mt-2 fw-semibold"
                            onClick={handleOTP}
                        >
                            Xác nhận OTP
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn bg text-white w-100 rounded-3 mt-2 fw-semibold"
                            onClick={handleLogin}
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
                <div className="p-4">
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
                            <button className="btn bg text-white w-100 rounded-3 fw-semibold">Đăng ký ngay</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login