import React, { useEffect, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { data, Link, useNavigate } from 'react-router-dom'
import { urlBE } from '../../baseUrl'
import { LoadingButton } from '../Loading'


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
        setIsLoading(true)
        e.preventDefault()
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp')
            setConfirmPassword('')
            return
        }
        try {
            const res = await fetch(`${urlBE}/register`, {
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
        } finally {
            setIsLoading(false)
        }
    }

    const handleOTP = async () => {
        setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className="container py-5 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg rounded-4" style={{ minWidth: 370, maxWidth: 430, width: '100%' }}>
                <div className="bg text-white card-header">
                    <h2 className="text-center mb-4 fw-bold">Đăng ký</h2>
                </div>
                <form className={`${show} p-4 card-body`}>
                    <div className="form-floating mb-3">
                        <input required type="text" className="form-control form-control-lg rounded-3" name='fullName' id="fullName" value={fullName} placeholder="Nhập họ tên..." onChange={(e) => setfullName(e.target.value)} />
                        <label htmlFor="fullName" className="form-label fw-semibold">Tên đầy đủ</label>
                        <div className="invalid-feedback">Vui long nhap </div>
                    </div>
                    <div className="form-floating mb-3">
                        <input required type="email" className="form-control form-control-lg rounded-3" name='email' id="email" value={email} placeholder="Nhập email..." onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input required type="text" className="form-control form-control-lg rounded-3" name='phone' id="phone" value={phone} placeholder="Nhập số điện thoại..." onChange={(e) => setPhone(e.target.value)} />
                        <label htmlFor="phone" className="form-label fw-semibold">Số điện thoại</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input required type="password" className="form-control form-control-lg rounded-3" name='password' id="password" value={password} placeholder="Nhập mật khẩu..." onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="password" className="form-label fw-semibold">Mật khẩu</label>
                    </div>
                    <div className="form-floating">
                        <input required type="password" className="form-control form-control-lg rounded-3" name='confirmPassword' id="confirmPassword" value={confirmPassword} placeholder="Nhập lại mật khẩu..." onChange={(e) => setConfirmPassword(e.target.value)} />
                        <label htmlFor="confirmPassword" className="form-label fw-semibold">Xác nhận mật khẩu</label>
                    </div>
                </form>
                <div className="px-4">
                    <div className={`${showOtp} p-3`}>
                        <label htmlFor="otp" className='form-label'>Nhập OTP</label>
                        <input type="text" className='form-control' value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </div>
                    <div className="">
                        {show === 'd-block' ?
                            <button type="submit" className="btn bg text-white  w-100 rounded-3 fw-semibold" onClick={handleRegister} disabled={isLoading}>
                                {isLoading ? (
                                    <LoadingButton />
                                ) : (
                                    'Đăng ký'
                                )}
                            </button>
                            :
                            <button type="submit" className="btn bg text-white  w-100 rounded-3 fw-semibold" onClick={handleOTP} disabled={isLoading}>
                                {isLoading ? (
                                    <LoadingButton />
                                ) : (
                                    'Xác nhận'
                                )}
                            </button>
                        }
                    </div>
                    <div className="text-center py-4">
                        <i className="bi bi-check-circle-fill text-success me-1"></i>
                        <span>Bạn đã có tài khoản?</span>
                        <Link to="/login" className="d-block mt-2">
                            <button className="btn bg text-white w-100 rounded-3 fw-semibold">Đăng nhập</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register