import React from 'react'

function Loading() {
    return (
        <div className='text-center mt-5'>
            <span className='spinner-border text-danger me-1'></span>
            <p className='mt-2'> Đang tải dữ liệu...</p>
        </div>
    )
}


function LoadingButton() {
    return (
        <div className='d-flex align-items-center justify-content-center'>
            <span className='spinner-border spinner-border-sm text-danger me-1'></span>
            Đang xử lí...
        </div>
    )
}

export { Loading, LoadingButton }