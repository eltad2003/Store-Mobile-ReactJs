import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../AuthProvider'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

function Profile() {
    const { user } = useContext(AuthContext)
    const [addresses, setAddresses] = useState({})
    const [editAddress, setEditAddress] = useState({
        address: '',
        city: '',
        country: ''
    })

    const fetchAddress = async () => {
        try {
            const res = await fetch('http://localhost:8080/user/address', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            })
            const data = await res.json()
            setAddresses(data)
            setEditAddress(data) // Initialize edit form with current address
        } catch (error) {
            console.log("Lỗi kết nối api: ", error);
        }
    }

    const handleUpdateAddress = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/address', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(editAddress)
            });

            if (response.ok) {
                alert("Cập nhật địa chỉ thành công!");
                fetchAddress(); // Refresh address data
            } else {
                alert("Lỗi khi cập nhật địa chỉ!");
            }
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };

    useEffect(() => {
        fetchAddress()
    }, [])

    return (
        <div>
            {user ? (
                <div className='container p-3 d-flex justify-content-center'>
                    <div className=''>
                        <h1>Thông tin cá nhân</h1>
                        <div className='my-3 text-center'>
                            <img src="https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-avatar-icon-png-image_313572.jpg" alt="" className='img-fluid rounded-circle' width={100} height={100} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input type="text" className="form-control" defaultValue={user.user.fullName} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" defaultValue={user.user.email} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input type="text" className="form-control" defaultValue={user.user.phone} />
                        </div>
                        <div className="mb-3">
                            <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#modalAddress">Xem địa chỉ</button>
                            <div className='modal fade' id='modalAddress' tabIndex={-1}>
                                <div className="modal-dialog modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h4 className="modal-title">Thông tin địa chỉ</h4>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="form-group">
                                                <label>Địa chỉ (Số nhà, Ngõ, Xã)</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    name='address'
                                                    value={editAddress.address || ''}
                                                    onChange={(e) => setEditAddress({ ...editAddress, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Thành Phố</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name='city'
                                                    value={editAddress.city || ''}
                                                    onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Khu vực</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name='country'
                                                    value={editAddress.country || ''}
                                                    onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={handleUpdateAddress}
                                                data-bs-dismiss="modal"
                                            >
                                                Cập nhật địa chỉ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mb-3 d-flex'>
                            <label className="form-label me-2">Ngày tham gia: </label>
                            <p>{user.user.createdAt}</p>
                        </div>
                        <div className='mb-3'>
                            <button className='btn form-control btn-outline-danger' data-bs-target="#changePasswordModal" data-bs-toggle='modal'>Đổi mật khẩu</button>
                        </div>
                        <div>
                            <div className="modal fade" id="changePasswordModal" tabindex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title bg-light fw-bold">Đổi mật khẩu</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Mật khẩu cũ</label>
                                                <input type="password" className="form-control" />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Mật khẩu mới</label>
                                                <input type="password" className="form-control" />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Nhập lại mật khẩu mới</label>
                                                <input type="password" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-danger">Lưu</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='my-3'>
                            <button className='btn btn-danger w-100'>Cập nhật</button>
                        </div>
                    </div>
                    <Outlet />
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default Profile