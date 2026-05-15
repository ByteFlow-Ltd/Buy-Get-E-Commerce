import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Reba niba hari ibintu byari muri Cart (Local Storage) kugira ngo bidafutuka umuntu arefresheje
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('buyAndGetCart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Bika muri Local Storage buri gihe Cart ihindutse
    useEffect(() => {
        localStorage.setItem('buyAndGetCart', JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Toza gushyira mu kagari (Add to Cart)
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const isExist = prevItems.find(item => item.id === product.id);
            if (isExist) {
                // Niba gihari, ongeraho rimwe (Quantity + 1)
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            // Niba ari gishya, gishyiremo gifite qty ya 1
            return [...prevItems, { ...product, qty: 1 }];
        });
        
        // Option: Ushobora kongeramo "Toast notification" hano
        alert(`${product.name} added to cart!`);
    };

    // 4. Kuramo igicuruzwa (Remove)
    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    // 5. Hindura umubare (Update Qty)
    const updateQty = (id, delta) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ));
    };

    // 6. Toza gusiba byose (Clear Cart)
    const clearCart = () => setCartItems([]);

    // 7. Bara umubare w'ibintu byose biri mu kagari (Badge count)
    const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

    // 8. Bara amafaranga yose (Total Price)
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQty, 
            clearCart, cartCount, totalPrice 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
