import React from 'react'
import './Style.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { get } from "../api/client";
import { setCurrentUser } from "../auth/session";

function SignUp2({ setIsLogged }) {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("f2");
    if (!form.checkValidity()) return form.reportValidity();

    const email = form.elements?.email?.value?.trim().toLowerCase() || "";
    const password = form.elements?.password?.value || "";
    if (!email || !password) return;

    try {
      const users = await get(`/api/users`);
      const list = Array.isArray(users) ? users : [];
      const found =
        list.find((u) => String(u.email || "").toLowerCase() === email.toLowerCase()) || null;
      if (!found) {
        alert("Account topilmadi. Sign up sahifasiga o'tyapsiz.");
        navigate(`/signup?email=${encodeURIComponent(email)}`);
        return;
      }
      if (!found.password || found.password !== password) {
        alert("Invalid email or password.");
        return;
      }

      setCurrentUser(found);
      setIsLogged(true);
      navigate("/account", { replace: true });
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Login xatolik";
      alert(msg);
    }
  };

  return (
    <>
      <div id="main">
        <div className="left">
          <img src="/assets/Side Image.png" alt="" />
        </div>
        <div className="right">
          <div className="frame759">
            <div className="text1">
              <h1>Log in to Exclusive</h1>
              <p>Enter your details below</p>
            </div>
            <form id='f2' onSubmit={handleSubmit}>
              <input name="email" type="email" placeholder='Email' required /><br />
              <input name="password" type="password" placeholder='Password' required /><br />
            </form>
            <div className="button">
              <button type="submit" form="f2" className="btn1">Log in</button>
              <Link target='_blank' to={'https://myaccount.google.com/signinoptions/password'}>
                <button className='btn2'>Forget Password?</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp2
