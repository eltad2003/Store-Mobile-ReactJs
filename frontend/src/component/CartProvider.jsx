import React, { createContext, useEffect, useState } from 'react'
export const CartContext = createContext()

function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('cart'))
        return storage ?? []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id)
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ))
        }
        else {

            setCartItems([...cartItems, { ...product, quantity: 1 }])
        }
        alert("Đã thêm vào giỏ hàng!")
        console.log(cartItems)
    }

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id))
    }

    const increaseItem = (product) => {
        setCartItems(cartItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ))
    }
    const decreaseItem = (product) => {
        setCartItems(cartItems.map(item =>
            item.id === product.id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ))
    }
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseItem, decreaseItem }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
