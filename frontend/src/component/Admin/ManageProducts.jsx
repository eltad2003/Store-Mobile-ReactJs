import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function ManageProducts() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.in/api/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    brand: "",
    color: "",
    model: "",
  })
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };
  const handleEditChange = (e) => {

  }

  const handleAddProduct = async () => {
    try {
      const response = await fetch("https://fakestoreapi.in/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        alert("Thêm sản phẩm thành công!");
      } else {
        alert("Lỗi khi thêm sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  return (
    <div className='row'>
      <div className="col-md-2"></div>
      <div className="col-md-10 mt-3">
        <div className="container p-3 mt-3">
          <div className='d-flex'>
            <h3 className='fw-bold'>Quản lý Sản Phẩm </h3>
            <button type='button' className='btn btn-success ms-auto me-5' data-bs-toggle="modal" data-bs-target="#modalAddProduct">Thêm sản phẩm mới</button>
            {/* Thêm sản phẩm */}
            <div className='modal fade' id='modalAddProduct' tabIndex={-1}>
              <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Thêm Sản Phẩm mới</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>

                  <div className="modal-body">
                    <div>
                      <div class="mb-3">
                        <label className="form-label">Tên</label>
                        <input type="text" name='title' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Mô tả sản phẩm</label>
                        <input type="text" name='description' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Giá</label>
                        <input type="number" name='price' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Màu</label>
                        <input type="text" name='color' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Hãng</label>
                        <input type="text" name='brand' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Model</label>
                        <input type="text" name='model' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Giảm giá</label>
                        <input type="number" name='discount' className="form-control" onChange={handleChange} />
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Danh mục</label>
                        <select class="form-select" name="category" onChange={handleChange} >
                          <option selected>---Vui lòng chọn danh mục---</option>
                          <option value="mobile" >Điện thoại</option>
                          <option value="laptop">Laptop</option>
                          <option value="gaming">Tay Cầm</option>
                          <option value="appliances">Linh kiện khác</option>
                          <option value="tv">TV</option>
                          <option value="audio">Loa, tai nghe</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label className="form-label">Ảnh</label>
                        <input type="file"
                          name='image'
                          accept='image/*'
                          className="form-control"
                          onChange={(e) => {
                            handleEditChange(e);
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                const preview = document.getElementById(`preview-product-img`);
                                preview.src = e.target.result;
                                preview.style.display = 'block';
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                        <div className="mt-2">
                          <img
                            id={'preview-product-img'}
                            src=""
                            alt="Preview"
                            className="border rounded"
                            width={100}
                            height={100}
                            style={{ objectFit: 'contain', display: 'none' }}
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={handleAddProduct} data-bs-dismiss="modal">Thêm</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* Quản lý sản phẩm */}
          <div className="card p-3 shadow mt-3 me-5">
            <table className="table">
              <thead>
                <tr>
                  <th className='scope'>STT</th>
                  <th className='scope'>Tên sản phẩm</th>
                  <th className='scope'>Hình ảnh</th>
                  <th className='scope'>Giá</th>
                  <th className='scope'>Giảm giá</th>
                  <th className='scope'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <th>{product.id}</th>
                    <td className='text-truncate' style={{ maxWidth: 250 }}>{product.title}</td>
                    <td><img src={product.image} alt="" width={50} height={50} /></td>
                    <td className='fw-semibold text-danger'>${product.price} </td>
                    <td className='fw-semibold text-success'>{product.discount ? `${product.discount}%` : ""}</td>
                    <td>
                      <button className='btn btn-sm btn-primary' data-bs-toggle="modal" data-bs-target={`#modalEdit-${product.id}`}>Sửa</button>

                      <div className="modal" id={`modalEdit-${product.id}`}>
                        <div className="modal-dialog modal-dialog-scrollable">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h4 className="modal-title">Sửa Thông Tin Sản Phẩm</h4>
                              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                              <div className="mb-2">
                                <label className="form-label fw-bold">Tên sản phẩm</label>
                                <input type="text" name='title' defaultValue={product.title} className="form-control" onChange={handleEditChange} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Mô tả</label>
                                <input type="text" name='description' defaultValue={product.description} className="form-control" onChange={handleEditChange} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Giá</label>
                                <input type="number" name='price' defaultValue={product.price} className="form-control" onChange={handleEditChange} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Màu sắc</label>
                                <input type="text" name='color' defaultValue={product.color} className="form-control" onChange={handleEditChange} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Model</label>
                                <input type="text" name='model' defaultValue={product.model} className="form-control" onChange={handleEditChange} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Giảm giá (%)</label>
                                <input type="number" name='discount' defaultValue={product.discount} className="form-control" onChange={handleEditChange} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
                                <div className="d-flex align-items-center gap-3 mb-2">
                                  <img src={product.image} alt="" className="border rounded" width={100} height={100} style={{ objectFit: 'contain' }} />
                                </div>
                                <input
                                  type="file"
                                  name='image'
                                  accept='image/*'
                                  className="form-control"
                                  onChange={(e) => {
                                    handleEditChange(e);
                                    const file = e.target.files[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        const preview = document.getElementById(`preview-${product.id}`);
                                        preview.src = e.target.result;
                                        preview.style.display = 'block';
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <div className="mt-2">
                                  <img
                                    id={`preview-${product.id}`}
                                    src=""
                                    alt="Preview"
                                    className="border rounded"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'contain', display: 'none' }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cập nhật</button>
                            </div>

                          </div>
                        </div>
                      </div>
                      <button className='btn btn-sm btn-danger ms-1'>Xóa</button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ManageProducts