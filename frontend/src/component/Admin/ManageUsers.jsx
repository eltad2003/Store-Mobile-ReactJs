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
                    <td>{listUser.email}</td>
                    <td>{listUser.phone}</td>
                    <td></td>
                    <td>{listUser.status}</td>
                    <td><button className='ms-1 btn btn-sn btn-danger'>Xóa</button></td>
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