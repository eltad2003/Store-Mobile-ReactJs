import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthContext } from '../../AuthProvider';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link } from 'react-router-dom';
import { urlBE } from '../../../baseUrl';
import formatPrice from '../../../formatPrice';


// Custom upload adapter class
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  // Bắt đầu upload
  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          const data = new FormData();
          data.append('file', file);

          fetch('http://localhost:8080/products/detail_image/upload', {
            method: 'POST',
            body: data,
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
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

  abort() {
    // Hủy upload nếu cần
  }
}

// Plugin để gắn upload adapter
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

function ManageProducts() {
  const { user } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const initialProductState = {
    name: "",
    description: "",
    price: "",
    discount: "",
    categoryId: "",
    brand: "",
    stockQuantity: "",
  };


  const [newProduct, setNewProduct] = useState(initialProductState);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/products', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch('http://localhost:8080/categories', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategory();

  }, []);



  const handleAddProduct = async () => {
    setIsLoading(true);
    setError(null);

    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.categoryId) {
      setError('Please fill in all required fields (name, price, category)');
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
        fetchProducts();
        setNewProduct(initialProductState);
        setImages([]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      setError('Failed to add product. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });

        if (response.ok) {
          alert("Xóa sản phẩm thành công!");
          fetchProducts();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Lỗi API:", error);
        setError('Failed to delete product. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));

  };

  return (
    <div className='container'>

      <div className="my-5">
        <div className='d-flex align-items-center mb-4'>
          <h3 className='fw-bold mb-0'>Quản lý Sản Phẩm</h3>
          <button
            type='button'
            className='btn btn-success ms-auto me-5'
            data-bs-toggle="modal"
            data-bs-target="#modalAddProduct"
          >
            <i className="bi bi-plus-circle me-1"></i> Thêm sản phẩm mới
          </button>
        </div>
        <div className="card shadow p-3 mt-3">


          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {/* Add Product Modal */}
          <div className='modal fade' id='modalAddProduct' tabIndex={-1}>
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h4 className="modal-title">Thêm Sản Phẩm mới</h4>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>

                <div className="modal-body">
                  <div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Tên <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name='name'
                        className="form-control"
                        value={newProduct.name}
                        onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Số lượng trong kho</label>
                      <input
                        type="number"
                        name='stockQuantity'
                        className="form-control"
                        value={newProduct.stockQuantity}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Danh mục <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="categoryId"
                        value={newProduct.categoryId}
                        onChange={handleInputChange}
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
                        onChange={(e) => setImages(Array.from(e.target.files))}
                        multiple
                        className="form-control"
                        accept="image/*"
                      />
                      <div className="form-text">Bạn có thể chọn nhiều ảnh cùng lúc</div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleAddProduct}
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

          {/* Products Table */}

          {isLoading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className=" overflow-auto" style={{ maxHeight: '100vh ' }}>
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className='scope'>STT</th>
                    <th className='scope'>Tên sản phẩm</th>
                    <th className='scope'>Ảnh</th>
                    <th className='scope'>Giá</th>
                    <th className='scope'>Danh mục</th>
                    <th className='scope'>Số lượng</th>

                    <th className='scope'>Giảm giá</th>
                    <th className='scope'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        <p className="mb-0">Không có sản phẩm nào</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td className='text-truncate' style={{ maxWidth: 250 }}>{product.name}</td>
                        <td>
                          <div className="d-flex gap-1">
                            {product.listMedia && product.listMedia.length > 0 ? (
                              product.listMedia.map((media, idx) => (
                                <img
                                  key={idx}
                                  src={media}
                                  alt={`${product.name} - ảnh ${idx + 1}`}
                                  className="rounded"
                                  width={50}
                                  height={50}
                                  style={{ objectFit: 'cover' }}
                                />
                              ))
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                                <i className="bi bi-image text-muted"></i>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='fw-semibold text-danger'>{formatPrice(product.price)}</td>
                        <td>{product.category}</td>
                        <td>{product.stockQuantity}</td>

                        <td className='fw-semibold text-success'>{product.discount ? `${product.discount}%` : ""}</td>
                        <td>
                          <div className="d-flex gap-1">
                            {/* Edit Product Button */}
                            <Link
                              className='btn btn-sm btn-primary'
                              to={`edit/${product.id}`}
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>

                            {/* Delete Product Button */}
                            <button className='btn btn-sm btn-danger' onClick={() => handleDeleteProduct(product.id)} disabled={isLoading}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default ManageProducts