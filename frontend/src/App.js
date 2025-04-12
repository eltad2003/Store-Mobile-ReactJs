import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './component/Login/Login'
import Register from './component/Register/Register'
import Navbar from './component/Navbar/Navbar'
import ShopCategory from './component/ShopCategory/ShopCategory'
import Home from './component/Home/Home'
import Product from './component/ProductDisplay/Product'
import AuthProvider from './component/AuthProvider'
import Cart from './component/Cart/Cart'
import CartProvider from './component/CartProvider'
import Order from './component/Order/Order'
import Popular from './component/Popular'

import AdminLayout from './component/Admin/AdminLayout'
import ManageUsers from './component/Admin/ManageUsers'
import ManageOrders from './component/Admin/ManageOrders'
import Reports from './component/Admin/Reports'
import ManageProducts from './component/Admin/ManageProducts'
import Dashboard from './component/Admin/Dashboard'
import Profile from './component/User/Profile'
import ChangePassword from './component/User/ChangePassword'



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            {/* Các route của User */}
            <Route path="/" element={<Navbar />}>
              <Route index element={<Home />} />
              <Route path='/products/:productId' element={<Product />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/tv" element={<ShopCategory category="tv" />} />
              <Route path="/audio" element={<ShopCategory category="audio" />} />
              <Route path="/mobile" element={<ShopCategory category="mobile" />} />
              <Route path="/laptop" element={<ShopCategory category="laptop" />} />
              <Route path="/gaming" element={<ShopCategory category="gaming" />} />
              <Route path="/appliances" element={<ShopCategory category="appliances" />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/order' element={<Order />} />
              <Route path='/popular' element={<Popular />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/profile/change-password' element={<ChangePassword />} />

            </Route>

            {/* Các route của Admin  */}
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="orders" element={<ManageOrders />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>

  )
}

export default App