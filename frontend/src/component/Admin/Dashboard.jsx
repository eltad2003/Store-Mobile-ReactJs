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
import { ArrowDownward, ArrowUpward, People, ShoppingCart, Category, LocalShipping, MonetizationOn } from "@mui/icons-material";
import { AuthContext } from '../AuthProvider';
import formatPrice from '../../formatPrice';

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

    // Fetch all data
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const token = user?.token;
                const [usersRes, productsRes, ordersRes, categoriesRes] = await Promise.all([
                    fetch('http://localhost:8080/users', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:8080/products', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:8080/orders/all', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:8080/categories'),
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
                // eslint-disable-next-line
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [user]);

    // Tính toán doanh thu theo tháng/năm
    const getMonthlyRevenue = () => {
        const months = Array(12).fill(0);
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            if (date.getFullYear() === Number(selectedYear) && order.status === 'DELIVERED') {
                months[date.getMonth()] += order.totalPrice;
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
                days[date.getDate() - 1] += order.totalPrice;
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
    const totalRevenue = orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.totalPrice, 0);

    // Loading
    if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;

    return (
        <div className="container-fluid bg-light min-vh-100 p-4">
            <h2 className="fw-bold mb-4">Bảng điều khiển quản trị</h2>
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
                        <People className="text-primary" style={{ fontSize: 40 }} />
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Người dùng</div>
                            <div className="fs-4 fw-bold">{users.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <ShoppingCart className="text-warning" style={{ fontSize: 40 }} />
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Sản phẩm</div>
                            <div className="fs-4 fw-bold">{products.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <LocalShipping className="text-info" style={{ fontSize: 40 }} />
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Đơn hàng</div>
                            <div className="fs-4 fw-bold">{orders.length}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card shadow border-0 p-3 d-flex flex-row align-items-center">
                        <Category className="text-secondary" style={{ fontSize: 40 }} />
                        <div className="ms-3">
                            <div className="fw-semibold text-muted">Danh mục</div>
                            <div className="fs-4 fw-bold">{categories.length}</div>
                        </div>
                    </div>
                </div>
            </div>
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
                        <h5 className="fw-bold mb-3">Top 5 sản phẩm bán chạy</h5>
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
                                                    return sum + (order.items.filter(i => i.productId === product.id).reduce((s, i) => s + i.quantity, 0));
                                                }
                                                return sum;
                                            }, 0)
                                        }))
                                        .sort((a, b) => b.sold - a.sold)
                                        .slice(0, 5)
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
