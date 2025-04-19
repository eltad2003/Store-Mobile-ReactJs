import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthProvider';


function ManageUsers() {
  const [listUsers, setListUsers] = useState([])
  const { user } = useContext(AuthContext)



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
  return (
    <div className='row'>
      <div className="col-md-2">
      </div>
      <div className='col-md-10'>
        <div className="container p-3 mt-3">
          <h3 className='fw-bold'>Quản lý người dùng</h3>
          <div className='card p-3 shadow mt-3 me-3'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tên</th>
                  <th scope="col">Ảnh</th>
                  <th scope="col">Email</th>
                  <th scope="col">Số điện thoại</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listUsers.map((listUser) => (
                  <tr key={listUser.id}>
                    <td>{listUser.id}</td>
                    <td>{listUser.fullName}</td>
                    <td><img src={listUser.avatarUrl} alt="" width={50} height={50} /></td>
                    <td>{listUser.email}</td>
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