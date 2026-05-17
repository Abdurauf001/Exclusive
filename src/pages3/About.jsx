import React from "react";
import girls from "../../public/assets/image.png";
import about1 from "../../public/assets/oqk.jpg";
import about2 from "../../public/assets/kostyumm.jpg";
import about3 from "../../public/assets/kostyum.jpg";
import './Style.css'

function About() {
  return (
    <>
      <div className="about-breadcrumb">
        <span>Home</span>
        <span>/</span>
        <span className="current">About</span>
      </div>

      <div className="box1">
        <div className="left1">
          <h1>Our Story</h1>
          <p>
            Launced in 2015, Exclusive is South Asia's premier online shopping
            makterplace with an active presense in Bangladesh. Supported by
            wide range of tailored marketing, data and service solutions,
            Exclusive has 10,500 sallers and 300 brands and serves 3 millioons
            customers across the region.
          </p>
          <p>
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assotment in categories
            ranging from consumer.
          </p>
        </div>
        <div className="right1">
          <img src={girls} alt="Our story" />
        </div>
      </div>

      <div className="box2">
        <div className="card">
          <div className="top">
            <img src="../../public/assets/uy.png" alt="" />
          </div>
          <div className="bottom">
            <h3>10.5k</h3>
            <p>Sallers active our site</p>
          </div>
        </div>
        <div className="card">
          <div className="top">
            <img src="../../public/assets/dollar.png" alt="" />
          </div>
          <div className="bottom">
            <h3>33k</h3>
            <p>Mopnthly Produduct Sale</p>
          </div>
        </div>
        <div className="card">
          <div className="top">
            <img src="../../public/assets/setka.png" alt="" />
          </div>
          <div className="bottom">
            <h3>45.5k</h3>
            <p>Customer active in our site</p>
          </div>
        </div>
        <div className="card">
          <div className="top">
            <img src="../../public/assets/dollar2.png" alt="" />
          </div>
          <div className="bottom">
            <h3>25k</h3>
            <p>Anual gross sale in our site</p>
          </div>
        </div>
      </div>

      <div className="box3">
        <div className="card1">
          <div className="top1">
            <img src="../../public/assets/1.png" alt="" />
          </div>
          <div className="bottom1">
            <h2>Tom Cruise</h2>
            <p>Founder & Chairman</p>
          </div>
        </div>
        <div className="card1">
          <div className="top1">
            <img src="../../public/assets/2.png" alt="" />
          </div>
          <div className="bottom1">
            <h2>Emma Watson</h2>
            <p>Managing Director</p>
          </div>
        </div>
        <div className="card1">
          <div className="top1">
            <img src="../../public/assets/3.png" alt="" />
          </div>
          <div className="bottom1">
            <h2>Will Smith</h2>
            <p>Product Designer</p>
          </div>
        </div>
      </div>

      <div className="frame782">
        <div className="frame701">
          <img src="./assets/Services.png" alt="" />
          <h3>FREE AND FAST DELIVERY</h3>
          <p>Free delivery for all orders over $140</p>
        </div>
        <div className="frame702">
          <img src="./assets/Services (1).png" alt="" />
          <h3>24/7 CUSTOMER SERVICE</h3>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div className="frame703">
          <img src="./assets/Services (2).png" alt="" />
          <h3>MONEY BACK GUARANTEE</h3>
          <p>We return money within 30 days</p>
        </div>
      </div>
    </>
  );
};

export default About;
