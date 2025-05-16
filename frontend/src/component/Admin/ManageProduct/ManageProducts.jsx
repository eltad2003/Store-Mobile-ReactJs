import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthContext } from '../../AuthProvider';
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
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchProducts = async (order = sortOrder) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${urlBE}/products?page=1&sortBy=price&order=${order}`, {
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
      setError('Failed to load categories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategory();

  }, [sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  }


  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${urlBE}/products/${productId}`, {
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



  return (
    <div className='container'>

      <div className="my-5">
        <div className='d-flex align-items-center mb-4'>
          <h3 className='fw-bold mb-0'>Quản lý Sản Phẩm</h3>
          <Link className='btn btn-sm btn-success ms-auto' to={'add'}>
            <i className="bi bi-plus-circle"></i> Thêm sản phẩm
          </Link>
        </div>
        <div className="card shadow p-3 mt-3">
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
                    <th className='scope' style={{ cursor: 'pointer' }} onClick={handleSortChange}>
                      Giá
                      {sortOrder === 'desc' ? (
                        <i className="bi bi-caret-down-fill ms-1"></i>
                      ) : (
                        <i className="bi bi-caret-up-fill ms-1"></i>
                      )}
                    </th>
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
                            <Link className='btn btn-sm btn-primary' to={`edit/${product.id}`}>
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