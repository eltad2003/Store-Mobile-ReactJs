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
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            increaseItem,
            decreaseItem,
            selectedItems,
            toggleSelectItem,
            selectAllItems,

        }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider
