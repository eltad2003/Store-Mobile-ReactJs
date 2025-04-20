import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthContext } from '../AuthProvider';

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
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const [newProduct, setNewProduct] = useState(initialProductState);
  const [editProduct, setEditProduct] = useState(initialProductState);

  const handleEditClick = (productId) => {
    const productToEdit = products.find(product => product.id === productId);
    if (productToEdit) {
      setEditProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        discount: productToEdit.discount,
        categoryId: productToEdit.category || "",
        brand: productToEdit.brand,
        stockQuantity: productToEdit.stockQuantity,
      });
    }
  };

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

  const handleEditChange = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(editProduct),
      });
      if (response.ok) {
        alert("Cập nhật sản phẩm thành công!");
        fetchProducts();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      setError('Failed to update product. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await fetch("http://localhost:8080/products", {
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
    if (isEdit) {
      setEditProduct(prev => ({ ...prev, [name]: value }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className='row'>
      <div className="col-md-2"></div>
      <div className="col-md-10 mt-3">
        <div className="container p-3 mt-3">
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
                      <textarea
                        name='description'
                        className="form-control"
                        rows="3"
                        value={newProduct.description}
                        onChange={handleInputChange}
                      ></textarea>
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
          <div className="card p-3 shadow mt-3 me-5">
            {isLoading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className='scope'>STT</th>
                      <th className='scope'>ID</th>
                      <th className='scope'>Tên sản phẩm</th>
                      <th className='scope'>Ảnh</th>
                      <th className='scope'>Giá</th>
                      <th className='scope'>Danh mục</th>
                      <th className='scope'>Số lượng</th>
                      <th className='scope'>Mô tả</th>
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
                          <th>{index + 1}</th>
                          <th>{product.id}</th>
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
                          <td className='text-truncate' style={{ maxWidth: 250 }}>{product.description}</td>
                          <td className='fw-semibold text-success'>{product.discount ? `${product.discount}%` : ""}</td>
                          <td>
                            <div className="d-flex gap-1">
                              {/* Edit Product Button */}
                              <button
                                className='btn btn-sm btn-primary'
                                data-bs-toggle="modal"
                                data-bs-target={`#modalEdit-${product.id}`}
                                onClick={() => handleEditClick(product.id)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>

                              {/* Edit Product Modal */}
                              <div className="modal" id={`modalEdit-${product.id}`}>
                                <div className="modal-dialog modal-dialog-scrollable">
                                  <div className="modal-content">
                                    <div className="modal-header bg-primary text-white">
                                      <h4 className="modal-title">Sửa Thông Tin Sản Phẩm</h4>
                                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="mb-3">
                                        <label className="form-label fw-bold">Tên sản phẩm</label>
                                        <input
                                          type="text"
                                          name='name'
                                          value={editProduct.name}
                                          className="form-control"
                                          onChange={(e) => handleInputChange(e, true)}
                                        />
                                      </div>
                                      <div className="mb-3">
                                        <label className="form-label fw-bold">Mô tả</label>
                                        <textarea
                                          name='description'
                                          value={editProduct.description}
                                          className="form-control"
                                          rows="3"
                                          onChange={(e) => handleInputChange(e, true)}
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
                                            onChange={(e) => handleInputChange(e, true)}
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
                                          onChange={(e) => handleInputChange(e, true)}
                                          min="0"
                                        />
                                      </div>
                                      <div className="mb-3">
                                        <label className="form-label fw-bold">Danh mục</label>
                                        <select
                                          className="form-select"
                                          name="categoryId"
                                          value={editProduct.categoryId}
                                          onChange={(e) => handleInputChange(e, true)}
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
                                          onChange={(e) => handleInputChange(e, true)}
                                          min="0"
                                          max="100"
                                        />
                                      </div>
                                      <div className="mb-3">
                                        <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
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
                                        className="btn btn-primary"
                                        onClick={() => handleEditChange(product.id)}
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

                              {/* Delete Product Button */}
                              <button
                                className='btn btn-sm btn-danger'
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={isLoading}
                              >
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
    </div>
  )
}

export default ManageProducts