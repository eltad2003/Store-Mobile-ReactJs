import React, { useContext } from 'react'
import { AuthContext } from '../AuthProvider'
import { Link, Outlet } from 'react-router-dom'
function Profile() {
    const { user } = useContext(AuthContext)
    return (
        <div>
            {user ? (
                <div className='container p-3 d-flex justify-content-center'>
                    <div className=''>
                        <h1>Thông tin cá nhân</h1>
                        <div className='my-3 text-center'>
                            <img src="https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-avatar-icon-png-image_313572.jpg" alt="" className='img-fluid rounded-circle' width={100} height={100} />

                        </div>
                        <div class="mb-3">
                            <label class="form-label">Họ và tên</label>
                            <input type="text" class="form-control" defaultValue={user.user.fullName} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="text" class="form-control" defaultValue={user.user.email} disabled />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Số điện thoại</label>
                            <input type="text" class="form-control" defaultValue={user.user.phone} />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Địa chỉ</label>
                            <input type="text" class="form-control" defaultValue={user.user.address} />
                        </div>
                        <div className='mb-3 d-flex'>
                            <label class="form-label me-2">Ngày tham gia: </label>
                            <p>{user.user.createdAt}</p>
                        </div>
                        <div className='mb-3'>
                            <button className='btn form-control btn-outline-danger' data-bs-target="#changePasswordModal" data-bs-toggle='modal'>Đổi mật khẩu</button>
                        </div>
                        <div>
                            <div class="modal fade" id="changePasswordModal" tabindex="-1">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title bg-light fw-bold">Đổi mật khẩu</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="mb-3">
                                                <label class="form-label">Mật khẩu cũ</label>
                                                <input type="password" class="form-control" />
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Mật khẩu mới</label>
                                                <input type="password" class="form-control" />
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label">Nhập lại mật khẩu mới</label>
                                                <input type="password" class="form-control" />
                                            </div>

                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-danger">Lưu</button>
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