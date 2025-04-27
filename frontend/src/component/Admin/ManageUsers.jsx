import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthProvider';


function ManageUsers() {
  const [listUsers, setListUsers] = useState([])
  const { user } = useContext(AuthContext)
  const [userAddresses, setUserAddresses] = useState({})
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: ""
  })


  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      })
      const data = await response.json()
      setListUsers(data)
      data.forEach(user => fetchUserAddress(user.id))
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  const fetchUserAddress = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}/address`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      })
      const data = await response.json()
      setUserAddresses(prev => ({
        ...prev,
        [userId]: data
      }))
    } catch (error) {
      console.error(`Error fetching address for user ${userId}:`, error);
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });

        if (response.ok) {
          alert("Xóa người dùng thành công!");
          fetchUsers()
        } else {
          alert("Lỗi khi xóa người dùng này!");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    }
  };
  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(newUser),
      })
      if (response.ok) {
        alert('Thêm người dùng thành công')
        fetchUsers()
      }
      else {
        alert("Lỗi khi thêm người dùng")
      }
    } catch (error) {
      console.log("Lỗi api: ", error);
    }
  }

  return (
    <div className='row'>
      <div className="col-md-2">
      </div>
      <div className='col-md-10'>
        <div className="container p-3 mt-3">
          <h3 className='fw-bold'>Quản lý người dùng</h3>

          {/* Them nguoi dung */}
          <button type='button' className='btn btn-success ms-auto me-5' data-bs-toggle="modal" data-bs-target="#modalAddUser">Thêm người dùng</button>
          <div className='modal fade' id='modalAddUser' tabIndex={-1}>
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Thêm Người Dùng</h4>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div className="modal-body">
                  <div >
                    <div className="form-group">
                      <label>Tên đầy đủ</label>
                      <input type="text" className="form-control" name='fullName' onChange={e => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" name='email' onChange={e => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Mật khẩu</label>
                      <input type="password" className="form-control" name='password' onChange={e => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input type="text" className="form-control" name='phone' onChange={e => setNewUser({ ...newUser, [e.target.name]: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Vai trò</label>
                      <select name="role" className='form-select' onChange={e => setNewUser({ ...newUser, [e.target.name]: e.target.value })}>
                        <option selected value="">-Chọn vai trò-</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="CUSTOMER">CUSTOMER</option>

                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={() => handleAddUser()} data-bs-dismiss="modal">Thêm</button>
                </div>

              </div>
            </div>
          </div>
          <p>Tổng người dùng: {listUsers.length}</p>
          <div className='card shadow p-3 me-5 mt-3'>
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-center" style={{ width: '5%' }}>STT</th>

                  <th scope="col" style={{ width: '15%' }}>Tên</th>
                  <th scope="col" className="text-center" style={{ width: '10%' }}>Ảnh</th>
                  <th scope="col" style={{ width: '15%' }}>Email</th>
                  <th scope="col" className="text-center" style={{ width: '10%' }}>Vai trò</th>
                  <th scope="col" className="text-center" style={{ width: '10%' }}>Số điện thoại</th>
                  <th scope="col" style={{ width: '15%' }}>Địa chỉ</th>
                  <th scope="col" className="text-center" style={{ width: '10%' }}>Trạng thái</th>
                  <th scope="col" className="text-center" style={{ width: '10%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listUsers.map((listUser, index) => (
                  <tr key={listUser.id}>
                    <td className="text-center">{index + 1}</td>

                    <td>
                      <div className="d-flex align-items-center">
                        <span className="fw-medium">{listUser.fullName}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <img
                        src={listUser.avatarUrl}
                        alt=""
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {listUser.email}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${listUser.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                        {listUser.role}
                      </span>
                    </td>
                    <td className="text-center">{listUser.phone}</td>
                    <td>
                      {userAddresses[listUser.id] ? (
                        <div className="small">
                          <div className="text-truncate" style={{ maxWidth: '200px' }}>
                            <i className="bi bi-geo-alt me-1"></i>
                            {userAddresses[listUser.id].address}
                          </div>
                          <div className="text-muted">
                            {userAddresses[listUser.id].city}, {userAddresses[listUser.id].country}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small">Chưa có địa chỉ</span>
                      )}
                    </td>
                    <td>Đã kích hoạt</td>
                    <td><button className='ms-1 btn btn-sm btn-danger' onClick={() => handleDeleteUser(listUser.id)}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers