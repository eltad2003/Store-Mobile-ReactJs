import React, { useEffect, useState } from 'react'
import formatPrice from '../../formatPrice'
import { Badge } from 'react-bootstrap'
import { urlBE } from '../../baseUrl'

function ManageOrders() {
  const [orders, setOrders] = useState([])
  const token = JSON.parse(localStorage.getItem('user')).token
  const [statusShipping, setStatusShipping] = useState('')
  const [searchByEmail, setSearchByEmail] = useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const fetchOrders = async (search = searchByEmail, start = startDate, end = endDate) => {
    try {
      let url = `${urlBE}/orders/all?email=${search}`
      if (start && end) url += `&start=${start}&end=${end}`
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json();

        // Lấy thông tin chi tiết của từng khách hàng
        const ordersWithDetails = await Promise.all(
          data.map(async (order) => {
            const userDetails = await fetchUserDetail(order.userId); // Lấy thông tin khách hàng
            const itemsWithDetails = await Promise.all(
              order.items.map(async (item) => {
                const productDetails = await fetchProductDetails(item.productId);
                return { ...item, productDetails }; // Gắn thông tin sản phẩm vào từng item
              })
            );
            return { ...order, userDetails, items: itemsWithDetails }; // Gắn thông tin khách hàng và sản phẩm vào đơn hàng
          })
        );

        setOrders(ordersWithDetails);
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchProductDetails = async (productId) => {
    try {
      const res = await fetch(`${urlBE}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data; // Trả về thông tin sản phẩm
      }
    } catch (error) {
      console.error(`Error fetching product details for productId ${productId}:`, error);
    }
    return null; // Trả về null nếu có lỗi
  };
  const fetchUserDetail = async (userId) => {
    try {
      const res = await fetch(`${urlBE}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (error) {
      console.error(`Error fetching product details for productId ${userId}:`, error);
    }
    return null; // Trả về null nếu có lỗi
  };

  useEffect(() => {
    fetchOrders(searchByEmail, startDate, endDate)
  }, [searchByEmail, startDate, endDate])

  const handleUpdateStatus = async (orderId) => {
    try {
      const res = await fetch(`${urlBE}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: statusShipping })
      })
      if (res.ok) {
        alert('Cập nhật trạng thái đơn hàng thành công')
        setStatusShipping('')

        fetchOrders(searchByEmail, startDate, endDate)

      }
      else {
        alert('Vui lòng chọn trạng thái đơn hàng')
      }
    } catch (error) {
      alert('Cập nhật trạng thái đơn hàng thất bại')
      console.error('Lỗi API:', error)
    }
  }



  const getStatusBadge = (status) => {
    const statusColors = {
      'SHIPPED': 'primary',
      'PENDING': 'warning',
      'CANCELLED': 'danger',
      'DELIVERED': 'success',
      'CONFIRMED': 'info'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className='container'>

      <div className='py-5'>
        {/* search orders */}
        <div className='p-2 d-flex justify-content-between gap-3'>
          <h3 className='fw-bold'>Quản lý Các Đơn hàng</h3>
          <div>
            <i className="bi bi-search me-2"></i>
            <input
              type="text"
              value={searchByEmail}
              placeholder='Tìm kiếm theo email....'
              className='rounded-3'
              style={{ width: '500px' }}
              onChange={(e) => setSearchByEmail(e.target.value)}
            />
          </div>
          <div className='d-flex gap-2'>
            <input
              type="date"
              value={startDate}
              className='rounded-3'
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>→</span>
            <input
              type="date"
              value={endDate}
              className='rounded-3'
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button className='btn btn-primary btn-sm' onClick={() => { setStartDate(''); setEndDate('') }}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        <div className='card shadow p-3 mt-3'>
          <table class="table align-middle table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" className='text-nowrap'>STT</th>
                <th scope="col" className='text-nowrap'>Thời gian</th>
                <th scope="col" className='text-nowrap'>Thông tin khách hàng</th>
                <th scope="col" className='text-nowrap'>Sản phẩm</th>
                <th scope="col" className='text-nowrap'>Tổng thanh toán</th>
                <th scope="col" className='text-nowrap'>Trạng thái</th>
                <th scope="col" className='text-nowrap'>Hoạt động</th>

              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr>
                  <td className='text-center'>{index + 1}</td>
                  <td className='text-nowrap'>{new Date(order.createdAt).toLocaleString()}</td>
                  <td className='text-nowrap' title={order.shippingAddress || "Chưa có địa chỉ"}>
                    <div >{order.userDetails?.fullName || 'N/A'}</div>
                    <div>{order.userDetails?.email || 'N/A'}</div>
                    <div>{order.userDetails?.phone || 'N/A'}</div>
                    <div className='text-muted text-truncate fst-italic' style={{ maxWidth: 200 }}>{order.shippingAddress}</div>
                  </td>
                  <td className='w-25 text-nowrap'>
                    {order.items.map(item => (
                      <div key={item.productId}>
                        <div><span className='text-primary'>{item.productDetails?.name || 'N/A'}</span> <span className='text-muted fst-italic ms-1'>SL: {item.quantity}</span></div>

                      </div>
                    ))}
                  </td>
                  <td className='fw-bold'>{formatPrice(order.totalPrice)}</td>
                  <td >{getStatusBadge(order.status)}</td>

                  <td>
                    <select class="form-select form-select-sm" onChange={(e) => setStatusShipping(e.target.value)}>
                      <option>--Trạng thái--</option>
                      <option value="PENDING">Đang chờ xử lí</option>
                      <option value="CONFIRMED">Đã nhận đơn</option>
                      <option value="SHIPPED">Đang vận chuyển</option>
                      <option value="DELIVERED">Giao hàng thành công</option>
                      <option value="CANCELLED">Hủy đơn</option>
                    </select>
                  </td>
                  {order.status === "DELIVERED" || order.status === "CANCELLED" ? (
                    <td><button className="btn btn-primary btn-sm  disabled">Cập nhật</button></td>
                  ) : (
                    <td><button className="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(order.id)}>Cập nhật</button></td>
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