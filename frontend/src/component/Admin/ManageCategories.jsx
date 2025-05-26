import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthProvider'
import { urlBE } from '../../baseUrl'
import { Loading } from '../Loading'

function ManageCategories() {
    const [categories, setCategories] = useState([])
    const [editCate, setEditCate] = useState('')
    const [newCate, setNewCate] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const fetchCategory = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${urlBE}/categories`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.log("Lỗi APi: ", error)
        } finally {
            setIsLoading(false)
        }
    }
    const handleAddCate = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${urlBE}/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newCate,
                })
            })
            if (response.ok) {
                alert("Thêm thành công danh mục")
                fetchCategory()
                setNewCate('')
            }
            else {
                alert("Thêm danh mục thất bại")
            }
        } catch (error) {
            console.log("Lỗi APi: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteCate = async (catogoryId) => {
        if (window.confirm("Bạn chắc chắn muốn xóa danh mục này")) {
            try {
                const response = await fetch(`${urlBE}/categories/${catogoryId}`, {
                    method: "DELETE",

                })
                if (response.ok) {
                    alert("Xóa thành công danh mục")
                    fetchCategory()
                }
                else {
                    alert("Xóa danh mục thất bại")
                }
            } catch (error) {

                console.log("Lỗi APi: ", error)
            }
        }
    }

    const handleUpdateCate = async (catogoryId) => {
        try {
            const response = await fetch(`${urlBE}/categories/${catogoryId}`, {
                method: "PUT",

            })
            if (response.ok) {
                alert("Sửa thành công")
                fetchCategory()
            }
            else {
                alert("Sửa danh mục thất bại")
            }
        } catch (error) {
            alert("Lỗi kết nối server")
            console.log("Lỗi APi: ", error)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])
    return (


        <div className="container my-5">
            <h1>Quản lý danh mục</h1>
            <button type='button' className='btn btn-success ms-auto me-5' data-bs-toggle="modal" data-bs-target="#modalAddCate">Thêm danh mục mới</button>
            <p className='mt-3'>Tổng danh mục: {categories.length}</p>
            <div className='modal fade' id='modalAddCate' tabIndex={-1}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                            <h4 className="modal-title">Thêm Danh Mục</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Tên danh mục</label>
                                <input type="text" className="form-control" value={newCate} onChange={e => setNewCate(e.target.value)} />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={() => handleAddCate()} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Thêm'
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="card shadow p-3 mt-3">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div>
                        <table className='table align-middle'>
                            <thead className='table-light'>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên Danh mục</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length ? categories.map((category, index) => (
                                    <tr>
                                        <td>{index + 1}</td>

                                        <td>{category.name}</td>
                                        <td>
                                            <button className='btn btn-sm btn-primary ms-1' data-bs-target="#modalUpdateCate" data-bs-toggle="modal">Sửa</button>
                                            <div className='modal fade' id='modalUpdateCate' tabIndex={-1}>
                                                <div className="modal-dialog modal-dialog-scrollable">
                                                    <div className="modal-content">
                                                        <div className="modal-header bg-primary text-white">
                                                            <h4 className="modal-title">Sửa danh mục</h4>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                        </div>

                                                        <div className="modal-body">
                                                            <div className="form-group">
                                                                <label>Tên danh mục</label>
                                                                <input type="text" className="form-control" value={newCate} onChange={e => setNewCate(e.target.value)} />
                                                            </div>
                                                        </div>

                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-primary" onClick={() => handleUpdateCate(category.id)} data-bs-dismiss="modal">Sửa</button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <button className='btn btn-sm btn-danger ms-1' onClick={() => handleDeleteCate(category.id)}>Xóa </button>


                                        </td>
                                    </tr>
                                )) : (
                                    <td>Bạn không có danh mục nào</td>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>

    )
}

export default ManageCategories