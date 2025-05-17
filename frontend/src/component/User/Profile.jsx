import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../AuthProvider'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Edit } from '@mui/icons-material'
import { urlBE } from '../../baseUrl'

function Profile() {
    const { user } = useContext(AuthContext)

    const [addresses, setAddresses] = useState({})
    const [avatar, setAvatar] = useState([])
    const [isAvatarSelected, setIsAvatarSelected] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState()
    const [editAddress, setEditAddress] = useState({
        address: '',
        city: '',
        country: ''
    })
    const [editInfo, setEditInfo] = useState({
        fullName: user?.user?.fullName,
        phone: user?.user?.phone
    })

    const fetchAddress = async () => {
        try {
            const res = await fetch(`${urlBE}/user/address`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            })
            const data = await res.json()
            setAddresses(data)
            setEditAddress(data)
        } catch (error) {
            console.log("Lỗi kết nối api: ", error);
        }
    }

    const handleUpdateAddress = async () => {
        try {
            const response = await fetch(`${urlBE}/user/address`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify(editAddress)
            });

            if (response.ok) {
                alert("Cập nhật địa chỉ thành công!");
                fetchAddress();
            } else {
                alert("Lỗi khi cập nhật địa chỉ!");
            }
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };

    const handleUpdateInfo = async () => {
        try {
            const res = await fetch(`${urlBE}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(editInfo)
            })
            if (res.ok) {
                alert('Cập nhật thông tin thành công!')
                const infoUpdate = { ...user, user: { ...user.user, ...editInfo } };
                console.log('infoUpdate', infoUpdate);
                localStorage.setItem('user', JSON.stringify(infoUpdate));
                window.location.reload()
            } else {
                alert('Cập nhật thông tin thất bại!')
            }
        } catch (error) {
            console.error('Lỗi API:', error)
        }
    }

    const handleFileChange = (files) => {
        const file = files[0];
        if (file) {
            setAvatar(files);
            setIsAvatarSelected(true);
            setAvatarPreview(URL.createObjectURL(file)); // Tạo URL tạm thời để xem trước
        }
    };

    const handleChangeAvatar = async () => {
        const formData = new FormData()
        for (const x of avatar) {
            formData.append('file', x)
        }
        try {
            const res = await fetch(`${urlBE}/user/avatar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            })
            if (res.ok) {
                alert('Cập nhật ảnh đại diện thành công!');
                window.location.reload();
            }
            else {
                alert('Cập nhật ảnh đại diện thất bại!')
            }

        } catch (error) {
            console.error('Lỗi API:', error)
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [])

    if (!user) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                Bạn cần đăng nhập để truy cập trang này.
            </div>
        );
    }

    return (
        <div>
            {user ? (
                <div className='container p-3 d-flex justify-content-center'>
                    <div className=''>
                        <h1>Thông tin cá nhân</h1>
                        <div className='d-flex justify-content-center'>
                            <div className="position-relative">
                                <img src={avatarPreview || user.user.avatarUrl} alt="Avatar" className='rounded-circle' width={100} height={100} />
                                <button className='btn btn-secondary rounded-circle btn-sm position-absolute bottom-0 end-0' onClick={() => document.getElementById('avatarInput').click()}>
                                    <Edit fontSize="small" />
                                </button>
                                <input
                                    id='avatarInput'
                                    type="file"
                                    accept="image/*"
                                    className='d-none'
                                    onChange={(e) => handleFileChange(e.target.files)}
                                /
                                >
                            </div>

                        </div>
                        {isAvatarSelected && ( // Chỉ hiển thị nút nếu file được chọn
                            <div className="my-3">
                                <button
                                    className="btn btn-warning w-100"
                                    onClick={() => handleChangeAvatar()}
                                >
                                    Cập nhật AVT
                                </button>
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label">Họ và tên</label>
                            <input type="text" className="form-control" value={editInfo.fullName} onChange={(e) => setEditInfo({ ...editInfo, fullName: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" defaultValue={user.user.email} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input type="text" className="form-control" value={editInfo.phone} onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })} />
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
                            <p>{new Date(user.user.createdAt).toLocaleString()}</p>
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
                            <button className='btn btn-danger w-100' onClick={() => handleUpdateInfo()}>Cập nhật</button>
                        </div>
                    </div>
                    <Outlet />
                </div>
            ) : (
                <div className="alert alert-danger m-4" role="alert">
                    Error 404
                </div>
            )}
        </div>
    )
}

export default Profile