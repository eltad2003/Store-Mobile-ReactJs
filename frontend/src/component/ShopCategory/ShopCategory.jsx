import React, { useState } from 'react'
import { products } from '../Home/ListProduct'
import { Link } from 'react-router-dom'
import { ArrowBack, FavoriteBorder, Star } from '@mui/icons-material'

import CartItem from '../CartItem/CartItem'


function ShopCategory({ category }) {


  return (

    <div className='p-5 '>
      <div className='d-flex'>
        <Link to={"/"} className='text-black mt-1'><ArrowBack /></Link>
        <p className='fw-bold fs-4 ms-2'>Danh mục {category.toUpperCase()}</p>
      </div>

      <div className='row'>

        {products
          .filter(item => item.category === category)
          .map(item => (
            <div className="col-md-3 my-3" key={item.id}>
              <CartItem item={item} />
            </div>
          ))}
      </div>

    </div>
  )
}

export default ShopCategory