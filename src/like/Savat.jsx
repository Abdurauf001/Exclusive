import React, { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./Savat.css";
import { API_BASE } from "../api/client";
import { getCurrentUserId, readScopedItems, writeScopedItems } from "../auth/session";

const Savat = () => {
    const navigate = useNavigate();
    const currentUserId = getCurrentUserId();
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const shippingFee = 0;

    const getCartItems = () => readScopedItems("cartItems", currentUserId);
    const saveCartItems = (items) => writeScopedItems("cartItems", items, currentUserId);

    useEffect(() => {
        const loadCart = async () => {
            if (currentUserId) {
                try {
                    const res = await fetch(`${API_BASE}/api/savat?userId=${currentUserId}`);
                    if (!res.ok) {
                        throw new Error(`Savat request failed: ${res.status}`);
                    }
                    const data = await res.json();

                    const serverCart = Array.isArray(data)
                        ? data.map((item) => ({
                            id: item.productId ?? item.id,
                            name: item.title || item.itemName || item.name,
                            price: Number(item.price ?? item.unitPrice ?? 0),
                            quantity: Number(item.quantity ?? 1),
                            image: item.imageUrl || item.image,
                        }))
                        : [];

                    setCartItems(serverCart);
                    saveCartItems(serverCart);
                    return;
                } catch {
                    // fallback to scoped local cart
                }
            }

            const savedCart = getCartItems();
            const cleanedCart = savedCart.map((item) => ({
                ...item,
                name: item.title || item.name,
                price: Number(item.price ?? item.newPrice ?? 0),
                quantity: Number(item.count ?? item.quantity ?? 1),
            }));
            setCartItems(cleanedCart);
        };

        loadCart();
    }, [currentUserId]);

    useEffect(() => {
        saveCartItems(cartItems);
    }, [cartItems]);

    const calculateSubtotal = useCallback(() => {
        return cartItems.reduce((total, item) =>
            total + (item.price * item.quantity), 0
        );
    }, [cartItems]);

    const subtotal = calculateSubtotal();
    const total = subtotal - discount + shippingFee;

    const handleQuantityChange = async (id, newQuantity) => {
        const quantity = parseInt(newQuantity);
        if (isNaN(quantity) || quantity < 1) return;

        setCartItems((prevItems) => prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
        ));

        if (!currentUserId) return;

        try {
            await fetch(`${API_BASE}/api/savat/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId, quantity }),
            });
        } catch {
            // ignore sync error, local UI already updated
        }
    };

    const handleUpdateCart = () => {
        alert("Savat yangilandi!");
    };

    const handleRemoveItem = async (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

        if (!currentUserId) return;

        try {
            await fetch(`${API_BASE}/api/savat/${id}?userId=${currentUserId}`, { method: "DELETE" });
        } catch {
            // ignore sync error
        }
    };

    const handleApplyCoupon = () => {
        const code = couponCode.toUpperCase().trim();
        const validCoupons = ['FREE', 'ABDURAUF'];

        if (validCoupons.includes(code)) {
            const newDiscount = subtotal * 0.20;
            setDiscount(newDiscount);
            alert(`Kupon qo'llanildi! ${newDiscount.toFixed(2)}$ chegirma berildi.`);
        } else {
            setDiscount(0);
            alert("Noto'g'ri kupon kodi.");
        }
        setCouponCode('');
    };

    const handleCheckout = async () => {
        const hasValidCart = cartItems.some(
            (item) => Number(item?.price) > 0 && Number(item?.quantity) > 0
        );

        if (!hasValidCart || subtotal <= 0) {
            alert("Savatda mahsulot yo'q. Avval mahsulot qo'shing.");
            return;
        }

        navigate("/checkout", {
            state: {
                discount,
            },
        });
    };

    return (
        <div className="cart-container">
            <div className="cart-breadcrumb">
                <span className="breadcrumb-link">Home</span> / <span>Cart</span>
            </div>

            <div className="cart-table-wrapper">
                <div className="cart-table-header">
                    <div className="header-product">Product</div>
                    <div className="header-price">Price</div>
                    <div className="header-quantity">Quantity</div>
                    <div className="header-subtotal">Subtotal</div>
                </div>

                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div className="cart-table-row" key={item.id}>
                            <div className="row-product">
                                <img
                                    src={item.image || item.img}
                                    alt={item.name}
                                    className="cart-product-img"
                                />
                                <span className="product-name">{item.name}</span>
                                <button
                                    className="remove-item-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="row-price">${item.price.toFixed(2)}</div>
                            <div className="row-quantity">
                                <select
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    className="quantity-select"
                                >
                                    {Array.from(
                                        { length: Math.max(20, Number(item.quantity) || 1) },
                                        (_, i) => i + 1
                                    ).map((qty) => (
                                        <option key={`${item.id}-qty-${qty}`} value={qty}>
                                            {String(qty).padStart(2, '0')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="row-subtotal">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-cart-message">Savat hozircha bo'sh.</div>
                )}
            </div>

            <div className="cart-actions-bottom">
                <button className="return-shop-btn">Return To Shop</button>
                <button className="update-cart-btn" onClick={handleUpdateCart}>Update Cart</button>
            </div>

            <div className="cart-footer">
                <div className="coupon-section">
                    <input
                        type="text"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="coupon-input"
                    />
                    <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                        Apply Coupon
                    </button>
                </div>

                <div className="cart-total-box">
                    <h3>Cart Total</h3>
                    <div className="total-row">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="total-row discount-row">
                            <span>Discount:</span>
                            <span className="discount-amount">-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="total-row shipping-row">
                        <span>Shipping:</span>
                        <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="total-row final-total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                        Process to checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Savat;
