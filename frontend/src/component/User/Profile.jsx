import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../AuthProvider'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Edit } from '@mui/icons-material'
import { urlBE } from '../../baseUrl'

function Profile() {
    const { user } = useContext(AuthContext)

    const [addresses, setAddresses] = useState([])
    const [avatar, setAvatar] = useState([])
    const [isAvatarSelected, setIsAvatarSelected] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState()
    const [editAddress, setEditAddress] = useState({
        address: '',
        city: '',
        country: '',

    })
    const [editInfo, setEditInfo] = useState({
        fullName: user?.user?.fullName,
        phone: user?.user?.phone
    })
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isAddMode, setIsAddMode] = useState(false)

    const [oldPassword, setOldPassWord] = useState('')
    const [newPassword, setNewPassWord] = useState('')
    const [confirmNewPassword, setConfirmNewPassWord] = useState('')

    const fetchAddresses = async () => {
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
        } catch (error) {
            console.log("Lỗi kết nối api: ", error);
        }
    }
    const fetchAddressById = async (id) => {
        try {
            const res = await fetch(`${urlBE}/user/address/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            })
            const data = await res.json()

            setEditAddress(data)
            console.log("address by id", data);
        } catch (error) {
            console.log("Lỗi kết nối api: ", error);
        }
    }

    const handleAddAddress = async () => {
        try {
            const response = await fetch(`${urlBE}/user/address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    ...editAddress,
                    state: '',
                    postalCode: '',
                })
            });
            if (response.ok) {
                alert("Thêm địa chỉ thành công!");
                setShowAddressModal(false)
                fetchAddresses()
            } else {
                alert("Lỗi khi thêm địa chỉ!");
            }
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    };
    const handleUpdateAddress = async () => {
        try {
            const response = await fetch(`${urlBE}/user/address/${selectedAddressId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    ...editAddress,
                    state: '',
                    postalCode: '',
                })
            });

            if (response.ok) {
                alert("Cập nhật địa chỉ thành công!");
                setShowAddressModal(false)
                fetchAddresses();
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

    const openAddressModal = (mode, addressId) => {
        setIsAddMode(mode === 'add');
        setShowAddressModal(true);

        // Đặt selectedAddressId trước khi fetchAddressById
        if (mode === 'add') {
            setSelectedAddressId(null);
            setEditAddress({ address: '', city: '', country: '' });
        } else if (addressId) {
            setSelectedAddressId(addressId); // Đặt ID trước khi fetch
            fetchAddressById(addressId);
        }
    }

    const handleChangePassWord = async () => {
        if (newPassword !== confirmNewPassword) {
            alert('mật khẩu không khớp')
            setConfirmNewPassWord('')
            return
        }
        try {
            const response = await fetch(`${urlBE}/user/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });

            if (response.ok) {
                alert("Thay đổi mật khẩu thành công");
                setOldPassWord('')
                setNewPassWord('')
                setConfirmNewPassWord('')
                window.location.reload()
            } else {
                alert("Thay đổi mật khẩu thất bại!");
            }
        } catch (error) {
            console.error("Lỗi API:", error);
        }
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    if (!user) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                Bạn cần đăng nhập để truy cập trang này.
            </div>
        );
    }

    const modalEditAddress = () => {
        return (
            <div className={`modal fade ${showAddressModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ background: showAddressModal ? 'rgba(0,0,0,0.3)' : 'none' }}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{isAddMode ? "Thêm địa chỉ mới" : "Chi tiết/Sửa địa chỉ"}</h4>
                            <button type="button" className="btn-close" onClick={() => setShowAddressModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-2">
                                <label>Địa chỉ (Số nhà, Ngõ, Xã)</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    name='address'
                                    value={editAddress.address || ''}
                                    onChange={(e) => setEditAddress({ ...editAddress, address: e.target.value })}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label>Thành Phố</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name='city'
                                    value={editAddress.city || ''}
                                    onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label>Khu vực</label>
                                <input
                                    type="text"
                                    className="form-control"

                                    value={editAddress.country || ''}
                                    onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            {isAddMode ? (
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleAddAddress}
                                >
                                    Thêm địa chỉ
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateAddress}
                                >
                                    Lưu thay đổi
                                </button>
                            )}
                            <button type="button" className="btn btn-secondary" onClick={() => setShowAddressModal(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalChangePassword = () => {
        return (
            <div className="modal fade" id="changePasswordModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title bg-light fw-bold">Đổi mật khẩu</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu cũ</label>
                                <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassWord(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu mới</label>
                                <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassWord(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Nhập lại mật khẩu mới</label>
                                <input type="password" className="form-control" value={confirmNewPassword} onChange={(e) => setConfirmNewPassWord(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={handleChangePassWord}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }





    return (
        <div>
            {user ? (
                <div className='container p-3 d-flex justify-content-center'>
                    <div className='w-100' style={{ maxWidth: 500 }}>
                        <h1 className="mb-4 text-center">Thông tin cá nhân</h1>
                        <div className='d-flex justify-content-center mb-3'>
                            <div className="position-relative">
                                <img src={avatarPreview || user.user.avatarUrl} alt="Avatar" className='rounded-circle border border-2' width={110} height={110} />
                                <button className='btn btn-secondary rounded-circle btn-sm position-absolute bottom-0 end-0' onClick={() => document.getElementById('avatarInput').click()}>
                                    <Edit fontSize="small" />
                                </button>
                                <input
                                    id='avatarInput'
                                    type="file"
                                    accept="image/*"
                                    className='d-none'
                                    onChange={(e) => handleFileChange(e.target.files)}
                                />
                            </div>
                        </div>
                        {isAvatarSelected && (
                            <div className="my-3">
                                <button
                                    className="btn btn-warning w-100"
                                    onClick={() => handleChangeAvatar()}
                                >
                                    Cập nhật ảnh đại diện
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
                            <label className="form-label">Địa chỉ</label>
                            <div className="d-flex flex-column gap-2">
                                {addresses.length === 0 && <span className="text-muted">Chưa có địa chỉ nào.</span>}
                                {addresses.map((address, index) => (
                                    <div key={index} className="d-flex align-items-center justify-content-between border rounded p-2">
                                        <span>
                                            {address.address}, {address.city}, {address.country}
                                        </span>
                                        <button
                                            className='btn btn-outline-primary btn-sm ms-2'
                                            onClick={() => openAddressModal('edit', address.id)}
                                        >
                                            Xem/Sửa
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className='btn btn-success btn-sm mt-2'
                                    onClick={() => openAddressModal('add')}
                                >
                                    <i className="bi bi-plus"></i> Thêm địa chỉ
                                </button>
                            </div>
                        </div>
                        <div className='mb-3 d-flex'>
                            <label className="form-label me-2">Ngày tham gia: </label>
                            <p className="mb-0">{new Date(user.user.createdAt).toLocaleString()}</p>
                        </div>
                        <div className='mb-3'>
                            <button className='btn form-control btn-outline-danger' data-bs-target="#changePasswordModal" data-bs-toggle='modal'>Đổi mật khẩu</button>
                        </div>
                        <div className='my-3'>
                            <button className='btn bg text-white w-100' onClick={() => handleUpdateInfo()}>Cập nhật thông tin</button>
                        </div>
                    </div>
                    {showAddressModal && modalEditAddress()}
                    {modalChangePassword()}
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