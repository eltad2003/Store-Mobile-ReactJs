import React, { useEffect, useState } from 'react'

function ManageOrders() {
  const [orders, setorders] = useState([])

  useEffect(() => {
    fetch('https://fake-store-api.mock.beeceptor.com/api/orders')
      .then(res => res.json())
      .then(data => setorders(data))
      .catch(err => console.log(err))
  })
  return (
    <div className='row'>
      <div className="col-md-2">
      </div>
      <div className='col-md-10 mt-5'>

        <h3 className='fw-bold'>Quản lý Đơn hàng</h3>
        <div className='card shadow p-3 mt-3'>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Thông tin khách hàng</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Tổng thanh toán</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Hoạt động</th>

              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr>
                  <td>{order.order_id}</td>
                  <td>{order.user_id}</td>
                  <td>
                    {order.items.map(item => (

                      <div key={item.product_id}> ProductId: {item.product_id}, Quantity: {item.quantity}</div>

                    ))}
                  </td>
                  <td>{order.total_price}$</td>
                  <td className={order.status === 'Delivered' ? "text-success" : "text-danger"}>{order.status}</td>
                  <td>
                    <select class="form-control" name="st">
                      <option>--Trạng thái--</option>
                      <option value="1">Đang chờ xử lí</option>
                      <option value="2">Đã nhận đơn</option>
                      <option value="3">Sản phẩm được đóng gói</option>
                      <option value="4">Đang vận chuyển</option>
                      <option value="5">Giao hàng thành công</option>
                      <option value="6">Hủy đơn</option>
                    </select>
                  </td>
                  {order.status === "Delivered" ? (
                    <td><button class="btn btn-primary btn-sm  disabled">Cập nhật</button></td>
                  ) : (
                    <td><button class="btn btn-primary btn-sm  ">Cập nhật</button></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>

  )
}

export default ManageOrders