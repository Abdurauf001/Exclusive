import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart } from "lucide-react";
import "./Wishlist.css";
import { API_BASE } from "../api/client";
import { getCurrentUserId, readScopedItems, writeScopedItems, clearScopedItems } from "../auth/session";

const Wishlist = () => {
    const currentUserId = getCurrentUserId();
    const [wishlistItems, setWishlistItems] = useState([]);

    const getWishlistItems = () => readScopedItems("wishlistItems", currentUserId);
    const saveWishlistItems = (items) => writeScopedItems("wishlistItems", items, currentUserId);
    const getCartItems = () => readScopedItems("cartItems", currentUserId);
    const saveCartItems = (items) => writeScopedItems("cartItems", items, currentUserId);

    useEffect(() => {
        let mounted = true;

        const buildWishlistItemFromLike = (like) => {
            const card = like?.card || {};
            const imageValue = card.imageUrl || card.image || like?.imageUrl || like?.image;
            const priceValue = Number(card.price ?? like?.price ?? card.newPrice ?? like?.newPrice ?? 0);

            return {
                id: like?.targetId ?? like?.id,
                likeId: like?.id,
                title: card.title ?? like?.title,
                name: card.title ?? like?.title,
                description: card.description ?? like?.description,
                image: imageValue,
                img: imageValue,
                imageUrl: imageValue,
                price: priceValue,
                newPrice: priceValue,
                oldPrice: card.oldPrice ?? like?.oldPrice,
                discount: card.discount ?? card.discountPercent ?? like?.discount ?? like?.discountPercent,
                isLiked: true,
                rating: card.rating ?? like?.rating,
            };
        };

        const syncWishlistFromServer = async () => {
            if (!currentUserId) {
                const localItems = getWishlistItems();
                if (mounted) {
                    setWishlistItems(localItems);
                }
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/likes?userId=${currentUserId}`);
                if (!res.ok) return;

                const likes = await res.json();
                if (!Array.isArray(likes)) return;

                const cardLikes = likes.filter((like) => {
                    const type = (like?.targetType || "").toLowerCase();
                    const hasCardFields =
                        like?.title ||
                        like?.description ||
                        like?.imageUrl ||
                        like?.image ||
                        like?.price !== undefined;
                    return (
                        type === "card" ||
                        type === "cards" ||
                        type === "product" ||
                        type === "products" ||
                        like?.card ||
                        hasCardFields
                    );
                });

                const items = cardLikes.map(buildWishlistItemFromLike);
                if (mounted) {
                    setWishlistItems(items);
                }
                saveWishlistItems(items);
            } catch (error) {
                console.warn("Wishlist sync failed:", error);
            }
        };

        syncWishlistFromServer();
        const intervalId = setInterval(syncWishlistFromServer, 2000);
        const handleFocus = () => syncWishlistFromServer();
        window.addEventListener("focus", handleFocus);
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                syncWishlistFromServer();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            mounted = false;
            clearInterval(intervalId);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [currentUserId]);

    const handleRemove = async (productId) => {
        if (currentUserId) {
            try {
                await fetch(`${API_BASE}/api/likes/${productId}?userId=${currentUserId}`, { method: "DELETE" });
            } catch (error) {
                console.warn("Like delete failed:", error);
            }
        }

        const updatedWishlist = wishlistItems.filter((item) => item.id !== productId);
        setWishlistItems(updatedWishlist);
        saveWishlistItems(updatedWishlist);
    };

    const handleMoveToCart = async (product) => {
        const savedCart = getCartItems();

        const newItem = {
            id: product.id,
            name: product.name || product.title,
            price: product.newPrice || product.price,
            quantity: 1,
            image: product.img || product.image,
        };

        const exists = savedCart.find((item) => item.id === product.id);

        if (!exists) {
            const nextCart = [...savedCart, newItem];
            saveCartItems(nextCart);
            if (currentUserId) {
                try {
                    await fetch(`${API_BASE}/api/savat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: currentUserId,
                            productId: newItem.id,
                            itemName: newItem.name,
                            title: newItem.name,
                            quantity: 1,
                            unitPrice: newItem.price,
                            price: newItem.price,
                            imageUrl: newItem.image,
                            description: product.description || "",
                        }),
                    });
                } catch (error) {
                    console.warn("Cart sync failed:", error);
                }
            }
            alert(`${newItem.name} savatga qo'shildi!`);
        } else {
            alert(`${newItem.name} allaqachon savatda mavjud.`);
        }

        handleRemove(product.id);
    };

    const handleMoveAllToCart = async () => {
        if (wishlistItems.length === 0) return;

        let cartItems = getCartItems();
        let movedCount = 0;

        for (const item of wishlistItems) {
            const exists = cartItems.find((cartItem) => cartItem.id === item.id);
            if (!exists) {
                const newItem = {
                    id: item.id,
                    name: item.name || item.title,
                    price: item.newPrice || item.price,
                    quantity: 1,
                    image: item.img || item.image,
                };

                cartItems.push(newItem);
                movedCount++;

                if (currentUserId) {
                    try {
                        await fetch(`${API_BASE}/api/savat`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: currentUserId,
                                productId: newItem.id,
                                itemName: newItem.name,
                                title: newItem.name,
                                quantity: 1,
                                unitPrice: newItem.price,
                                price: newItem.price,
                                imageUrl: newItem.image,
                                description: item.description || "",
                            }),
                        });
                    } catch (error) {
                        console.warn("Cart sync failed:", error);
                    }
                }
            }

            if (currentUserId) {
                fetch(`${API_BASE}/api/likes/${item.id}?userId=${currentUserId}`, { method: "DELETE" }).catch(() => {});
            }
        }

        saveCartItems(cartItems);
        setWishlistItems([]);
        clearScopedItems("wishlistItems", currentUserId);

        alert(`${movedCount} ta mahsulot savatga o'tkazildi!`);
    };

    const WishlistCard = ({ item }) => (
        <div className="wishlist-card">
            <div className="wishlist-image-box">
                <span className="discount-badge">-{item.discount || 35}%</span>

                <div className="wishlist-icon-group">
                    <button
                        className="icon-btn remove-btn"
                        onClick={() => handleRemove(item.id)}
                    >
                        <Trash2 size={20} color="#000" />
                    </button>
                </div>

                <img src={item.img || item.image} alt={item.name || item.title} />

                <button
                    className="add-to-cart-btn-wishlist"
                    onClick={() => handleMoveToCart(item)}
                >
                    <ShoppingCart size={15} /> Add To Cart
                </button>
            </div>

            <h4 className="product-name-wishlist">{item.name || item.title}</h4>
            <div className="price-container-wishlist">
                <span className="current-price-wishlist">${(item.newPrice || item.price)?.toFixed(2)}</span>
                {item.oldPrice && <span className="old-price-wishlist">${item.oldPrice.toFixed(2)}</span>}
            </div>
        </div>
    );

    return (
        <div className="wishlist-container">
            <div className="wishlist-header">
                <h1>Wishlist ({wishlistItems.length})</h1>
                <button
                    className="move-all-btn"
                    onClick={handleMoveAllToCart}
                    disabled={wishlistItems.length === 0}
                >
                    Move All To Bag
                </button>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                        <WishlistCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <p className="empty-wishlist-message">
                    Your favorites list is empty. Add products!
                </p>
            )}

        </div>
    );
};

export default Wishlist;
