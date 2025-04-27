import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { ArrowBack, FavoriteBorder, Star } from '@mui/icons-material'

import CartItem from '../CartItem/CartItem'


function ShopCategory({ category }) {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/products')
      const data = await response.json()
      setProducts(data)
      console.log(products);
    } catch (error) {
      console.log("Loi ket noi API: ", error);
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  if (!products) {
    return (
      <div className='position-absolute top-50 start-50 translate-middle'>
        <div className="spinner-border text-danger" role="status">
        </div>
      </div>
    )
  }


  return (

    <div className='container p-5 '>
      <div className='d-flex'>
        <Link to={"/"} className='text-black mt-1'><ArrowBack /></Link>
        <p className='fw-bold fs-4 ms-2'>Danh mục {category.toUpperCase()}</p>
      </div>
      <div className='row'>
        {products
          .filter(item => item.category === category)
          .map(item => (
            <div className="col-md-3 col-6 my-3" key={item.id}>
              <CartItem item={item} />
            </div>
          ))}
      </div>

    </div>
  )
}

export default ShopCategory