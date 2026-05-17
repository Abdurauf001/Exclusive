import React, { useEffect, useState } from "react";
import "./Style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Camera, Smartphone, Monitor, Headphones, Gamepad, Watch, Truck, RotateCcw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api/client";
import { getCurrentUserId, readScopedItems, writeScopedItems } from "../auth/session";

// ... (categories array o'zgarishsiz)
const categories = [
  { name: "Phones", icon: <Smartphone size={45} /> },
  { name: "Computers", icon: <Monitor size={45} /> },
  { name: "SmartWatch", icon: <Watch size={45} /> },
  { name: "Camera", icon: <Camera size={45} /> },
  { name: "HeadPhones", icon: <Headphones size={45} /> },
  { name: "Gaming", icon: <Gamepad size={45} /> },
];

const heroMenu = [
  { label: "Woman's Fashion", hasArrow: true },
  { label: "Men's Fashion", hasArrow: true },
  { label: "Electronics" },
  { label: "Home & Lifestyle" },
  { label: "Medicine" },
  { label: "Sports & Outdoor" },
  { label: "Baby's & Toys" },
  { label: "Groceries & Pets" },
  { label: "Health & Beauty" },
];

const heroSlides = [
  {
    imageUrl: "/assets/Frame 560.png",
    title: "slide1",
    link: "#",
    isActive: true,
    position: 1,
  },
  {
    imageUrl:
      "https://www.cnet.com/a/img/resize/2a4908544fc722ad20b47e22204894a5c09887d7/hub/2022/12/16/eb02a6aa-f331-4fbe-9e5f-35efd2198f8d/p1002240-1.jpg?auto=webp&fit=crop&height=675&width=1200",
    title: "slide2",
    link: "#",
    isActive: true,
    position: 2,
  },
  {
    imageUrl:
      "https://www.cnet.com/a/img/hub/2023/09/12/2d9d37cc-7d99-4f81-8da2-8f3a674f4243/screenshot-2023-09-12-at-10-38-30-am.png",
    title: "slide3",
    link: "#",
    isActive: true,
    position: 3,
  },
];

