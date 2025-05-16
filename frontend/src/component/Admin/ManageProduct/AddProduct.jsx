import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useContext, useEffect, useState } from 'react'
import { urlBE } from '../../../baseUrl';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider';

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }
    upload() {
        return this.loader.file.then(
            file =>
                new Promise((resolve, reject) => {
                    const data = new FormData();
                    data.append('file', file);

                    fetch(`${urlBE}/products/detail_image/upload`, {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token || ''}`
                        }
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (!res.url) return reject('No URL returned');
                            resolve({ default: res.url });
                        })
                        .catch(err => reject(err));
                })
        );
    }
    abort() { }
}
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

function AddProduct() {
    const { user } = useContext(AuthContext)

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        discount: '',
        brand: ''
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: value }));
    };

    const fetchCategory = async () => {
        try {
            const response = await fetch(`${urlBE}/categories`, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddProduct = async () => {
        setIsLoading(true);

        // Validate required fields
        if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        for (const image of images) {
            formData.append("file", image);
        }
        formData.append(
            "product",
            JSON.stringify({
                name: newProduct.name,
                description: newProduct.description,
                price: newProduct.price,
                discount: parseInt(newProduct.discount) || 0,
                brand: newProduct.brand,
                stockQuantity: parseInt(newProduct.stockQuantity) || 0,
                categoryId: newProduct.categoryId
            })
        );

        try {
            const response = await fetch(`${urlBE}/products`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert("Thêm sản phẩm thành công!");
                setNewProduct({
                    name: '',
                    description: '',
                    price: '',
                    stockQuantity: '',
                    categoryId: '',
                    discount: '',
                    brand: ''
                });
                setImages([]);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error("Lỗi API:", error);

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory()
    }, [])


    return (
        <div className="my-5 row justify-content-center">
            <div className="col-lg-8 col-md-10">
                <div className="card shadow">
                    <div className="card-header bg-success text-white">
                        <h3 className="mb-0">Chỉnh sửa sản phẩm</h3>
                    </div>

                    <div className="card-body">
                        <div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Tên <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    name='name'
                                    className="form-control"
                                    value={newProduct.name}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Mô tả sản phẩm</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={newProduct.description}
                                    config={{
                                        licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDg1NjMxOTksImp0aSI6IjAyNWQzYzhiLTg4NDEtNDNhYi05ZThhLTQ1ZWY4MjNmM2QxNyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImI4OGQ1MjM1In0.scN2OnfESxaUvv_KNfs8su4q_DVhJewuqQBgPxHaMP029xvh75WaXMoa4oGioaXkpxg2F_9-hlSsLmsFwKsA7A', // Or 'GPL'.
                                        extraPlugins: [MyCustomUploadAdapterPlugin],
                                        image: {
                                            resizeOptions: [
                                                { name: 'resizeImage:original', label: 'Original', value: null },
                                                { name: 'resizeImage:50', label: '50%', value: '50' },
                                                { name: 'resizeImage:75', label: '75%', value: '75' },
                                            ],
                                            toolbar: ['resizeImage', 'imageStyle:full', 'imageStyle:side'],
                                        },
                                    }}

                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setNewProduct(prev => ({ ...prev, description: data }));
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Giá <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text">₫</span>
                                    <input
                                        type="number"
                                        name='price'
                                        className="form-control"
                                        value={newProduct.price}
                                        onChange={(e) => handleInputChange(e)}
                                        required
                                        min="0"
                                        step="1000"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Giảm giá (%)</label>
                                <input
                                    type="number"
                                    name='discount'
                                    className="form-control"
                                    value={newProduct.discount}
                                    onChange={(e) => handleInputChange(e)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Hãng</label>
                                <input
                                    type="text"
                                    name='brand'
                                    className="form-control"
                                    value={newProduct.brand}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Số lượng trong kho</label>
                                <input
                                    type="number"
                                    name='stockQuantity'
                                    className="form-control"
                                    value={newProduct.stockQuantity}
                                    onChange={(e) => handleInputChange(e)}
                                    min="0"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Danh mục <span className="text-danger">*</span></label>
                                <select
                                    className="form-select"
                                    name="categoryId"
                                    value={newProduct.categoryId}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                >
                                    <option value="">-Chọn danh mục-</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Ảnh sản phẩm</label>
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
                                <div className="form-text">Bạn có thể chọn nhiều ảnh cùng lúc</div>
                                {/* Hiển thị nút xóa cho từng ảnh đã chọn */}
                                {images && images.length > 0 && (
                                    <div className="d-flex gap-2 flex-wrap mt-2">
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
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={isLoading}
                        >
                            Trở về
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                            onClick={() => handleAddProduct()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Thêm sản phẩm'
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddProduct