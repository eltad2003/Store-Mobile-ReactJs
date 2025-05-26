import React, { useState, useEffect, useContext } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { People, ShoppingCart, Category, LocalShipping, MonetizationOn, Notifications } from "@mui/icons-material";
import { AuthContext } from '../AuthProvider';
import formatPrice from '../../formatPrice';
import { Link } from "react-router-dom";
import { urlBE, urlSocket } from "../../baseUrl";
import { Loading } from "../Loading";


// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [toastMessage, setToastMessage] = useState(null);
    const [showToast, setShowToast] = useState(false)

    const fetchData = async () => {
        try {
            const token = user?.token;
            const [usersRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
                fetch(`${urlBE}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${urlBE}/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${urlBE}/orders/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${urlBE}/categories`),
            ]);
            const [users, products, orders, categories] = await Promise.all([
                usersRes.json(),
                productsRes.json(),
                ordersRes.json(),
                categoriesRes.json(),
            ]);
            setUsers(users);
            setProducts(products);
            setOrders(orders);
            setCategories(categories);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }
    }

    // Fetch all data
    useEffect(() => {

        fetchData();
        // Thiết lập WebSocket với userId và role
        const userId = user?.user.id;
        const socket = new WebSocket(`${urlSocket}?userId=${userId}&role=admin`);

        socket.onopen = () => {
            console.log('✅ WebSocket connected');
        };

        socket.onmessage = (event) => {
            console.log('📩 Nhận thông báo từ server:', event.data);
            setToastMessage(event.data)
            setShowToast(true)
            fetchData()

        };

        socket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('❌ WebSocket disconnected');
        };
        // Đóng kết nối WebSocket khi component unmount
        return () => {
            socket.close();
        };
    }, [user]);

    // Tính toán doanh thu theo tháng/năm
    const getMonthlyRevenue = () => {
        const months = Array(12).fill(0);
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            if (date.getFullYear() === Number(selectedYear) && order.status === 'DELIVERED') {
                months[date.getMonth()] += parseInt(order.totalPrice);
            }
        });
        return months;
    };
    // Tính doanh thu theo ngày trong tháng
    const getDailyRevenue = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const days = Array(daysInMonth).fill(0);
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            if (date.getFullYear() === Number(selectedYear) && (date.getMonth() + 1) === Number(selectedMonth) && order.status === 'DELIVERED') {
                days[date.getDate() - 1] += parseInt(order.totalPrice);
            }
        });
        return days;
    };
    // Thống kê trạng thái đơn hàng
    const getOrderStatusStats = () => {
        const statusMap = {};
        orders.forEach(order => {
            statusMap[order.status] = (statusMap[order.status] || 0) + 1;
        });
        return statusMap;
    };

    // Data cho biểu đồ
    const revenueData = {
        labels: [...Array(12)].map((_, i) => `T${i + 1}`),
        datasets: [
            {
                label: "Doanh thu theo tháng",
                data: getMonthlyRevenue(),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            },
        ],
    };
    const dailyRevenueData = {
        labels: [...Array(new Date(selectedYear, selectedMonth, 0).getDate())].map((_, i) => `${i + 1}`),
        datasets: [
            {
                label: "Doanh thu theo ngày",
                data: getDailyRevenue(),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            },
        ],
    };
    const orderStatusStats = getOrderStatusStats();
    const orderStatusData = {
        labels: Object.keys(orderStatusStats),
        datasets: [
            {
                label: "Số đơn hàng",
                data: Object.values(orderStatusStats),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A', '#E91E63'
                ],
            },
        ],
    };

    // Tổng doanh thu
    const totalRevenue = orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + parseInt(o.totalPrice), 0);
    console.log('Tổng doanh thu: ', totalRevenue);


    // Loading
    if (loading) return <Loading />

    return (
        <div className="container bg-light my-5">
            <div className={`toast shadow position-fixed z-3 top-0 end-0 m-3  ${showToast ? "show" : ""}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <Notifications className="text-danger" />
                    <strong className="me-auto">Thông báo</strong>
                    <small>Vừa xong</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {toastMessage}
                </div>
            </div>
            <h2 className="fw-bold mb-4">DASHBOARD</h2>
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <MonetizationOn className="text-success" style={{ fontSize: 40 }} />
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Tổng doanh thu</div>
                            <div className="fs-4 fw-bold text-success">{formatPrice(totalRevenue)}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <Link
                            to={'users'}
                            style={{ transition: 'transform 1s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <People className="text-primary" style={{ fontSize: 40 }} />
                        </Link>
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Người dùng</div>
                            <div className="fs-4 fw-bold">{users.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <Link
                            to={'products'}
                            style={{ transition: 'transform 1s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <ShoppingCart className="text-warning" style={{ fontSize: 40 }} />
                        </Link>
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Sản phẩm</div>
                            <div className="fs-4 fw-bold">{products.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <Link
                            to={'orders'}
                            style={{ transition: 'transform 1s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <LocalShipping className="text-info" style={{ fontSize: 40 }} />
                        </Link>
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Đơn hàng</div>
                            <div className="fs-4 fw-bold">{orders.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center" >
                        <Link
                            style={{ transition: 'transform 1s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            to={'categories'}
                        >
                            <Category className="text-secondary" style={{ fontSize: 40 }} />
                        </Link>
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Danh mục</div>
                            <div className="fs-4 fw-bold">{categories.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card shadow p-3 h-100">
                        <div className="mb-3 d-flex align-items-center">
                            <label className="form-label mb-0 me-2">Chọn năm:</label>
                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                                className="form-control w-auto"
                            />
                        </div>
                        <Bar
                            data={revenueData}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Biểu đồ doanh thu theo tháng',
                                        font: { size: 16, weight: 'bold' },
                                        color: '#333'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                const value = context.raw;
                                                return `${formatPrice(value)}`;
                                            }
                                        }
                                    },
                                },
                                scales: {
                                    y: {
                                        title: { display: true, text: 'Doanh thu' },
                                        beginAtZero: true
                                    },
                                    x: {
                                        title: { display: true, text: 'Tháng' }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow p-3 h-100">
                        <div className="mb-3 d-flex align-items-center">
                            <label className="form-label mb-0 me-2">Chọn tháng:</label>
                            <select
                                className="form-select w-auto"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
                                ))}
                            </select>
                        </div>
                        <Line
                            data={dailyRevenueData}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Biểu đồ doanh thu theo ngày',
                                        font: { size: 16, weight: 'bold' },
                                        color: '#333'
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                const value = context.raw;
                                                return `${formatPrice(value)}`;
                                            }
                                        }
                                    },
                                },
                                scales: {
                                    y: {
                                        title: { display: true, text: 'Doanh thu' },
                                        beginAtZero: true
                                    },
                                    x: {
                                        title: { display: true, text: 'Ngày' }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Thống kê */}
            <div className="row g-4 mt-2">
                <div className="col-lg-6">
                    <div className="card shadow p-3 h-100">
                        <Pie
                            data={orderStatusData}
                            options={{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: 'Thống kê trạng thái đơn hàng',
                                        font: { size: 16, weight: 'bold' },
                                        color: '#333'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow p-3 h-100">
                        <h5 className="fw-bold mb-3">Top 10 sản phẩm bán chạy</h5>
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Tên sản phẩm</th>
                                    <th>Đã bán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 && orders.length > 0 ? (
                                    products
                                        .map(product => ({
                                            ...product,
                                            sold: orders.reduce((sum, order) => {
                                                if (order.status === 'DELIVERED') {
                                                    return sum + (order.items.filter(item => item.productId === product.id).reduce((s, i) => s + i.quantity, 0));
                                                }
                                                return sum;
                                            }, 0)
                                        }))
                                        .sort((a, b) => b.sold - a.sold)
                                        .slice(0, 10)
                                        .map(product => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.sold}</td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr><td colSpan="2">Không có dữ liệu</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
