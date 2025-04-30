import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthProvider'

function ManageCategories() {
    const [categories, setCategories] = useState([])
    const [editCate, setEditCate] = useState('')
    const [newCate, setNewCate] = useState('')


    const fetchCategory = async () => {
        try {
            const response = await fetch("http://localhost:8080/categories", {
                method: "GET"
            })
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            console.log("Lỗi APi: ", error)
        }
    }
    const handleAddCate = async () => {
        try {
            const response = await fetch("http://localhost:8080/categories", {
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
        }
    }

    const handleDeleteCate = async (catogoryId) => {
        if (window.confirm("Bạn chắc chắn muốn xóa danh mục này")) {
            try {
                const response = await fetch(`http://localhost:8080/categories/${catogoryId}`, {
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
            const response = await fetch(`http://localhost:8080/categories/${catogoryId}`, {
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


        <div className=" container">
            <div className="mt-3">
                <h1>Quản lý danh mục</h1>
                <button type='button' className='btn btn-success ms-auto me-5' data-bs-toggle="modal" data-bs-target="#modalAddCate">Thêm danh mục mới</button>
                <p className='mt-3'>Tổng danh mục: {categories.length}</p>
                <div className='modal fade' id='modalAddCate' tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Thêm Người Dùng</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Tên danh mục</label>
                                    <input type="text" className="form-control" value={newCate} onChange={e => setNewCate(e.target.value)} />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={() => handleAddCate()} data-bs-dismiss="modal">Thêm</button>
                            </div>

                        </div>
                    </div>
                </div>
                <table className='table table-bordered align-middle table-hover mb-0'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Id</th>
                            <th>Tên Danh mục</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length ? categories.map((category, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <button className='btn btn-sm btn-primary ms-1' onClick={() => handleUpdateCate(category.id)} modal-bs-target>Sửa</button>

                                    <button className='btn btn-sm btn-danger ms-1' onClick={() => handleDeleteCate(category.id)}>Xóa </button>


                                </td>
                            </tr>
                        )) : (
                            <td>Bạn không có danh mục nào</td>
                        )}
                    </tbody>
                </table>
            </div>
        </div>


    )
}

export default ManageCategories