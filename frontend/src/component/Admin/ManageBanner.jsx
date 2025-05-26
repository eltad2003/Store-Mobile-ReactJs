import React, { useContext, useEffect, useState } from 'react'
import { urlBE } from '../../baseUrl'
import { AuthContext } from '../AuthProvider'
import { Loading } from '../Loading'


function ManageBanner() {
    const { user } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)
    const [banners, setBanners] = useState([])
    const [images, setImages] = useState([])

    const [newBanner, setNewBanner] = useState({
        title: '',
        link: '',
        isActive: false
    })
    const [editBanner, setEditBanner] = useState({
        title: '',
        link: '',
        isActive: false
    })


    const fetchBaners = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${urlBE}/admin/banners`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setBanners(data)
            }
            else {
                throw new Error('Failed to fetch banners')
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddBanner = async () => {
        setIsLoading(true)
        const formData = new FormData()
        for (const image of images) {
            formData.append('file', image)
        }

        formData.append(
            'banner',
            JSON.stringify({
                title: newBanner.title,
                link: newBanner.link,
                isActive: newBanner.isActive
            })
        )

        try {
            const res = await fetch(`${urlBE}/admin/banners`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            })
            if (res.ok) {
                alert('Thêm banner thành công')
                fetchBaners()
                setNewBanner({
                    title: '',
                    link: '',
                    isActive: false
                })
                setImages([]);

            }
            else {
                alert('Thêm banner thất bại')
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setIsLoading(false)
        }
    }
    const handleEditBanner = async (id) => {
        setIsLoading(true)
        const formData = new FormData()
        for (const image of images) {
            formData.append('file', image)
        }
        formData.append(
            'banner',
            JSON.stringify({
                title: editBanner.title,
                link: editBanner.link,
                isActive: editBanner.isActive
            })
        )

        try {
            const res = await fetch(`${urlBE}/admin/banners/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            })
            if (res.ok) {
                alert('Sửa banner thành công')
                fetchBaners()
                setEditBanner({
                    title: '',
                    link: '',
                    isActive: false
                })
            }
            else {
                alert('Sửa banner thất bại')
                throw new Error('Failed to edit banner')
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setIsLoading(false)
        }
    }
    const handleDeleteBanner = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa banner này không?')) {
            setIsLoading(true)
            try {
                const res = await fetch(`${urlBE}/admin/banners/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                if (res.ok) {
                    alert('Xóa banner thành công')
                    fetchBaners()
                }
                else {
                    alert('Xóa banner thất bại')
                }
            } catch (error) {
                console.error('Error fetching banners:', error);
            } finally {
                setIsLoading(false)
            }
        }

    }
    const handleChangeActive = async (id, changeIsActive) => {
        setIsLoading(true)
        try {
            const res = await fetch(`${urlBE}/admin/banners/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ isActive: changeIsActive })
            })
            if (res.ok) {
                alert('Cập nhật trạng thái hiển thị thành công')
                fetchBaners()
            }
            else {
                alert('Cập nhật trạng thái hiển thị thất bại')
            }
        } catch (error) {
            console.log('Lỗi server', error);

        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchBaners()
    }, [])

    const modalAddBanner = () => {
        return (
            <div className='modal fade' id='addBanner'>
                <div className="modal-dialog">
                    <div className='modal-content'>
                        <div className='modal-header bg-success text-white'>
                            <h5 className='modal-title'>Thêm banner quảng cáo</h5>
                            <button type="button" className='btn-close' data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="title" className='form-label'>Tiêu đề</label>
                                <input type="text" className='form-control' id='title' value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imageUrl" className='form-label'>Hình ảnh</label>
                                <input
                                    type="file"
                                    onChange={e => {
                                        const files = Array.from(e.target.files);
                                        setImages(prev => [...prev, ...files]);
                                    }}
                                    multiple
                                    className="form-control"
                                    accept="image/*"
                                />
                            </div>
                            <div className="mb-3">
                                {images.map((file, idx) => (
                                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            style={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                borderRadius: '50%',
                                                padding: '2px 6px',
                                                fontSize: 12,
                                                lineHeight: 1,
                                            }}
                                            onClick={() => {
                                                setImages(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                            title="Xóa ảnh này"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="link" className='form-label'>Đường dẫn</label>
                                <input type="text" className='form-control' id='link' value={newBanner.link} onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })} />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className='form-check-input' id='isActive' checked={newBanner.isActive} onChange={(e) => setNewBanner({ ...newBanner, isActive: e.target.checked })} />
                                <label htmlFor="isActive" className='form-check-label'>Hiển thị banner cho website</label>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type="button" className='btn btn-secondary' data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className='btn btn-success' onClick={handleAddBanner} data-bs-dismiss="modal">Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const modalEditBanner = () => {
        return (
            <div className='modal fade' id='editBanner'>
                <div className="modal-dialog">
                    <div className='modal-content'>
                        <div className='modal-header bg-primary text-white'>
                            <h5 className='modal-title'>Chỉnh sửa banner quảng cáo</h5>
                            <button type="button" className='btn-close' data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="title" className='form-label'>Tiêu đề</label>
                                <input type="text" className='form-control' value={editBanner.title} onChange={(e) => setEditBanner({ ...editBanner, title: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imageUrl" className='form-label'>Hình ảnh</label>

                                <div className='text-center'>
                                    <img
                                        src={editBanner.imageUrl}
                                        alt='Banner'
                                        className="rounded my-3"
                                        width={150}
                                        height={150}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <input
                                    type="file"
                                    onChange={e => {
                                        const files = Array.from(e.target.files);
                                        setImages(prev => [...prev, ...files]);
                                    }}
                                    multiple
                                    className="form-control"
                                    accept="image/*"
                                />
                            </div>
                            <div className="mb-3">
                                {images.map((file, idx) => (
                                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            style={{
                                                position: 'absolute',
                                                top: 2,
                                                right: 2,
                                                borderRadius: '50%',
                                                padding: '2px 6px',
                                                fontSize: 12,
                                                lineHeight: 1,
                                            }}
                                            onClick={() => {
                                                setImages(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                            title="Xóa ảnh này"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="link" className='form-label'>Đường dẫn</label>
                                <input type="text" className='form-control' value={editBanner.link} onChange={(e) => setEditBanner({ ...editBanner, link: e.target.value })} />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className='form-check-input' checked={editBanner.isActive} onChange={(e) => setEditBanner({ ...editBanner, isActive: e.target.checked })} />
                                <label htmlFor="isActive" className='form-check-label'>Hiển thị banner cho website</label>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type="button" className='btn btn-secondary' data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className='btn btn-primary' onClick={() => handleEditBanner(editBanner.id)} data-bs-dismiss="modal">Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='container'>
            <div className="my-5">
                <div className='d-flex align-items-center justify-content-between'>
                    <h3 className='fw-bold mb-3'>Quản Lý Banner</h3>
                    <button className='btn btn-success ms-auto' data-bs-toggle="modal" data-bs-target="#addBanner" >
                        <i className='bi bi-plus-circle'> Thêm banner</i>
                    </button>
                </div>
                {modalAddBanner()}
                <div className="card shadow p-3 mt-3">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <table className='table align-middle mb-0'>
                            <thead className='table-light'>
                                <tr>
                                    <th className='scope text-nowrap'>STT</th>
                                    <th className='scope text-nowrap'>Hình ảnh</th>
                                    <th className='scope text-nowrap'>Tiêu đề</th>
                                    <th className='scope text-nowrap'>Đường dẫn</th>
                                    <th className='scope text-nowrap'>Trạng thái</th>
                                    <th className='scope text-nowrap'>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {banners.length === 0 ? (
                                    <tr>
                                        <td>Chưa có bannner quảng cáo nào</td>
                                    </tr>
                                ) : (
                                    banners.map((banner, index) => (
                                        <tr key={banner.id}>
                                            <td className=''>{index + 1}</td>
                                            <td className=''>
                                                <img src={banner.imageUrl} alt="Banner" className='img-fluid' width={200} height={200} />
                                            </td>
                                            <td className=''>{banner.title}</td>
                                            <td className=''>
                                                <a href={banner.link}>{banner.link}</a>
                                            </td>
                                            <td className='text-nowrap'>
                                                <select
                                                    className={`form-select ${banner.isActive ? 'text-success' : 'text-danger'} `}
                                                    value={banner.isActive ? "true" : "false"}
                                                    onChange={(e) => handleChangeActive(banner.id, (e.target.value === 'true'))}

                                                >
                                                    <option value='true' style={{ color: 'black' }}>Đang hiển thị</option>
                                                    <option value='false' style={{ color: 'black' }}>Không hiển thị</option>
                                                </select>
                                            </td>
                                            <td >
                                                <div className='d-flex justify-content-center align-items-center gap-2'>
                                                    <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#editBanner"
                                                        onClick={() => setEditBanner({
                                                            id: banner.id, // thêm id để biết đang sửa banner nào
                                                            title: banner.title,
                                                            imageUrl: banner.imageUrl,
                                                            link: banner.link,
                                                            isActive: banner.isActive
                                                        })}>
                                                        <i className='bi bi-pencil'></i>
                                                    </button>
                                                    <button className='btn btn-danger' onClick={() => handleDeleteBanner(banner.id)}>
                                                        <i className='bi bi-trash'></i>
                                                    </button>
                                                </div>
                                                {modalEditBanner()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    )}
                </div>

            </div>
        </div>
    )
}

export default ManageBanner