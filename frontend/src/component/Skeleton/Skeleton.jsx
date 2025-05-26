import React from 'react'
import './Skeleton.css'
function Skeleton() {
    return (
        <div className="card h-100 shadow rounded-4 p-2 d-flex justify-content-between" >
            {/* Ảnh */}
            <div className="text-center h-100" style={{ minHeight: '150px' }}>
                <div className="bg-secondary bg-opacity-25 rounded-3 mx-auto" style={{ width: 100, height: 100, }}></div>
            </div>

            {/* Thông tin */}
            <div className="mt-2 px-2 py-3 h-100">
                <h6 className="fw-semibold flex-wrap" >
                    <div className="bg-secondary bg-opacity-25 rounded-2 mb-2" style={{ width: '80%', height: 18, }}></div>
                </h6>
                <div>
                    <div className="bg-secondary bg-opacity-25 rounded-2" style={{ width: '60%', height: 14, }}></div>
                </div>
            </div>

            <div className="mb-3">
                <div className="d-flex align-items-center text-success small mb-1">
                    <div className="bg-secondary bg-opacity-25 rounded-2" style={{ width: 40, height: 12, }}></div>
                </div>
                <div className="d-flex align-items-center text-info small">
                    <div className="bg-secondary bg-opacity-25 rounded-2" style={{ width: 30, height: 12, }}></div>
                </div>
            </div>

            {/* Đánh giá và yêu thích */}
            <div className="px-2 py-2 d-flex justify-content-between align-items-center mt-auto border-top">
                <div className="d-flex">
                    <div className="bg-secondary bg-opacity-25 rounded-circle me-2" style={{ width: 20, height: 20, }}></div>
                    <div className="bg-secondary bg-opacity-25 rounded-circle" style={{ width: 20, height: 20, }}></div>
                </div>
                <div className="text-muted small d-flex align-items-center">
                    <div className="bg-secondary bg-opacity-25 rounded-2" style={{ width: 30, height: 12, }}></div>
                </div>
            </div>


        </div>
    )
}

export default Skeleton