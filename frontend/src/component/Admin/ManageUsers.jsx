import React, { useEffect, useState } from 'react'


function ManageUsers() {
  const [users, setUsers] = useState([])


  const [active, setActive] = useState(users.map(() => true))

  const toggleActive = (index) => {
    setActive(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  useEffect(() => {
    fetch('https://fakestoreapi.in/api/users')
      .then(res => res.json())
      .then(res => setUsers(res.users))
      .catch(err => console.log('err:', err))
  })

  return (
    <div className='row'>
      <div className="col-md-2">
      </div>
      <div className='col-md-10'>
        <div className="container p-3 mt-3">
          <h3 className='fw-bold'>Quản lý người dùng</h3>
          <div className='card p-3 shadow mt-3'>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">STT</th>
                  <th scope="col">Tên</th>
                  <th scope="col">Email</th>
                  <th scope="col">Số điện thoại</th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Trạng thái</th>
                  <th scope="col">Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name.firstname} {user.name.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address.street}, {user.address.city}</td>
                    <td>{`${active[user.id]}`}</td>
                    <td>
                      {active[user.id] ? (
                        <button className="" onClick={() => toggleActive(user.id)}>Inactive</button>
                      ) : (
                        <button className="" onClick={() => toggleActive(user.id)}>Active</button>
                      )}
                      <button className='ms-2 text-danger'>Xóa</button>
                    </td>
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