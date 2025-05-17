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

          fetch(`${urlBE}/products/detail_image/upload`, {
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

  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState(null)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState(null)

  const fetchProducts = async (order = null, pageNum = page, limitNum = limit, sortType = sortBy) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${urlBE}/products?page=${pageNum}&limit=${limitNum}&search=${search}`;
      if (order) {
        url += `&sortBy=${sortType}&order=${order}`;
      }
      console.log(url);

      const [productsRes, productCountRes] = await Promise.all([
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        fetch(`${urlBE}/products/count`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
      ]);
      if (!productsRes.ok || !productCountRes.ok) {
        throw new Error(`HTTP error! status: ${productsRes.status} ${productCountRes.status}`);
      }

      const productsData = await productsRes.json();
      const productCountData = await productCountRes.json();

      setProducts(productsData);
      setTotalCount(productCountData);

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
    fetchProducts(sortOrder, page, limit);
    fetchCategory();

  }, [sortOrder, page, limit, search, sortBy]);

  const handleSortByPrice = () => {
    setSortBy('price');
    setSortOrder(prev => (sortBy === 'price' && prev === 'desc' ? 'asc' : 'desc'));
  }
  const handleSortByStockQuantity = () => {
    setSortBy('stock_quantity');
    setSortOrder(prev => (sortBy === 'stock_quantity' && prev === 'desc' ? 'asc' : 'desc'));
  }
  const handleSortByDiscount = () => {
    setSortBy('discount');
    setSortOrder(prev => (sortBy === 'discount' && prev === 'desc' ? 'asc' : 'desc'));
  }
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };
  const totalPages = Math.ceil(totalCount / limit);


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

        </div>
        <div className='d-flex justify-content-between align-items-center gap-3'>
          <div>
            <span>Hiện</span>
            <input
              type="number"
              value={limit}
              min={10}
              onChange={handleLimitChange}
              step={10}
              style={{ width: 50, margin: '0 5px' }}
            />
          </div>
          <div className='d-flex gap-2 align-items-center'>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Tìm kiếm sản phẩm..'
              className=' rounded-2 '
              style={{ width: '500px' }}
            />
            <i className="bi bi-search"></i>
          </div>
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
            <div >
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className='scope'>STT</th>
                    <th className='scope'>Tên sản phẩm</th>
                    <th className='scope'>Ảnh</th>
                    <th className='scope' style={{ cursor: 'pointer' }} onClick={handleSortByPrice}>
                      Giá
                      {sortBy === 'price' ? (
                        sortOrder === 'desc' ? (
                          <i className="bi bi-caret-down-fill ms-1"></i>
                        ) : (
                          <i className="bi bi-caret-up-fill ms-1"></i>
                        )
                      ) : (
                        <i class="bi bi-chevron-expand ms-1"></i>
                      )}
                    </th>
                    <th className='scope'>Danh mục</th>
                    <th className='scope' style={{ cursor: 'pointer' }} onClick={handleSortByStockQuantity}>
                      Số lượng

                      {sortBy === 'stock_quantity' ? (
                        sortOrder === 'desc' ? (
                          <i className="bi bi-caret-down-fill ms-1"></i>
                        ) : (
                          <i className="bi bi-caret-up-fill ms-1"></i>
                        )
                      ) : (
                        <i class="bi bi-chevron-expand ms-1"></i>
                      )}
                    </th>

                    <th className='scope' style={{ cursor: 'pointer' }} onClick={handleSortByDiscount}>
                      Giảm giá
                      {sortBy === 'discount' ? (
                        sortOrder === 'desc' ? (
                          <i className="bi bi-caret-down-fill ms-1"></i>
                        ) : (
                          <i className="bi bi-caret-up-fill ms-1"></i>
                        )
                      ) : (
                        <i class="bi bi-chevron-expand ms-1"></i>
                      )}

                    </th>
                    <th className='scope' > Thao tác</th>
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
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-muted fst-italic">Hiển thị từ 1 - {limit} của {totalCount} sản phẩm</span>
                <div className='justify-content-center d-flex gap-2 ms-auto'>
                  <button className="btn btn-sm btn-outline-primary" onClick={handlePrevPage} disabled={page === 1}>
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <span>Trang <input value={page} onChange={(e) => setPage(e.target.value)} style={{ width: 30 }} /> / {totalPages}</span>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleNextPage}
                    disabled={products.length < limit}
                  >
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default ManageProducts