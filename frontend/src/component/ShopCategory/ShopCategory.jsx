import React, { useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'

import CartItem from '../CartItem/CartItem'
import { urlBE } from '../../baseUrl'
import { Loading } from '../Loading'



function ShopCategory({ category }) {
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState(null)
  const [order, setOrder] = useState(null)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const formRef = useRef(null)

  const fetchProducts = async (sortBy, order) => {
    try {
      let url = `${urlBE}/products?category=${category}`
      if (sortBy) {
        url += `&sortBy=${sortBy}&order=${order}`
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.log("Loi ket noi API: ", error);
    }
  }


  const filteredProducts = products
    .filter(item => {
      const price = Number(item.price)
      const min = minPrice !== '' && minPrice !== null ? Number(minPrice) : 0
      const max = maxPrice !== '' && maxPrice !== null ? Number(maxPrice) : Infinity
      return price >= min && price <= max
    })

  useEffect(() => {
    fetchProducts(sortBy, order)
  }, [sortBy, order])

  const handleResetFilter = () => {
    setMinPrice('')
    setMaxPrice('')
    setSortBy(null)
    setOrder(null)
    formRef.current.reset()
  }
  if (!products) {
    return (
      <Loading />
    )
  }

  const filterProduct = () => {
    return (
      <>
        <form ref={formRef} className='mb-3 mt-3'>
          <p className='fw-bold'>Bộ lọc</p>
          <div className="mb-2">
            <label className="form-label">Khoảng giá</label>
            <input
              type="number"
              className="form-control mb-1"
              placeholder="Giá thấp nhất"
              value={(minPrice)}
              onChange={e => setMinPrice(e.target.value)}
              min={0}
              step={500000}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Giá cao nhất"
              value={(maxPrice)}
              onChange={e => setMaxPrice(e.target.value)}
              min={0}
              step={500000}
            />
          </div>
        </form>

        <form ref={formRef} className='mb-3 '>
          <p className='fw-bold'>Sắp xếp theo</p>
          <div className="form-check">
            <label className="form-check-label" ><i className="bi bi-sort-up"></i> Giá từ thấp đến cao </label>
            <input className="form-check-input" id='priceAsc' value='priceAsc' name="sort" type="radio"
              onClick={() => { setSortBy('price'); setOrder('asc') }} />
          </div>

          <div className="form-check">
            <label className="form-check-label" ><i className="bi bi-sort-down"></i> Giá từ cao đến thấp </label>
            <input className="form-check-input" id='priceDesc' value='priceDesc' name="sort" type="radio"
              onClick={() => { setSortBy('price'); setOrder('desc') }} />
          </div>

          <div className="form-check">
            <label className="form-check-label" ><i className="bi bi-percent"></i> Khuyến mãi hot </label>
            <input className="form-check-input" id='promotion' value='promotion' name="sort" type="radio"
              onClick={() => { setSortBy('discount'); setOrder('desc') }} />
          </div>
          <button className='btn bg text-white mt-3' onClick={handleResetFilter}>Reset bộ lọc</button>
        </form>
      </>
    )
  }
  const filterProductCanvas = () => {
    return (
      <>
        <div
          className="offcanvas offcanvas-start"
          data-bs-backdrop="static"
          tabIndex="-1"
          id="Id2"
          aria-labelledby="staticBackdropLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column gap-3">
            {filterProduct()}
          </div>
        </div>

      </>
    )
  }

  return (

    <div className='container my-3'>
      <div className='d-flex'>
        <Link to={"/"} className='text-black mt-1'><ArrowBack /></Link>
        <p className='fw-bold fs-4 ms-2'>Danh mục {category.toUpperCase()}</p>
        <button
          className="btn bg text-white ms-auto d-lg-none "
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#Id2"
          aria-controls="Id2"
        >
          Bộ lọc
        </button>
      </div>
      <div className="row">
        <div className="col-md-2 d-none d-lg-block d-md-none p-3">
          {filterProduct()}
        </div>

        <div className="container col-md-10 p-2">
          <div className='row'>
            {filteredProducts.map(item => (
              <div
                className="my-3 col-12d5"
                key={item.id}
              >
                <CartItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {filterProductCanvas()}

    </div>
  )
}

export default ShopCategory