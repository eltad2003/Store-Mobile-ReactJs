import React, { useEffect, useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'

<script src="https://www.google.com/recaptcha/api.js" async defer></script>

function Register() {
    const [fullName, setfullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
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
                alert("Đăng ký thành công!");
                navigate('/login')
                setfullName('')
                setEmail('')
                setPhone('')
                setPassword('')
                setConfirmPassword('')

            } else {
                // Hiển thị lỗi trả về từ response (nếu có)
                alert(await res.text())
            }
        } catch (error) {

            alert(error)
        }
    }




    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4 rounded-4" style={{ minWidth: 370, maxWidth: 430, width: '100%' }}>
                <h2 className="text-center mb-4 fw-bold">Đăng ký</h2>
                <form onSubmit={handleRegister}>
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
                    <div className="g-recaptcha mb-3" data-sitekey="YOUR_SITE_KEY"></div>
                    <button type="submit" className="btn btn-success btn-lg w-100 rounded-3 fw-semibold">Đăng ký</button>
                </form>
                <div className="text-center mt-3">
                    <span>Bạn đã có tài khoản?</span>
                    <Link to="/login" className="d-block mt-2">
                        <button className="btn btn-primary w-100 rounded-3 fw-semibold">Đăng nhập</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register