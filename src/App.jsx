import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NotFound from "./error/NotFound";
import Header from "./components/Header";
import Home from "./pages1/Home";
import Contact from "./pages4/Contact";
import About from "./pages3/About";
import SignUp from "./pages2/SignUp";
import SignUp2 from "./pages2+/SignUp2";
import Checkout from "./checkout/Checkout";

import Footer from "./components/Footer";
import Wishlist from './savat/WishList';
import AccountPage from './account/AccountPage';
import Savat from './like/Savat';
import { getCurrentUser } from "./auth/session";

function App() {
  let [searchText, setSearchText] = useState("");

  const [isLogged, setIsLogged] = useState(Boolean(getCurrentUser()));

  useEffect(() => {
    const onAuth = () => setIsLogged(Boolean(getCurrentUser()));
    window.addEventListener("exclusive:auth", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      window.removeEventListener("exclusive:auth", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, []);
  return (
    <>
      <Header isLogged={isLogged} setSearchText={setSearchText} />

      <Routes>
        <Route path="/" element={<Home searchText={searchText} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp setIsLogged={setIsLogged} />} />
        <Route path="/signup2" element={<SignUp2 setIsLogged={setIsLogged} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/savat" element={<Savat />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<AccountPage isLogged={isLogged} setIsLogged={setIsLogged} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer /> 
    </>
  );
}

export default App;