const FALLBACK_CARDS = [
  {
    id: 1,
    title: "Mechanical Keyboard RGB",
    description: "Custom mechanical keyboard with tactile switches.",
    imageUrl: "/assets/5d5c2e5250752d55f8b60f2aa2923183dadbc135.png",
    price: 120,
    discountPercent: 35,
    rating: { rate: 4.4, count: 88 },
  },
  {
    id: 2,
    title: "Red Dragon Gaming Monitor",
    description: "Curved gaming monitor with vivid contrast.",
    imageUrl: "/assets/e59d9f348cc24eeff489863523b63971c3ff8e4a.png",
    price: 370,
    discountPercent: 30,
    rating: { rate: 4.6, count: 71 },
  },
  {
    id: 3,
    title: "Nordic Fabric Chair",
    description: "Soft fabric chair with solid wooden legs.",
    imageUrl: "/assets/5e634682db5174aff99bb9337d2dc9598a0b44e4.png",
    price: 175,
    discountPercent: 25,
    rating: { rate: 4.1, count: 43 },
  },
  {
    id: 4,
    title: "Legion Gaming Laptop",
    description: "High-performance laptop for work and play.",
    imageUrl: "/assets/288da330273c46e1c3dc0a8915c4b031d0345347.png",
    price: 700,
    discountPercent: 20,
    rating: { rate: 4.7, count: 58 },
  },
  {
    id: 5,
    title: "Havit Wired Gamepad",
    description: "Classic red controller with responsive sticks.",
    imageUrl: "/assets/ee9a38001e9f94261b28e16ea21bacb4144473e8.png",
    price: 65,
    discountPercent: 40,
    rating: { rate: 4.2, count: 96 },
  },
  {
    id: 6,
    title: "Cesar Dog Food 12lb",
    description: "Tender pieces with real beef and veggies.",
    imageUrl: "/assets/4f3ca1d12722dbdf98f25179d3c0b785988c513d.png",
    price: 100,
    discountPercent: 15,
    rating: { rate: 4.3, count: 39 },
  },
  {
    id: 7,
    title: "Canon DSLR Camera",
    description: "Crisp detail with fast autofocus.",
    imageUrl: "/assets/6739d39dc218c97b645d616c8188a4f2e6aaf84b.png",
    price: 360,
    discountPercent: 25,
    rating: { rate: 4.5, count: 64 },
  },
  {
    id: 8,
    title: "Fantech Wireless Controller",
    description: "Smooth grip and responsive buttons.",
    imageUrl: "/assets/e86f6e872757d20a14861e2e0ebd4e9889693f59.png",
    price: 85,
    discountPercent: 30,
    rating: { rate: 4.4, count: 77 },
  },
  {
    id: 9,
    title: "Minimal Side Table",
    description: "Compact table for books and decor.",
    imageUrl: "/assets/78e727118c99fe72271cf43f5e3566b39ca7c8f4.jpg",
    price: 160,
    discountPercent: 20,
    rating: { rate: 4.0, count: 33 },
  },
  {
    id: 10,
    title: "RGB Liquid Cooler",
    description: "Dual-fan AIO with bright RGB lighting.",
    imageUrl: "/assets/e60892a4f0a3d5d144dce622c7338ec5be12908f.png",
    price: 140,
    discountPercent: 25,
    rating: { rate: 4.5, count: 52 },
  },
  {
    id: 11,
    title: "Waterproof Pink Jacket",
    description: "Lightweight jacket with hood and pockets.",
    imageUrl: "/assets/203be522b7b02d10672f6f6147762cf52bfcfc54.png",
    price: 260,
    discountPercent: 30,
    rating: { rate: 4.3, count: 45 },
  },
  {
    id: 12,
    title: "Designer Travel Bag",
    description: "Iconic patterned bag for travel and style.",
    imageUrl: "/assets/e7bdd11662ea1dfc2d615a5bb054e139a764f306.png",
    price: 960,
    discountPercent: 20,
    rating: { rate: 4.7, count: 81 },
  },
  {
    id: 13,
    title: "Football Boots Pro",
    description: "Speed-focused boots with strong grip.",
    imageUrl: "/assets/5f4ea9acf805319ddf3897fc9daaf58559542260.png",
    price: 160,
    discountPercent: 35,
    rating: { rate: 4.6, count: 68 },
  },
  {
    id: 14,
    title: "Classic Bomber Jacket",
    description: "Warm inner lining with clean silhouette.",
    imageUrl: "/assets/d0b7bb25884f6fdfc1357634d7d7b09e05755c2f.png",
    price: 500,
    discountPercent: 25,
    rating: { rate: 4.2, count: 40 },
  },
  {
    id: 15,
    title: "AMG Kids Ride-On",
    description: "Premium ride-on car with sporty design.",
    imageUrl: "/assets/288e013365fe639fccc1fe4168fca740ef1f85e7.png",
    price: 660,
    discountPercent: 30,
    rating: { rate: 4.4, count: 57 },
  },
  {
    id: 16,
    title: "Skincare Essentials Set",
    description: "Daily routine kit for clear, hydrated skin.",
    imageUrl: "/assets/04a1915fd6cedd7c8b1073685c5f1be1b50e1ac6.png",
    price: 200,
    discountPercent: 25,
    rating: { rate: 4.1, count: 36 },
  },
];

function normalizeProductCard(card) {
  const price = Number(card.price) || 0;
  const discountPercent = Number(card.discountPercent ?? card.discount ?? 35);
  const computedOldPrice =
    price > 0 ? Math.round((price / (1 - discountPercent / 100)) * 100) / 100 : 0;
  const oldPrice = Number(card.oldPrice) || computedOldPrice || price;
  const rating = card.rating || {
    rate: Number(card.rate ?? 0),
    count: Number(card.ratingCount ?? 0),
  };

  return {
    id: card.id,
    title: card.title,
    description: card.description,
    image: card.imageUrl || card.image,
    price,
    oldPrice,
    discountPercent,
    rating,
  };
}

