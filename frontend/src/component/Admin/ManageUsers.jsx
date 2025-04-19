import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthProvider';


function ManageUsers() {
  const [listUsers, setListUsers] = useState([])
  const { user } = useContext(AuthContext)

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
    } catch (error) {
      console.error('Error fetching users:', error);
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
          <div className='card p-3 shadow mt-3 me-3'>
            <table className="table">
              <thead>
                <tr>

                  <th scope="col">STT</th>
                  <th scope="col">ID</th>
                  <th scope="col">Tên</th>
                  <th scope="col">Ảnh</th>
                  <th scope="col">Email</th>
                  <th scope="col">Vai trò</th>
                  <th scope="col">Số điện thoại</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listUsers.map((listUser, index) => (
                  <tr key={listUser.id}>
                    <td>{index + 1}</td>
                    <td>{listUser.id}</td>
                    <td>{listUser.fullName}</td>
                    <td><img src={listUser.avatarUrl} alt="" width={50} height={50} /></td>
                    <td>{listUser.email}</td>
                    <td>{listUser.role}</td>
                    <td>{listUser.phone}</td>
                    <td></td>
                    <td>Đã kích hoạt</td>
                    <td><button className='ms-1 btn btn-sn btn-primary'>Sửa</button></td>
                    <td><button className='ms-1 btn btn-sn btn-danger' onClick={() => handleDeleteUser(listUser.id)}>Xóa</button></td>
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