// import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"

import "./Home.css"
import { blogs } from './Service'
import { ArrowLeft, ArrowRight, ArrowUpward } from "@mui/icons-material"
import { useEffect, useState } from "react"
import CartItem from "../CartItem/CartItem"
import Footer from "../Footer/Footer"
import Sale from "./Sale"
import { Link } from "react-router-dom"
import Chatbot from "../Chatbot/Chatbot"
import { urlBE } from "../../baseUrl"
import Banner from "./Banner"
import zaloIcon from '../asset/zaloIcon.png'
import Skeleton from "../Skeleton/Skeleton"

function Home() {
   const [products, setProducts] = useState([])
   const [isLoading, setIsLoading] = useState(false)
   const [page, setPage] = useState(1)
   const [limit, setLimit] = useState(20)
   const [sortBy, setSortBy] = useState('')
   const [totalCount, setTotalCount] = useState()
   const [sortOrder, setSortOrder] = useState(null)

   const fetchProducts = async (order = null, pageNum = page, limitNum = limit, sortType = sortBy) => {
      setIsLoading(true);
      try {
         let url = `${urlBE}/products?page=${pageNum}&limit=${limitNum}`;
         if (order) {
            url += `&sortBy=${sortType}&order=${order}`;
         }
         console.log(url);

         const [productsRes, productCountRes] = await Promise.all([
            fetch(url, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               }
            }),
            fetch(`${urlBE}/products/count`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
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
      } finally {
         setIsLoading(false);
      }
   };

   const handlePrevPage = () => {
      if (page > 1) setPage(page - 1);
   };

   const handleNextPage = () => {
      setPage(page + 1);
   };
   const totalPages = Math.ceil(totalCount / limit);

   useEffect(() => {

      fetchProducts(sortOrder, page, limit, sortBy)
   }, [sortOrder, page, limit, sortBy])

   if (!products) {
      return (
         <div className='position-absolute top-50 start-50 translate-middle'>
            <div className="spinner-border text-danger" role="status">
            </div>
         </div>
      )
   }




   return (
      <div className="bg-light">
         {/* Banner and thanh danh mục */}
         <Banner />

         {/* sản phẩm hot */}
         <div className="container">
            <div className="bg rounded-4">
               <Sale />
            </div>
         </div>


         {/* Tất cả sản phẩm */}
         <div className="container" id="top">
            <h3 className='mt-3 fw-bold'>TẤT CẢ SẢN PHẨM</h3>
            <div className="row mt-3">
               {isLoading ? (
                  <div className="row ">
                     <div className="col">  <Skeleton /></div>
                     <div className="col">  <Skeleton /></div>
                     <div className="col">  <Skeleton /></div>
                     <div className="col">  <Skeleton /></div>
                     <div className="col">  <Skeleton /></div>

                  </div>
               ) : (
                  <>
                     {
                        products.map((item) => (
                           <div className="my-3 col-12d5" key={item.id} >
                              <CartItem item={item} />
                           </div>
                        ))
                     }
                  </>
               )}

            </div>
            {/* pagination */}
            <div className='d-flex justify-content-center d-flex align-items-center gap-2 ms-auto py-3'>
               <button className="btn btn-sm bg text-white" onClick={() => {
                  handlePrevPage();
                  window.scrollTo({
                     top: 0,
                     behavior: 'smooth'
                  })
               }} disabled={page === 1}>
                  <i className="bi bi-chevron-left"></i>
               </button>
               <span><input value={page} onChange={(e) => setPage(e.target.value)} style={{ width: 30 }} /> / {totalPages}</span>
               <button
                  className="btn btn-sm bg text-white"
                  onClick={() => {
                     handleNextPage();
                     window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                     })
                  }}
                  disabled={products.length < limit}
               >
                  <i className="bi bi-chevron-right"></i>
               </button>
            </div>
         </div>


         {/* forum */}
         <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center my-4">
               <h2 className="fw-bold text-uppercase">Bài Viết Mới Nhất</h2>
               <button className="btn text-white bg rounded-pill px-4">Xem Tất Cả</button>
            </div>
            <div className="row">
               {blogs.map((blog, index) => (
                  <div key={index} className="col-md-3 col-6">
                     <div className="card border-0 h-100">
                        <div className="p-2">
                           <img src={blog.image} alt={blog.title} className="card-img-top rounded-3" />
                        </div>
                        <div className="card-body p-3">
                           <p className="text-muted small">{blog.date}</p>
                           <h6 className="fw-bold">{blog.title}</h6>
                           <p className="text-muted small">{blog.description} <a href={blog.link} className="text-decoration-none text-primary">Đọc thêm</a></p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>


         {/* lên đầu và chat */}
         <div>
            <a href='#top' className="up-to-top rounded-pill p-2 bg text-white"> <ArrowUpward /></a>
            <Chatbot />
            <Link to='https://zalo.me/0329732322' target="_blank"><img src={zaloIcon} alt="zalo icon"
               style={{
                  position: 'fixed',
                  bottom: 0,
                  right: '10px',
               }}
            />
            </Link>
         </div>
         <Footer />
      </div >

   );
}

export default Home