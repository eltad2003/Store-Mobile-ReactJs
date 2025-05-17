import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import formatPrice from '../../formatPrice';
import { urlBE } from '../../baseUrl';

function ViewOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const { user } = useContext(AuthContext);


    const fetchOrders = async () => {
        try {
            const response = await fetch(`${urlBE}/orders`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            // Lấy thông tin chi tiết của từng sản phẩm

            setOrders(data);
            console.log('ordersWithDetails', data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const res = await fetch(`${urlBE}/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
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

    useEffect(() => {
        fetchOrders();
    }, []);

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

    const getPaymentStatusBadge = (status) => {
        const statusColors = {
            'PAID': 'success',
            'UNPAID': 'danger',
            'PENDING': 'warning'
        };
        return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
    };

    const handleViewDetails = async (orderId) => {
        setLoadingDetails(true);
        try {
            const response = await fetch(`${urlBE}/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            const orderDetails = await response.json();
            const itemsWithDetails = await Promise.all(
                orderDetails.items.map(async (item) => {
                    const productDetails = await fetchProductDetails(item.productId);
                    return { ...item, productDetails };
                })
            );
            setSelectedOrder({ ...orderDetails, items: itemsWithDetails });
            setShowModal(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingDetails(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                Error: {error}
            </div>
        );
    }
    const handleCancelOrder = async (orderId) => {
        try {
            const res = await fetch(`${urlBE}/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    reason: cancellationReason
                })
            });
            if (res.ok) {
                alert('Đơn hàng đã được hủy thành công.');
                setShowModal(false);
                fetchOrders(); // Refresh the orders list
            }
            else {
                alert(await res.text())
            }
        } catch (error) {
            console.log('Error canceling order:', error);

        }
    }

    const modalCancelOrder = () => {
        return (
            <div className="modal fade" id='cancelOrderModal' tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Hủy đơn hàng #{selectedOrder?.id}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label className='form-label'>Lí do</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="modal-footer">
                            <Button variant="secondary" data-bs-dismiss="modal">
                                Đóng
                            </Button>
                            <Button variant="danger" onClick={() => handleCancelOrder(selectedOrder.id)} data-bs-dismiss="modal">
                                Hủy đơn hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const OrderDetailsModal = ({ order, show, onHide, loading }) => {
        if (!order) return null;

        return (
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng #{order.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center p-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <p><strong>Mã đơn hàng:</strong> #{order.id}</p>
                                    <p><strong>Thời gian tạo:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                    <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
                                    <p><strong>Ghi chú cho shipper:</strong> {order.note || '[]'}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Trạng thái giao hàng:</strong> {getStatusBadge(order.status)}</p>
                                    <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusBadge(order.paymentStatus)}</p>
                                    <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                                    <p><strong>Tổng cộng:</strong> {formatPrice(order.totalPrice)}</p>
                                </div>
                            </div>

                            {order.cancellationReason && (
                                <div className="alert alert-danger">
                                    <strong>Lý do hủy:</strong> {order.cancellationReason}
                                </div>
                            )}

                            <h5 className="mb-3">Chi tiết sản phẩm</h5>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>

                                        <th>Tên sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Giá gốc</th>
                                        <th>Giá cuối</th>
                                        <th>Tổng cộng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>

                                            <td>{item.productDetails?.name || 'N/A'}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatPrice(item.originalPrice)}</td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td className='fw-bold text-danger'>{formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <div className="container mt-4">
            <Card>
                <Card.Header className="bg-primary text-white">
                    <h4 className="mb-0">Danh sách đơn hàng của bạn</h4>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày tạo</th>
                                <th>Trạng thái</th>
                                <th>Thanh toán</th>
                                <th>Tổng tiền</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                                    <td className='text-muted fw-bold'>{formatPrice(order.totalPrice)}</td>
                                    <td className='d-flex gap-2'>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => handleViewDetails(order.id)}
                                        >
                                            Chi tiết
                                        </Button>

                                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                            <Button
                                                variant='danger'
                                                size='sm'
                                                data-bs-toggle="modal"
                                                data-bs-target="#cancelOrderModal"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <i className='bi bi-'>Hủy</i>
                                            </Button>
                                        )}

                                    </td>
                                </tr>


                            ))}

                        </tbody>

                    </Table>
                    {orders.length === 0 && (
                        <div className='d-flex justify-content-center'>
                            <p className='text-center'>Bạn chưa có đơn hàng nào.</p>
                            <Link to={'/'} className='ms-2'>Mua sắm ngay</Link>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <OrderDetailsModal
                order={selectedOrder}
                show={showModal}
                onHide={() => setShowModal(false)}
                loading={loadingDetails}
            />
            {modalCancelOrder()}

        </div>
    );
}

export default ViewOrder;