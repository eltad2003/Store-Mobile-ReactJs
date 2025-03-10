import React, { useState } from "react";
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
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";


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
    const [selectedYear, setSelectedYear] = useState(2024);
    const [filterType, setFilterType] = useState("month");

    const revenueData = {
        labels: [...Array(12)].map((_, i) => (`T${i + 1}`)),
        datasets: [
            {
                label: "Doanh thu theo tháng",

                data: [0, 20, 10, 30, 15, 40, 20, 60, 60, 40, 10, 30],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
        ],
    };

    const orderStatusData = {
        labels: ["Đã hủy", "Đang xử lý"],
        datasets: [
            {
                label: "Số đơn hàng",

                data: [30, 70],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ],
            },
        ],
    };

    return (
        <div className="container-fluid bg-light ">
            <div className="row">
                <div className="col-md-2">
                </div>


                <div className="col-md-10 mt-4">
                    <div className="d-flex mt-5">
                        <div className="flex-col-1 p-2">

                            {/* Bar Chart */}
                            <div className="card shadow p-3 h-100">
                                <div className="mb-3">
                                    <label className="form-label">Chọn năm:</label>
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2100"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    />
                                </div>

                                <div style={{ width: 400, height: 300 }}>
                                    <Bar
                                        data={revenueData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Biểu đồ doanh thu theo từng tháng trong năm', // Tiêu đề biểu đồ
                                                    font: {
                                                        size: 14,
                                                        weight: 'bold'
                                                    },
                                                    color: '#333'
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (context) {
                                                            const value = context.raw;
                                                            return `${value.toLocaleString()} $`; // Thêm "VNĐ" vào tooltip
                                                        }
                                                    }
                                                },
                                            },
                                            scales: {
                                                y: {
                                                    title: {
                                                        display: true,
                                                        text: 'Doanh thu'
                                                    },
                                                    beginAtZero: true
                                                },
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Tháng'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-col-1 p-2">

                            {/* Line chart */}
                            <div className="card shadow-lg p-3 h-100">
                                <div className="mb-3">
                                    <label for="form-label" >Chọn tháng:</label>
                                    <input type="text" id="monthSelector" />
                                </div>
                                <div style={{ width: 400, height: 300 }}>
                                    <Line
                                        data={{
                                            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Dữ liệu sẽ được cập nhật khi người dùng chọn tháng
                                            datasets: [{
                                                label: 'Doanh thu theo ngày',
                                                data: [0, 20, 10, 30, 15, 40, 20, 60, 60], // Dữ liệu doanh thu theo ngày
                                                borderColor: 'rgba(75, 192, 192, 1)',
                                                borderWidth: 1,
                                                fill: false
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Biểu đồ doah thu theo từng ngày trong tháng', // Tiêu đề biểu đồ
                                                    font: {
                                                        size: 14,
                                                        weight: 'bold'
                                                    },
                                                    color: '#333' // Màu tiêu đề
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function (context) {
                                                        const value = context.raw;
                                                        return `${value.toLocaleString()} $`; // Thêm "$" vào tooltip
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </div>
                            </div>


                        </div>
                        <div className="flex-col-3 p-2">
                            {/* Pie chart */}
                            <div className="card shadow p-3 h-100">
                                <div className="mb-3">
                                    <label className="form-label">Loại thống kê:</label>
                                    <select

                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="day">Ngày</option>
                                        <option value="month">Tháng</option>
                                        <option value="year">Năm</option>
                                    </select>
                                </div>
                                <div style={{ width: 300, height: 300 }}>
                                    <Pie
                                        data={orderStatusData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                title: {
                                                    display: true,  // Hiển thị tiêu đề
                                                    text: 'Thống kê trạng thái đơn hàng',  // Tiêu đề bạn muốn hiển thị
                                                    font: {
                                                        size: 14,  // Kích thước font của tiêu đề
                                                        weight: 'bold'  // Độ đậm của font
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex">
                        <div className="flex-col-1 w-100 my-5">
                            <div className="card shadow-lg p-3">

                                <div className="d-flex ">
                                    <h3 className="mb-3">Lượt truy cập mục sản phẩm</h3>
                                    <div className="ms-auto mb-0">
                                        <button className="btn btn-danger rounded-pill"> See all</button>
                                    </div>
                                </div>

                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Danh mục</th>
                                            <th scope="col">Số lượng truy cập</th>
                                            <th scope="col">Unique users</th>
                                            <th scope="col">Tỷ lệ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row" className="text-muted">/mobile</th>
                                            <td>4,569</td>
                                            <td>340</td>
                                            <td>
                                                <ArrowUpward className="text-success me-2" /> 46,53%
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="text-muted">/audio</th>
                                            <td>3,985</td>
                                            <td>319</td>
                                            <td>
                                                <ArrowDownward className="text-danger me-2" />
                                                46,53%
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="text-muted">/gaming</th>
                                            <td>3,513</td>
                                            <td>294</td>
                                            <td>
                                                <ArrowDownward className="text-danger me-2" />
                                                36,49%
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="text-muted">/laptop</th>
                                            <td>2,050</td>
                                            <td>147</td>
                                            <td>
                                                <ArrowUpward className=" text-success me-2" /> 50,87%
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="text-muted">/tv</th>
                                            <td>1,795</td>
                                            <td>190</td>
                                            <td>
                                                <ArrowDownward className="text-danger me-2" />
                                                46,53%
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="text-muted">/appliances</th>
                                            <td>1,395</td>
                                            <td>120</td>
                                            <td>
                                                <ArrowDownward className="text-danger me-2" />
                                                35,53%
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;
