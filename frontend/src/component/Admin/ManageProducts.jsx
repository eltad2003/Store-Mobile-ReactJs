import React, { useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthContext } from '../AuthProvider';

function ManageProducts() {


  const { user } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [images, setImages] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    brand: "",
    stockQuantity: "",
  });
  const [editProduct, setEditProduct] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    brand: "",
    stockQuantity: "",
  });
  const handleEditClick = (productId) => {
    // Tìm sản phẩm trong mảng products theo id
    const productToEdit = products.find(product => product.id === productId);

    if (productToEdit) {
      // Gán giá trị của sản phẩm vào editProduct
      setEditProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        discount: productToEdit.discount,
        category: productToEdit.category || "", // Nếu không có category, đặt giá trị mặc định
        brand: productToEdit.brand,
        stockQuantity: productToEdit.stockQuantity,
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/products', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchProducts()
  }, [])



  const handleEditChange = async (productId) => {
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
        fetchProducts()

      } else {
        alert("Lỗi khi cập nhật sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  const handleAddProduct = async () => {
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
        discount: parseInt(newProduct.discount),
        brand: newProduct.brand,
        stockQuantity: parseInt(newProduct.stockQuantity),
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
        fetchProducts()
        setNewProduct({
          name: "",
          description: "",
          price: "",
          discount: "",
          brand: "",
          stockQuantity: "",
        });
      } else {
        alert("Lỗi khi thêm sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        const response = await fetch(`http://localhost:8080/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });

        if (response.ok) {
          alert("Xóa sản phẩm thành công!");
          fetchProducts()
        } else {
          alert("Lỗi khi xóa sản phẩm!");
        }
      } catch (error) {
        console.error("Lỗi API:", error);
      }
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
                      <div className="mb-3">
                        <label className="form-label">Tên</label>
                        <input type="text" name='name' className="form-control" onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Mô tả sản phẩm</label>
                        <input type="text" name='description' className="form-control" onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Giá</label>
                        <input type="text" name='price' className="form-control" onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Giảm giá</label>
                        <input type="number" name='discount' className="form-control" onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Hãng</label>
                        <input type="text" name='brand' className="form-control" onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Số sản phẩm</label>
                        <input type="text" name='stockQuantity' className="form-control" onChange={(e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Danh mục</label>
                        <select className="form-select" name="category" >
                          <option selected>---Vui lòng chọn danh mục---</option>
                          <option value="mobile" >Điện thoại</option>
                          <option value="laptop">Laptop</option>
                          <option value="gaming">Tay Cầm</option>
                          <option value="appliances">Linh kiện khác</option>
                          <option value="tv">TV</option>
                          <option value="audio">Loa, tai nghe</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Ảnh</label>
                        <input type="file"
                          onChange={(e) => setImages(Array.from(e.target.files))}
                          multiple
                          className="form-control"
                        />
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
                  <th className='scope'>Ảnh</th>
                  <th className='scope'>Giá</th>
                  <th className='scope'>Số lượng trong kho</th>
                  <th className='scope'>Mô tả</th>
                  <th className='scope'>Giảm giá</th>
                  <th className='scope'>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <th>{product.id}</th>
                    <td className='text-truncate' style={{ maxWidth: 250 }}>{product.name}</td>
                    <td>
                      {product.listMedia.map(media => (
                        <img src={media} alt="" width={50} height={50} />
                      ))}
                    </td>
                    <td className='fw-semibold text-danger'>${product.price} </td>
                    <td >{product.stockQuantity} </td>
                    <td className='text-truncate' style={{ maxWidth: 250 }}>{product.description} </td>
                    <td className='fw-semibold text-success'>{product.discount ? `${product.discount}%` : ""}</td>
                    <td>
                      <button className='btn btn-sm btn-primary' data-bs-toggle="modal" data-bs-target={`#modalEdit-${product.id}`} onClick={() => handleEditClick(product.id)}>Sửa</button>
                      {/* Sửa sản phẩm */}
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
                                <input type="text" name='name' value={editProduct.name} className="form-control" onChange={(e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value })} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Mô tả</label>
                                <textarea type="text" name='description' value={editProduct.description} className="form-control" onChange={(e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value })} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Giá</label>
                                <input type="text" name='price' value={editProduct.price} className="form-control" onChange={(e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value })} required />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Số lượng sản phẩm</label>
                                <input type="number" name='stockQuantity' value={editProduct.stockQuantity} className="form-control" onChange={(e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value })} />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Danh mục</label>
                                <select className="form-select" name="category" onChange={(e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value })} >
                                  <option selected>---Vui lòng chọn danh mục---</option>
                                  <option value="mobile" >Điện thoại</option>
                                  <option value="laptop">Laptop</option>
                                  <option value="gaming">Tay Cầm</option>
                                  <option value="appliances">Linh kiện khác</option>
                                  <option value="tv">TV</option>
                                  <option value="audio">Loa, tai nghe</option>
                                </select>
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Giảm giá (%)</label>
                                <input type="number" name='discount' value={editProduct.discount} className="form-control" onChange={(e) => setEditProduct({ ...editProduct, [e.target.name]: e.target.value })} />
                              </div>
                              <div className="mb-2">
                                <label className="form-label fw-bold">Hình ảnh sản phẩm</label>
                                <input
                                  type="file"
                                  onChange={(e) => setImages(Array.from(e.target.files))}
                                  multiple
                                  className="form-control"
                                />
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleEditChange(product.id)}>Cập nhật</button>
                            </div>

                          </div>
                        </div>
                      </div>
                      <button className='btn btn-sm btn-danger ms-1' onClick={() => handleDeleteProduct(product.id)}>Xóa {product.id}</button>
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