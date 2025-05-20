// import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"

import "./Home.css"
import { blogs, services } from './Service'
import { ArrowLeft, ArrowRight, ArrowUpward, Email, Send } from "@mui/icons-material"
import clockBanner from '../asset/dong-ho-thong-minh-huawei-watch-gt-5-milanese-13-02-home.webp'
import s25Banner from "../asset/s25-mo-ban-moi-23-1-25.webp"
import xiaomi15Banner from '../asset/xiaomi-15-ultra-home-dkntt.webp'
import { Carousel } from "react-bootstrap"
import { useEffect, useState } from "react"
import Sidebar from "../Sidebar/Sidebar"
import CartItem from "../CartItem/CartItem"
import Footer from "../Footer/Footer"
import Sale from "../Sale"
import { Link } from "react-router-dom"
import Chatbot from "../Chatbot/Chatbot"
import { urlBE } from "../../baseUrl"
import Banner from "./Banner"


function Home() {
   const [products, setProducts] = useState([])

   const [currentPage, setCurrentPage] = useState(1)
   const [itemPerpage, setItemPerPage] = useState(15)


   const fetchProducts = async () => {
      try {
         const response = await fetch(`${urlBE}/products`)
         const data = await response.json()
         setProducts(data)
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


   const lastItemIndx = currentPage * itemPerpage
   const firstItemIndx = lastItemIndx - itemPerpage
   const pages = []
   for (let i = 1; i <= Math.ceil(products.length / itemPerpage); i++) {
      pages.push(i)
   }

   return (
      <div className="bg-light">
         {/* Banner and thanh danh mục */}
         <Banner />

         {/* sản phẩm hot */}
         <div className="container">
            <div className="bg rounded-4">
               <Sale products={products} />
            </div>
         </div>


         {/* Tất cả sản phẩm */}
         <div className="container py-5" id="top">
            <h3 className='mt-3 fw-bold'>TẤT CẢ SẢN PHẨM</h3>
            <div className="row mt-3">
               {products.slice(firstItemIndx, lastItemIndx).map((item) => (
                  <div className="col col-12d5 col-6 col-md-4 my-3" key={item.id}>
                     <CartItem item={item} />
                  </div>
               ))}
            </div>
            {/* pagination */}
            <div className=" mt-4 d-flex justify-content-center">
               {/* <button className="btn text-white bg"
                     onClick={() => {
                        setCurrentPage(currentPage - 1)
                        document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
                     }}
                  >
                     <ArrowLeft />
                  </button> */}
               {pages.map((page, index) => (
                  <div key={index}>
                     <button className={page === currentPage && currentPage > 0 ? "btn pw-bold text-white bg mx-2 active" : "btn"}
                        onClick={() => {
                           setCurrentPage(page)
                           document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                     >
                        {page}
                     </button>
                  </div>
               ))}
               <button className="btn text-white bg"
                  onClick={() => {
                     setCurrentPage(currentPage + 1);
                     document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
               >
                  <ArrowRight />
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
         </div>
         <Footer />
      </div>

   );
}

export default Home