function buildProductList(source, likedIds = new Set()) {
  return source.map((card) => {
    const normalizedCard = normalizeProductCard(card);
    return {
      ...normalizedCard,
      isLiked: likedIds.has(normalizedCard.id),
    };
  });
}

const INITIAL_FLASH_SALE_SECONDS = (3 * 24 * 60 * 60) + (23 * 60 * 60) + (19 * 60) + 56;

function formatFlashSaleTime(totalSeconds) {
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function Home({ searchText, onAddToWishlist, onAddToCart }) {

  // 1. Holatlar (States)
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  const [active, setActive] = useState("Camera");
  const [products, setProducts] = useState(() => buildProductList(FALLBACK_CARDS));
  const slides = heroSlides;
  const [showAll, setShowAll] = useState({
    container: false,
    copyContainer: false,
    cContainer: false,
    Container: false,
  });
  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_FLASH_SALE_SECONDS);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const [quickViewSize, setQuickViewSize] = useState("M");
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);
  const [quickHoverRating, setQuickHoverRating] = useState(0);
  const [userRatings, setUserRatings] = useState({});
  const [activeHeroSlideIndex, setActiveHeroSlideIndex] = useState(0);
  const isSearching = searchText.trim().length > 0;
  const time = formatFlashSaleTime(remainingSeconds);
  const getWishlistItems = () => readScopedItems("wishlistItems", currentUserId);
  const saveWishlistItems = (items) => writeScopedItems("wishlistItems", items, currentUserId);
  const getCartItems = () => readScopedItems("cartItems", currentUserId);
  const saveCartItems = (items) => writeScopedItems("cartItems", items, currentUserId);


  // --- Wishlist va Layk funksiyalari ---

  const syncLikeToServer = async (product, shouldLike) => {
    if (!product?.id || !currentUserId) return;

    try {
      if (shouldLike) {
        const res = await fetch(`${API_BASE}/api/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            targetType: "card",
            targetId: product.id,
            ...product,
            title: product.title || product.name,
            description: product.description,
            imageUrl: product.image || product.imageUrl,
            price: product.price,
          }),
        });
      } else {
        await fetch(`${API_BASE}/api/likes/${product.id}?userId=${currentUserId}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.warn("Like sync failed:", error);
    }
  };

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

  const syncLikesFromServer = async () => {
    if (!currentUserId) {
      const localLikes = getWishlistItems();
      const likeMap = new Map(localLikes.map((item) => [item.id, item]));
      setProducts((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => ({ ...item, isLiked: likeMap.has(item.id) }))
          : prev
      );
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

      const wishlistItems = cardLikes.map(buildWishlistItemFromLike);
      saveWishlistItems(wishlistItems);

      const likeMap = new Map(cardLikes.map((like) => [like.targetId ?? like.id, like]));

      setProducts((prev) =>
        Array.isArray(prev)
          ? prev.map((item) => {
              const like = likeMap.get(item.id);
              if (!like) {
                return { ...item, isLiked: false };
              }

              const card = like.card || {};
              const updated = { ...item, isLiked: true };

              if (card.title) updated.title = card.title;
              if (card.description) updated.description = card.description;
              if (card.imageUrl || card.image) updated.image = card.imageUrl || card.image;
              if (card.price !== undefined && card.price !== null) {
                updated.price = Number(card.price) || 0;
              }
              if (card.oldPrice !== undefined && card.oldPrice !== null) {
                updated.oldPrice = Number(card.oldPrice) || updated.oldPrice;
              }
              if (card.discountPercent !== undefined && card.discountPercent !== null) {
                updated.discountPercent = Number(card.discountPercent) || updated.discountPercent;
              } else if (card.discount !== undefined && card.discount !== null) {
                updated.discountPercent = Number(card.discount) || updated.discountPercent;
              }
              if (card.rating) updated.rating = card.rating;

              return updated;
            })
          : prev
      );
    } catch (error) {
      console.warn("Like sync failed:", error);
    }
  };

  // Wishlist holatini o'zgartirish va localStoragega saqlash
  const toggleLike = (product) => {

    // 1. Mahsulot holatini yangilash (isLiked)
    setProducts(prev =>
      prev.map(item =>
        item.id === product.id ? { ...item, isLiked: !item.isLiked } : item
      )
    );

    // 2. localStorage ni yangilash
    let wishlistItems = getWishlistItems();

    // toggleLike chaqirilganda, holat teskari bo'ladi, shuning uchun 'isCurrentlyLiked' FALSE bo'lsa, endi LIKE bo'ladi.
    const shouldLike = !product.isLiked;

    if (shouldLike) {
        // LIKE BOSILDI: Wishlistga qo'shamiz
        wishlistItems.push({
          id: product.id,
          name: product.title,
          img: product.image,
          newPrice: product.price,
          oldPrice: product.oldPrice,
          discount: product.discountPercent,
          isLiked: true
        });
      // alert(`${product.title} sevimlilar ro'yxatiga qo'shildi!`); // Alertlar o'chirildi
    } else {
      // UNLIKE BOSILDI: Wishlistdan o'chiramiz
      wishlistItems = wishlistItems.filter(item => item.id !== product.id);
      // alert(`${product.title} sevimlilar ro'yxatidan olib tashlandi!`); // Alertlar o'chirildi
    }

    saveWishlistItems(wishlistItems);
    syncLikeToServer(product, shouldLike).finally(syncLikesFromServer);
  };
  // --- Wishlist va Layk funksiyalari Tugadi ---


  const handleViewAll = (key) => {
    setShowAll(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    if (slides.length <= 1) {
      setActiveHeroSlideIndex(0);
      return;
    }

    const intervalId = setInterval(() => {
      setActiveHeroSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [slides]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingSeconds((prev) =>
        prev <= 1 ? INITIAL_FLASH_SALE_SECONDS : prev - 1
      );
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    try {
      const savedRatings = JSON.parse(localStorage.getItem("productRatings") || "{}");
      if (savedRatings && typeof savedRatings === "object") {
        setUserRatings(savedRatings);
      }
    } catch {
      setUserRatings({});
    }
  }, []);


  // Mahsulotlarni yuklash va Layk holatini sinxronlash
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cards`);
        if (!res.ok) {
          throw new Error(`Cards request failed: ${res.status}`);
        }
        const data = await res.json();
        const source = Array.isArray(data) ? data : [];

        if (!cancelled) {
          const likedIds = new Set(
            getWishlistItems().map(item => item.id)
          );
          const cardsToRender = source.length > 0 ? source : FALLBACK_CARDS;
          setProducts(buildProductList(cardsToRender, likedIds));
        }
      } catch (error) {
        console.error("Mahsulotlarni yuklashda xato:", error);
        if (!cancelled) {
          const likedIds = new Set(
            getWishlistItems().map(item => item.id)
          );
          setProducts(buildProductList(FALLBACK_CARDS, likedIds));
        }
      }
    };

    loadProducts();
    syncLikesFromServer();

    const onCardsUpdated = () => loadProducts();
    const onStorage = (e) => {
      if (e?.key === "exclusive.cardsUpdatedAt") {
        loadProducts();
      }
    };
    window.addEventListener("exclusive:cards", onCardsUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("exclusive:cards", onCardsUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    syncLikesFromServer();
    const intervalId = setInterval(syncLikesFromServer, 2000);

    const handleFocus = () => syncLikesFromServer();
    window.addEventListener("focus", handleFocus);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncLikesFromServer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);


  // Savatga qo'shish funksiyasi
  const syncCartItemToServer = async (itemWithQty) => {
    if (!itemWithQty?.id || !currentUserId) return;

    try {
      await fetch(`${API_BASE}/api/savat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          productId: itemWithQty.id,
          itemName: itemWithQty.title,
          quantity: itemWithQty.quantity,
          unitPrice: itemWithQty.price,
          imageUrl: itemWithQty.image,
          description: itemWithQty.description,
        }),
      });
    } catch (error) {
      console.warn("Savat sync failed:", error);
    }
  };

  const handleAddToCart = (item, quantityToAdd = 1) => {
    const cart = getCartItems();
    const existingIndex = cart.findIndex((c) => c.id === item.id);

    let nextQuantity = quantityToAdd;
    if (existingIndex !== -1) {
      const existing = cart[existingIndex];
      nextQuantity = Number(existing.quantity || 0) + quantityToAdd;
      cart[existingIndex] = {
        ...existing,
        quantity: nextQuantity,
      };
    } else {
      cart.push({
        id: item.id,
        name: item.title,
        price: item.price,
        img: item.image,
        quantity: quantityToAdd,
      });
    }

    saveCartItems(cart);
    syncCartItemToServer({ ...item, quantity: nextQuantity });
  };

  const openQuickView = (item) => {
    setQuickViewItem(item);
    setQuickViewQty(1);
    setQuickViewSize("M");
    setQuickViewImageIndex(0);
    setQuickHoverRating(0);
  };

  const closeQuickView = () => {
    setQuickViewItem(null);
    setQuickHoverRating(0);
  };

  const handleQuickToggleLike = () => {
    if (!quickViewItem) return;
    toggleLike(quickViewItem);
    setQuickViewItem((prev) => (prev ? { ...prev, isLiked: !prev.isLiked } : prev));
  };

  const increaseQuickQty = () => {
    setQuickViewQty((prev) => Math.min(prev + 1, 99));
  };

  const decreaseQuickQty = () => {
    setQuickViewQty((prev) => Math.max(prev - 1, 1));
  };

  const handleQuickBuyNow = () => {
   if (!quickViewItem) return;
   handleAddToCart(quickViewItem, quickViewQty);
   closeQuickView();
    navigate("/savat");
  };

  const quickViewImages = quickViewItem
    ? [quickViewItem.image, quickViewItem.image, quickViewItem.image, quickViewItem.image]
    : [];

  const getDisplayRating = (item) => {
    const custom = Number(userRatings[item.id]);
    if (Number.isFinite(custom) && custom > 0) return custom;
    return Number(item.rating?.rate || 0);
  };

  const getStarFillPercent = (ratingValue, starIndex) => {
    const fill = Math.max(0, Math.min(1, ratingValue - (starIndex - 1)));
    return fill * 100;
  };

  const updateUserRating = (productId, nextRating, currentDisplayRating) => {
    const normalized = Math.max(0.5, Math.min(5, Math.round(nextRating * 2) / 2));
    const current = Number.isFinite(currentDisplayRating) ? currentDisplayRating : normalized;
    const blended = Math.max(0.5, Math.min(5, Math.round(((current + normalized) / 2) * 2) / 2));

    setUserRatings((prev) => {
      const updated = { ...prev, [productId]: blended };
      localStorage.setItem("productRatings", JSON.stringify(updated));
      return updated;
    });

    return blended;
  };

  const handleQuickRatingHover = (star, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    setQuickHoverRating(isHalf ? star - 0.5 : star);
  };

  const handleQuickRatingClick = (star, event) => {
    if (!quickViewItem) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    const selected = isHalf ? star - 0.5 : star;
    const currentDisplay = getDisplayRating(quickViewItem);
    const blendedRating = updateUserRating(quickViewItem.id, selected, currentDisplay);
    setQuickHoverRating(blendedRating);
  };


  // Mahsulotlarni render qilish (Layk iconi tuzatildi)
  function renderItems(containerId) {
    const filtered =
      containerId === "container" && isSearching
        ? products.filter((p) =>
            (p.title || "").toLowerCase().includes(searchText.toLowerCase().trim())
          )
        : products;
    const list = filtered;
    const limit =
      isSearching && containerId === "container"
        ? list.length
        : showAll[containerId]
          ? list.length
          : 4;
    return list.slice(0, limit).map((item, idx) => (
      <div
        className="product-card"
        key={`${containerId}-${item.id}`}
        style={{ animationDelay: `${idx * 0.07}s` }}
      >
        <div className="product-media">
            <span className="discount-badge">-{item.discountPercent || 0}%</span>

          <div className="product-actions">
            <button
              type="button"
              className="icon-circle favorite-icon"
              onClick={() => toggleLike(item)}
              aria-label="Toggle wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 0 24 24"
                width="22px"
                fill={item.isLiked ? "red" : "none"}
                stroke={item.isLiked ? "red" : "black"}
                strokeWidth="1.5"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <button
              type="button"
              className="icon-circle preview-icon"
              aria-label="Preview"
              onClick={() => openQuickView(item)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="21px" viewBox="0 -960 960 960" width="21px" fill="#000">
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 272q-146 0-265-81.5T30-500q66-137 185-218.5T480-800q146 0 265 81.5T930-500q-66 137-185 218.5T480-120Z" />
              </svg>
            </button>
          </div>

          <img src={item.image} alt={item.title} />

          <button type="button" className="add-to-cart" onClick={() => handleAddToCart(item)}>
            Add To Cart
          </button>
        </div>

        <div className="product-info">
          <p className="product-title">{item.title}</p>
          <span className="price">${Number(item.price || 0).toFixed(2)}</span>
          {Number(item.oldPrice || 0) > Number(item.price || 0) && (
            <span className="old-price">${Number(item.oldPrice || 0).toFixed(2)}</span>
          )}
          <div className="product-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={`${item.id}-star-${star}`} className="rating-star">
                <span className="rating-star-base">★</span>
                <span
                  className="rating-star-fill"
                  style={{ width: `${getStarFillPercent(getDisplayRating(item), star)}%` }}
                >
                  ★
                </span>
              </span>
            ))}
            <span className="rating-count">({item.rating?.count || 0})</span>
          </div>
        </div>
      </div>
    ));
  }

  const quickViewModal = quickViewItem ? (
    <div className="quick-view-overlay" onClick={closeQuickView}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quick-close-btn" onClick={closeQuickView} aria-label="Close quick view">
          <X size={18} />
        </button>

        <div className="quick-view-gallery">
          <div className="quick-view-thumbs">
            {quickViewImages.map((img, index) => (
              <button
                key={`quick-thumb-${index}`}
                type="button"
                className={`quick-thumb ${quickViewImageIndex === index ? "active" : ""}`}
                onClick={() => setQuickViewImageIndex(index)}
              >
                <img src={img} alt={`${quickViewItem.title} ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="quick-main-image">
            <img src={quickViewImages[quickViewImageIndex]} alt={quickViewItem.title} />
          </div>
        </div>

        <div className="quick-view-details">
          <h2>{quickViewItem.title}</h2>

          <div className="quick-rating-row" onMouseLeave={() => setQuickHoverRating(0)}>
            <div className="quick-rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={`quick-star-${star}`}
                  className="quick-star-btn"
                  onMouseMove={(e) => handleQuickRatingHover(star, e)}
                  onClick={(e) => handleQuickRatingClick(star, e)}
                  aria-label={`Rate ${star} star`}
                >
                  <span className="rating-star quick">
                    <span className="rating-star-base">★</span>
                    <span
                      className="rating-star-fill"
                      style={{
                        width: `${getStarFillPercent(
                          quickHoverRating || getDisplayRating(quickViewItem),
                          star
                        )}%`,
                      }}
                    >
                      ★
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <span className="quick-rating-value">{getDisplayRating(quickViewItem).toFixed(1)}</span>
            <span className="quick-reviews">({quickViewItem.rating?.count || 0} Reviews)</span>
            <span className="quick-stock">In Stock</span>
          </div>

          <div className="quick-price">${Number(quickViewItem.price || 0).toFixed(2)}</div>
          <p className="quick-description">{quickViewItem.description}</p>

          <div className="quick-divider"></div>

          <div className="quick-option-row">
            <span className="quick-option-label">Colours:</span>
            <div className="quick-colors">
              <button type="button" className="quick-color active" aria-label="Color one"></button>
              <button type="button" className="quick-color quick-color-alt" aria-label="Color two"></button>
            </div>
          </div>

          <div className="quick-option-row">
            <span className="quick-option-label">Size:</span>
            <div className="quick-sizes">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`quick-size-btn ${quickViewSize === size ? "active" : ""}`}
                  onClick={() => setQuickViewSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quick-action-row">
            <div className="quick-qty-control">
              <button type="button" onClick={decreaseQuickQty}>-</button>
              <span>{quickViewQty}</span>
              <button type="button" onClick={increaseQuickQty}>+</button>
            </div>

            <button type="button" className="quick-buy-btn" onClick={handleQuickBuyNow}>
              Buy Now
            </button>

            <button type="button" className="quick-like-btn" onClick={handleQuickToggleLike} aria-label="Toggle wishlist">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 0 24 24"
                width="22px"
                fill={quickViewItem.isLiked ? "red" : "none"}
                stroke={quickViewItem.isLiked ? "red" : "black"}
                strokeWidth="1.5"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

      <div className="quick-shipping-box">
            <div className="quick-shipping-row">
              <Truck size={18} />
              <div>
                <h4>Free Delivery</h4>
                <p>Enter your postal code for Delivery Availability.</p>
              </div>
            </div>
            <div className="quick-shipping-row">
              <RotateCcw size={18} />
              <div>
                <h4>Return Delivery</h4>
                <p>Free 30 Days Delivery Returns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const renderHeroBlock = () => (
    <div className="home-hero">
      <aside className="home-hero-menu">
        {heroMenu.map((item) => (
          <button key={item.label} type="button" className="home-hero-menu-item">
            <span>{item.label}</span>
            {item.hasArrow ? <span className="home-hero-arrow">&gt;</span> : null}
          </button>
        ))}
      </aside>

      <div className="hero-slider-wrap">
        <div className="slider hero-slider">
          <div
            className="hero-slider-track"
            style={{ transform: `translateX(-${activeHeroSlideIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id ?? slide.imageUrl}
                className="hero-slide"
              >
                <a
                  href={slide.link || "#"}
                  target={slide.link && slide.link !== "#" ? "_blank" : undefined}
                  rel={slide.link && slide.link !== "#" ? "noreferrer" : undefined}
                  style={{ display: "block" }}
                >
                  <img
                    src={slide.imageUrl || slide.image}
                    alt={slide.title || "slide"}
                    className="hero-slider-image"
                  />
                </a>
              </div>
            ))}
          </div>
          <div className="hero-slider-dots">
            {slides.map((slide, index) => (
              <button
                key={`hero-dot-${slide.id ?? index}`}
                type="button"
                className={`hero-slider-dot ${index === activeHeroSlideIndex ? "active" : ""}`}
                aria-label={`Go to ${slide.title || `slide ${index + 1}`}`}
                onClick={() => setActiveHeroSlideIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isSearching) {
    const searchResultItems = renderItems("container");

    return (
      <>
        {renderHeroBlock()}

        <div className="by2">
          <div className="section-title-search">Search Results</div>
        </div>

        <div className="container search-results-container" id="container">
          {searchResultItems.length > 0 ? (
            searchResultItems
          ) : (
            <p style={{ width: "100%", textAlign: "center", padding: "28px 0" }}>
              No products found.
            </p>
          )}
        </div>

        {quickViewModal}
      </>
    );
  }
  return (
    <>
      {/* Qolgan barcha UI qismlari o'zgarishsiz */}
      {renderHeroBlock()}

      <div className="by2">
        <div className="section-title2">Todays</div>
      </div>

      <div className="containers">
        <div className="title">Flash Sales</div>
        <div className="countdown">
          <div className="time-box">
            <div className="label">Days</div>
            <span id="days">{time.days}</span>
          </div>
          <div className="colon">:</div>
          <div className="time-box">
            <div className="label">Hours</div>
            <span id="hours">{time.hours}</span>
          </div>
          <div className="colon">:</div>
          <div className="time-box">
            <div className="label">Minutes</div>
            <span id="minutes">{time.minutes}</span>
          </div>
          <div className="colon">:</div>
          <div className="time-box">
            <div className="label">Seconds</div>
            <span id="seconds">{time.seconds}</span>
          </div>
        </div>
      </div>

      <div className="container" id="container">
        {renderItems("container")}
      </div>


      <div className="btn2-box">
        <div className="btn-box">
          <button className="btn1" onClick={() => handleViewAll("container")}>
            View All Products
          </button>
        </div>
      </div>

      <div className="by">
        <div className="section-title">Categories</div>
        <h2>Browse By Category</h2>
      </div>

      <div className="category-container">
        <div className="category-list">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActive(cat.name)}
              className={`category-item ${active === cat.name ? "active" : ""}`}
            >
              <div className="category-icon">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="borderlar">
        <hr />
      </div>

      <div className="by2">
        <div className="section-title2">This Month</div>
      </div>

      <div className="containers">
        <div className="title">Best Selling Products</div>
        <button id="button2" onClick={() => handleViewAll("copyContainer")}>
          View All
        </button>
      </div>

      <div className="container" id="copyContainer">
        {renderItems("copyContainer")}
      </div>

      <div className="hero">
        <div className="left">
          <p className="cat">Categories</p>
          <h1>
            Enhance Your
            <br />
            Music Experience
          </h1>

          <div className="timer">
            <div>
              <span>23</span>
              <p>Days</p>
            </div>
            <div>
              <span>05</span>
              <p>Hours</p>
            </div>
            <div>
              <span>59</span>
              <p>Minutes</p>
            </div>
            <div>
              <span>35</span>
              <p>Seconds</p>
            </div>
          </div>

          <a href="#" className="btn">
            Buy Now!
          </a>
        </div>

        <div className="right">
          <img src="/assets/Frame 694.png" alt="JBL Speaker" />
        </div>
      </div>

      <div className="by">
        <div className="section-title">Our Products</div>
        <h2>Explore Our Products</h2>
      </div>

      <div className="container" id="Container">
        {renderItems("Container")}
      </div>

      <div className="container" id="cContainer">
        {renderItems("cContainer")}
      </div>

      <div className="btn2-box">
        <div className="btn-box">
          <button className="btn1" id="button3" onClick={() => handleViewAll("Container")}>
            View All Products
          </button>
        </div>
      </div>

      <div className="by">
        <div className="section-title">Featured</div>
        <h2>New Arrival</h2>
      </div>

      <div className="boox">
        <div className="leftt">
          <div className="text-stillari">
            <h3>PlayStation 5</h3>
            <p>
              Black and White version of the PS5 <br /> coming out on sale.
            </p>
            <a href="#" className="btn2">
              Shop Now
            </a>
          </div>
        </div>
        <div className="rightt">
          <div className="frame685">
            <h3>Womens Collections</h3>
            <p>
              Featured woman collections that <br /> give you another vibe.
            </p>
            <a href="#" className="btn2">
              Shop Now
            </a>
          </div>
          <div className="frame686">
            <h3>Speakers</h3>
            <p>Amazon wireless speakers</p>
            <a href="#" className="btn2">
              Shop Now
            </a>
          </div>
          <div className="frame687">
            <h3>Perfume</h3>
            <p>GUCCI INTENSE OUD EDP</p>
            <a href="#" className="btn2">
              Shop Now
            </a>
          </div>
        </div>
      </div>

      <div className="frame782">
        <div className="frame701">
          <img src="/assets/Services.png" alt="" />
          <h3>FREE AND FAST DELIVERY</h3>
          <p>Free delivery for all orders over $140</p>
        </div>
        <div className="frame702">
          <img src="/assets/Services (1).png" alt="" />
          <h3>24/7 CUSTOMER SERVICE</h3>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div className="frame703">
          <img src="/assets/Services (2).png" alt="" />
          <h3>MONEY BACK GUARANTEE</h3>
          <p>We return money within 30 days</p>
        </div>
      </div>

      {quickViewModal}
    </>
  );
}

export default Home;
