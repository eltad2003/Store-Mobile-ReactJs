import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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
                alert('Đăng ký thất bại')
            }
        } catch (error) {
            console.error("Lỗi API:", error);
            alert("Lỗi kết nối server!");
        }
    }



    return (
        <div className="d-flex justify-content-center mt-4">
            <div className="mt-4 p-3 rounded w-25 bg-light">
                <h1 className="text-center">Đăng ký</h1>
                <form >
                    <div className="form-group">
                        <label>Tên đầy đủ</label>
                        <input required type="text" className="form-control" name='fullName' value={fullName} onChange={(e) => setfullName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input required type="email" className="form-control" name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input required type="text" className="form-control" name='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input required type="password" className="form-control" name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Xác nhận mật khẩu</label>
                        <input required type="password" className="form-control" name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-success mt-3 w-100" onClick={handleRegister}>Đăng ký</button>
                </form>
                <p className="mt-3">Bạn đã có tài khoản? </p>
                <Link to={"/login"}><button className="btn btn-primary w-100">Đăng nhập</button></Link>
            </div>

        </div>
    )
}

export default Register