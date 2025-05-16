import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlBE } from '../../../baseUrl';
import { AuthContext } from '../../AuthProvider';

// Custom upload adapter class
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

function EditProduct() {
    const { user } = useContext(AuthContext)
    console.log(user.token);

    const { productId } = useParams();
    const navigate = useNavigate();

    const [editProduct, setEditProduct] = useState({
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
    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    // Fetch product detail
    const fetchProduct = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${urlBE}/products/${productId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProduct(data);
            setEditProduct({
                name: data.name || '',
                description: data.description || '',
                price: data.price || '',
                stockQuantity: data.stockQuantity || '',
                categoryId: data.categoryId || '',
                discount: data.discount || '',
                brand: data.brand || ''
            });
        } catch (error) {
            console.log("Lỗi api", error);

        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${urlBE}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        // eslint-disable-next-line
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleEditChange = async (productId) => {
        setIsLoading(true);
        const formData = new FormData();
        for (const image of images) {
            formData.append("file", image);
        }
        formData.append(
            "product",
            JSON.stringify({
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price,
                discount: parseInt(editProduct.discount) || 0,
                brand: editProduct.brand,
                stockQuantity: parseInt(editProduct.stockQuantity) || 0,
                categoryId: editProduct.categoryId
            })
        )
        try {
            const response = await fetch(`${urlBE}/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${user.token}`
                },
                body: formData,
            });
            if (response.ok) {
                alert("Cập nhật sản phẩm thành công!");
                fetchProduct()
                navigate('/admin/products')
            } else {
                alert("Lỗi khi cập nhật sản phẩm");
            }
        } catch (error) {
            console.error("Lỗi API:", error);

        } finally {
            setIsLoading(false);
        }
    };


    return (

        <div className="my-5 row justify-content-center">
            <div className="col-lg-8 col-md-10">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white">
                        <h3 className="mb-0">Chỉnh sửa sản phẩm</h3>
                    </div>

                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Tên sản phẩm</label>
                            <input
                                type="text"
                                name='name'
                                value={editProduct.name}
                                className="form-control"
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Mô tả</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editProduct.description}
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
                                    setEditProduct(prev => ({ ...prev, description: data }));
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Giá</label>
                            <div className="input-group">
                                <span className="input-group-text">₫</span>
                                <input
                                    type="number"
                                    name='price'
                                    value={editProduct.price}
                                    className="form-control"
                                    onChange={(e) => handleInputChange(e)}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Số lượng sản phẩm</label>
                            <input
                                type="number"
                                name='stockQuantity'
                                value={editProduct.stockQuantity}
                                className="form-control"
                                onChange={(e) => handleInputChange(e)}
                                min="0"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Danh mục</label>
                            <select
                                className="form-select"
                                name="categoryId"
                                value={editProduct.categoryId}
                                onChange={(e) => handleInputChange(e)}
                            >
                                <option value="">-Chọn danh mục-</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Giảm giá (%)</label>
                            <input
                                type="number"
                                name='discount'
                                value={editProduct.discount}
                                className="form-control"
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
                                value={editProduct.brand}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
                            <div>
                                <div className="d-flex gap-1">
                                    {product.listMedia && product.listMedia.length > 0 ? (
                                        product.listMedia.map((media, idx) => (
                                            <img
                                                key={idx}
                                                src={media}
                                                alt={`${product.name} - ảnh ${idx + 1}`}
                                                className="rounded my-3"
                                                width={150}
                                                height={150}
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ))
                                    ) : (
                                        <div className="bg-light rounded d-flex align-items-center justify-content-center my-3" style={{ width: 150, height: 150 }}>
                                            <i className="bi bi-image text-muted"></i>
                                        </div>
                                    )}
                                </div>
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
                            className="btn btn-primary"
                            onClick={() => handleEditChange(productId)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                'Cập nhật'
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default EditProduct;