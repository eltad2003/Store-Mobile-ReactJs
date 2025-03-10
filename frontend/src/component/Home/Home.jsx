// import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"

import "./Home.css"
import { blogs, services } from './Service'
import { products } from './ListProduct'
import { ArrowLeft, ArrowRight, ArrowUpward, Email, Send } from "@mui/icons-material"
import clockBanner from '../asset/dong-ho-thong-minh-huawei-watch-gt-5-milanese-13-02-home.webp'
import s25Banner from "../asset/s25-mo-ban-moi-23-1-25.webp"
import xiaomi15Banner from '../asset/xiaomi-15-ultra-home-dkntt.webp'
import { Carousel } from "react-bootstrap"
import { useState } from "react"
import Sidebar from "../Sidebar/Sidebar"
import CartItem from "../CartItem/CartItem"
import Footer from "../Footer/Footer"
import Popular from "../Popular"
import Sale from "../Sale"
import { Link } from "react-router-dom"


function Home() {

   const [showChat, setShowChat] = useState(false)

   const [currentPage, setCurrentPage] = useState(1)
   const [itemPerpage, setItemPerPage] = useState(20)
   const lastItemIndx = currentPage * itemPerpage
   const firstItemIndx = lastItemIndx - itemPerpage
   const pages = []
   for (let i = 1; i <= Math.ceil(products.length / itemPerpage); i++) {
      pages.push(i)
   }


   // const [products, setProducts] = useState([])
   // useEffect(() => {
   //    fetch('https://fakestoreapi.in/api/products')
   //       .then(res => res.json())
   //       .then(data => setProducts(data.products))
   //       .catch(error => console.error('Error fetching products:', error));
   // }, []);

   return (
      <div className="bg mt-3">

         <div class="position-relative my-5">
            <img src="https://i.ytimg.com/vi/fekvDICqknA/maxresdefault.jpg" alt="" class=" w-100 img-fluid " />
            <div class="position-absolute start-50 translate-middle mb-5">
               <Link to={"/products/15"}><button class="btn btn-dark btn-outline-light fs-4 rounded-5">Xem chi tiết</button></Link>
            </div>
         </div>




         {/* 
         <div className="container mt-5 mb-5">
            <div className="row justify-content-center text-center">
               {services.map((service, index) => (
                  <div key={index} className="col-md-3 d-flex flex-column align-items-center">
                     <div className="mb-4">{service.icon}</div>
                     <h5 className="fw-bold">{service.title}</h5>
                     <p className="text-muted text-center mb-5">{service.description}</p>
                  </div>
               ))}
            </div>
         </div> */}

         {/* sản phảm hot */}
         <div className=" p-5 w-100">
            <Popular products={products} />
         </div>




         {/* Tất cả sản phẩm */}
         <div className="p-5 " id="top">
            <div>
               <h3 className='mt-3 fw-bold'>TẤT CẢ SẢN PHẨM</h3>
               <div className="row">
                  {products.slice(firstItemIndx, lastItemIndx).map((item) => (
                     <div className="col-md-3 my-3" key={item.id}>
                        <CartItem item={item} />
                     </div>
                  ))}
               </div>
               <div className=" mt-4 d-flex justify-content-center">
                  {/* <button className="btn btn-danger"
                     onClick={() => {
                        setCurrentPage(currentPage - 1)
                        document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
                     }}
                  >
                     Trước
                  </button> */}
                  {pages.map(page => (
                     <div>
                        <button className={page === currentPage ? "btn  btn-danger mx-2 active" : "btn"}
                           onClick={() => {
                              setCurrentPage(page)
                              document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
                           }}
                        >
                           {page
                           }</button>
                     </div>
                  ))}
                  <button className="btn btn-danger"
                     onClick={() => {
                        setCurrentPage(currentPage + 1);
                        document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
                     }}
                  >
                     <ArrowRight />
                  </button>
               </div>
            </div>
            {/* Banner and thanh danh mục */}
            <div className="container mt-4 p-5">
               <div className="row">
                  <div className="col-md-2 mt-3">
                     <Sidebar />
                  </div>
                  <div className="col-md-7 mt-3 ">

                     <div className="card h-100 d-flex align-items-center justify-content-center shadow p-2">
                        <Carousel
                           prevIcon={<ArrowLeft style={{ color: 'black', fontSize: '70px', marginLeft: '-100px' }} />}
                           nextIcon={<ArrowRight style={{ color: 'black', fontSize: '70px', marginRight: '-100px' }} />}>
                           <Carousel.Item>
                              <img className=" img-fluid w-100" src={clockBanner} alt="First slide" />
                           </Carousel.Item>
                           <Carousel.Item>
                              <img className=" img-fluid w-100" src={s25Banner} alt="Second slide" />
                           </Carousel.Item>
                           <Carousel.Item>
                              <img className=" img-fluid w-100" src={xiaomi15Banner} alt="Third slide" />
                           </Carousel.Item>
                        </Carousel>
                     </div>


                  </div>
                  <div className="col-md-3 mt-3">
                     <div className="card h-100 shadow p-2">
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/m55-right-banner-8-3.png" alt="" className="img-fluid w-100mb-2 rounded" />
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-imac-m4-30-12.jpg" alt="" className="img-fluid w-100mb-2 rounded" />
                        <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-right-laptop.jpg" alt="" className="img-fluid w-100mb-2 rounded" />
                     </div>
                  </div>
               </div>
            </div>


         </div>

         {/*hot sale*/}
         <div className="p-5 mt-3 w-100">
            <Sale products={products} />
         </div>


         {/* forum */}
         <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center my-4">
               <h2 className="fw-bold text-uppercase">Bài Viết Mới Nhất</h2>
               <button className="btn btn-danger rounded-pill px-4">Xem Tất Cả</button>
            </div>
            <div className="row">
               {blogs.map((blog, index) => (
                  <div key={index} className="col-md-3">
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
            <a href='#top' className="up-to-top rounded-pill p-2 bg-danger text-white"> <ArrowUpward /></a>
            <button className="btn respond rounded-pill p-2 bg-primary text-white" onClick={() => setShowChat(!showChat)}> <Email /></button>
            {showChat ? (
               <>
                  <div className="position-fixed top-0 start-0 h-100 w-100 bg-dark opacity-50 " onClick={() => setShowChat(false)}>
                  </div>
                  <div className=" p-5 fixed-bottom  w-50 start-50 translate-middle-y">
                     <div className="card shadow mt-2 p-3">
                        <p className="fw-bold fs-5">Chat</p>
                        <div className="d-flex">
                           <textarea className="form-control mx-2"></textarea>
                           <button className="btn text-primary btn-sm"><Send /></button>
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <>
               </>
            )}
         </div>

         <Footer />
      </div>

   );
}

export default Home