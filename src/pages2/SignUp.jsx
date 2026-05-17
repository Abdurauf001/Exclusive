import React from 'react'
import './Style.css'
import { Link } from 'react-router-dom'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createItem, resources } from "../api/resources";
import { setCurrentUser } from "../auth/session";

function SignUp({ setIsLogged }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("f1");
    if (!form.checkValidity()) return form.reportValidity();

    const fullName = form.elements?.fullName?.value?.trim() || "";
    const email = form.elements?.email?.value?.trim().toLowerCase() || "";
    const password = form.elements?.password?.value || "";
    if (!fullName || !email || !password) return;

    try {
      const user = await createItem(resources.users, { fullName, email, password });
      setCurrentUser({ ...user, password });
      setIsLogged(true);
      navigate("/account");
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Ro'yxatdan o'tishda xatolik";
      alert(msg);
    }
  };

  return (
    <>
      <div id="main">
        <div className="left">
          <img src="/public/assets/Side Image.png" alt="" />
        </div>
        <div className="right">
          <div className="frame759">
            <div className="text1">
              <h1>Create an account</h1>
              <p>Enter your details below</p>
            </div>
            <form id='f1'>
              <input name="fullName" type="text" placeholder='Name' required /><br />
              <input
                name="email"
                type="email"
                placeholder='Email'
                defaultValue={initialEmail}
                pattern="^[^\s@]+@gmail\.com$"
                title="Email @gmail.com bilan tugashi kerak"
                required
              /><br />
              <input name="password" type="password" placeholder='Password' required /><br />
            </form>
            <div className="button">
              <button onClick={handleSubmit} id='btn1' type='submit' form='f1'>Create Account</button><br />
              <a href="https://accounts.google.com/signup" target='_blank'><button id='btn2'><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png" alt="" /> Sign up with Google</button></a>
              <p>Already have account? <Link to={'/signup2'} >Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp
