import React, { useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { data, Link, useNavigate } from 'react-router-dom'
import { urlBE } from '../../baseUrl'


function Register() {
    const [fullName, setfullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [show, setShow] = useState('d-block')
    const [showOtp, setShowOtp] = useState('d-none')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()


    const handleRegister = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp')
            setConfirmPassword('')
            return
        }
        try {
            const res = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    password: password,
                })
            })
            if (res.ok) {
                alert('Tiếp tục xác minh OTP')
                setfullName('')
                setPhone('')
                setPassword('')
                setConfirmPassword('')
                setShow('d-none')
                setShowOtp('d-block')
            } else {
                // Hiển thị lỗi trả về từ response (nếu có)
                alert(await res.text())
            }
        } catch (error) {

            alert(error)
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
                alert('Xác minh thành công. Chuyển đến trang đăng nhập')
                navigate('/login')
            }
            else {
                alert(await res.text())
            }
        } catch (error) {
            console.log("Lỗi api", error);
        }
    }



    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 rounded-4" style={{ minWidth: 370, maxWidth: 430, width: '100%' }}>
                <h2 className="text-center mb-4 fw-bold">Đăng ký</h2>
                <form className={show}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label fw-semibold">Tên đầy đủ</label>
                        <input required type="text" className="form-control form-control-lg rounded-3" name='fullName' id="fullName" value={fullName} placeholder="Nhập họ tên..." onChange={(e) => setfullName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                        <input required type="email" className="form-control form-control-lg rounded-3" name='email' id="email" value={email} placeholder="Nhập email..." onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label fw-semibold">Số điện thoại</label>
                        <input required type="text" className="form-control form-control-lg rounded-3" name='phone' id="phone" value={phone} placeholder="Nhập số điện thoại..." onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label fw-semibold">Mật khẩu</label>
                        <input required type="password" className="form-control form-control-lg rounded-3" name='password' id="password" value={password} placeholder="Nhập mật khẩu..." onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">Xác nhận mật khẩu</label>
                        <input required type="password" className="form-control form-control-lg rounded-3" name='confirmPassword' id="confirmPassword" value={confirmPassword} placeholder="Nhập lại mật khẩu..." onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>


                </form>
                <div className={showOtp}>
                    <label htmlFor="otp" className='form-label'>Nhập OTP</label>
                    <input type="text" className='form-control' value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
                <div className="mt-3">
                    {show === 'd-block' ?
                        <button type="submit" className="btn btn-success w-100 rounded-3 fw-semibold" onClick={handleRegister}>Đăng ký</button>
                        :
                        <button type="submit" className="btn btn-success w-100 rounded-3 fw-semibold" onClick={handleOTP}>Xác nhận</button>
                    }
                </div>
                <div className="text-center mt-3">
                    <span>Bạn đã có tài khoản?</span>
                    <Link to="/login" className="d-block mt-2">
                        <button className="btn btn-primary w-100 rounded-3 fw-semibold">Đăng nhập</button>
                    </Link>
                </div>
            </div>
        </div >
    )
}

export default Register