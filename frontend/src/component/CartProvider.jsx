import React, { createContext, useEffect, useState } from 'react'
export const CartContext = createContext()

function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const storage = JSON.parse(localStorage.getItem('cart'))
        return storage ?? []
    })
    const [selectedItems, setSelectedItems] = useState([])


    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])

    const toggleSelectItem = (id) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(itemId => itemId !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    const selectAllItems = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(cartItems.map(item => item.id))
        }
    }

    const addToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id)

        if (existingItem) {
            if (existingItem.quantity + 1 > product.stockQuantity) {
                alert('Số lượng vượt quá hàng trong kho!')
                return
            }
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
        const existingItem = cartItems.find(item => item.id === product.id)
        if (existingItem.quantity + 1 > product.stockQuantity) {
            alert('Số lượng vượt quá hàng trong kho!')
            return
        }
        setCartItems(cartItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ))
    }
    const decreaseItem = (product) => {
        setCartItems(cartItems.map(item =>
            item.id === product.id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ))
    }

    const updateQuantity = (product, newQuantity) => {
        if (newQuantity > product.stockQuantity) {
            alert('Số lượng vượt quá hàng trong kho!')
            return
        }
        if (newQuantity > 0) {
            setCartItems(cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: parseInt(newQuantity) } : item
            ))
        }
    }

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            increaseItem,
            decreaseItem,
            selectedItems,
            toggleSelectItem,
            selectAllItems,
            updateQuantity,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
