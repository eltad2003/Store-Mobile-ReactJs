import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import formatPrice from '../../formatPrice';

function ViewOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8080/orders`, {
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
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        const statusColors = {
            'SHIPPED': 'success',
            'PENDING': 'warning',
            'CANCELLED': 'danger',
            'DELIVERED': 'info',
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
            const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
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
            setSelectedOrder(orderDetails);
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
                                    <p><strong>Order ID:</strong> #{order.id}</p>
                                    <p><strong>User ID:</strong> {order.userId}</p>
                                    <p><strong>Thời gian:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="col-md-6">
                                    <p><strong>Trạng thái:</strong> {getStatusBadge(order.status)}</p>
                                    <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusBadge(order.paymentStatus)}</p>
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
                                        <th>Product ID</th>
                                        <th>Số lượng</th>
                                        <th>Giá gốc</th>
                                        <th>Giá cuối</th>
                                        <th>Tổng cộng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.productId}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatPrice(item.originalPrice)}</td>
                                            <td>{formatPrice(item.price)}</td>
                                            <td>{formatPrice(item.price * item.quantity)}</td>
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
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => handleViewDetails(order.id)}
                                        >
                                            Xem chi tiết
                                        </Button>
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
        </div>
    );
}

export default ViewOrder;