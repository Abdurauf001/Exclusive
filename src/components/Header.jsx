import { NavLink, Link } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import './Style.css'
import { readScopedItems } from "../auth/session";

function Header({ isLogged = false, setSearchText = () => {} }) {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const getItemCount = (key) => {
    return readScopedItems(key).length;
  };

  const refreshCounts = () => {
    setWishlistCount(getItemCount("wishlistItems"));
    setCartCount(getItemCount("cartItems"));
  };

  useEffect(() => {
    refreshCounts();

    const handleStorageChange = () => refreshCounts();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    window.addEventListener("exclusive:auth", handleStorageChange);

    const intervalId = setInterval(refreshCounts, 400);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
      window.removeEventListener("exclusive:auth", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  let divStyle = {
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <>
      <section>
        <nav className="nav">
          <h1>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</h1>
          <a href="#">ShopNow</a>
          <div className="select">
            <select style={divStyle}>
              <option>English</option>
              <option>O'zbek</option>
              <option>Русский</option>
            </select>
          </div>
        </nav>
      </section>

      <nav className="header-nav">
        <h1>Exclusive</h1>

        <div className="center-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "Link active" : ".Link"}>Home</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "Link active" : ".Link"}>Contact</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "Link active" : ".Link"}>About</NavLink>
          <NavLink to="/signup" className={({ isActive }) => isActive ? "Link active" : "Link"}>SignUp</NavLink>
        </div>

        <div className="end-nav">
          <div className="input-sourch">
            <input
              type="text"
              placeholder="What are you looking for?"
              onChange={(e) => setSearchText(e.target.value)}
            />

            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="black">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </div>

          {/* LIKE ICON */}
          <Link to="/wishlist" className="Link icon-link">
            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="black">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
            </svg>
            {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
          </Link>

          {/* SAVAT ICON + SONI */}
          <Link to="/savat" className="Link icon-link">
            <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#BB271"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </Link>

          {isLogged && (
            <Link to="/account" className="Link icon-link">
              <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="black"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
            </Link>
          )}

        </div>
      </nav>
    </>
  );
}

export default Header;
