import React from 'react'
import './Style.css'

function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <h3>Exclusive</h3>
          <p>Subscribe</p>
          <p>Get 10% off your first order</p>
          <form>
            <input type="email" placeholder="Enter your email" />
            <button>→</button>
          </form>
        </div>

        <div>
          <h3>Support</h3>
          <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p>exclusive@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        <div>
          <h3 className='textt'>Account</h3>
          <ul className='ul-li'>
            <li><a href="#">My Account</a></li>
            <li><a href="#">Login / Register</a></li>
            <li><a href="#">Cart</a></li>
            <li><a href="#">Wishlist</a></li>
            <li><a href="#">Shop</a></li>
          </ul>
        </div>

        <div>
          <h3 className='textt'>Quick Link</h3>
          <ul className='ul-li'>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms Of Use</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3>Download App</h3>
          <p>Save $3 with App New User Only</p>
          <img src="./assets/Frame 719.png" className="qr" alt="QR Code" />
          <div className="app-buttons">
            <img src="./assets/Frame 741.png" alt="Google Play" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© Copyright Rimel 2022. All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer