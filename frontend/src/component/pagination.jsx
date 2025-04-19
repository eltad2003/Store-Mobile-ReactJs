
// const [currentPage, setCurrentPage] = useState(1)
// const [itemPerpage, setItemPerPage] = useState(20)
// const lastItemIndx = currentPage * itemPerpage
// const firstItemIndx = lastItemIndx - itemPerpage


// const pages = []
// for (let i = 1; i <= Math.ceil(products.length / itemPerpage); i++) {
//    pages.push(i)
// }

// {products.slice(firstItemIndx, lastItemIndx).map((item) => (
//     <div className="col-6 col-md-3 my-3" key={item.id}>
//        <CartItem item={item} />
//     </div>
//  ))}

//  <div className=" mt-4 d-flex justify-content-center">
//  {/* <button className="btn btn-danger"
//     onClick={() => {
//        setCurrentPage(currentPage - 1)
//        document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
//     }}
//  >
//     Trước
//  </button> */}
//  {pages.map(page => (
//     <div>
//        <button className={page === currentPage && currentPage > 0 ? "btn pw-bold btn-danger mx-2 active" : "btn"}
//           onClick={() => {
//              setCurrentPage(page)
//              document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
//           }}
//        >
//           {page}
//        </button>
//     </div>
//  ))}
//  <button className="btn btn-danger"
//     onClick={() => {
//        setCurrentPage(currentPage + 1);
//        document.getElementById("top").scrollIntoView({ behavior: "smooth", block: "start" });
//     }}
//  >
//     <ArrowRight />
//  </button>
// </div>