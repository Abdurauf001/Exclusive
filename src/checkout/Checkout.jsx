import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";
import { API_BASE, post } from "../api/client";
import { clearScopedItems, getCurrentUserId, readScopedItems } from "../auth/session";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = getCurrentUserId();
  const [form, setForm] = useState({
    firstName: "",
    company: "",
    street: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(Number(location.state?.discount ?? 0));
  const [saveInfo, setSaveInfo] = useState(true);

  const cartItems = useMemo(() => {
    const savedCart = readScopedItems("cartItems", currentUserId);
    return savedCart.map((item) => ({
      ...item,
      name: item.title || item.name,
      price: Number(item.price ?? item.newPrice ?? 0),
      quantity: Number(item.quantity ?? item.count ?? 1),
      image: item.image || item.img,
    }));
  }, [currentUserId]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedDiscount;
  const shipping = 0;
  const total = Math.max(subtotal - discount + shipping, 0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    const requiredFields = ["firstName", "street", "city", "phone", "email"];
    const hasMissingField = requiredFields.some((key) => !String(form[key] || "").trim());
    const parsedUserId = Number(currentUserId);
    const normalizedUserId = Number.isInteger(parsedUserId) && parsedUserId > 0 ? parsedUserId : null;

    if (cartItems.length === 0) {
      alert("Savatda mahsulot yo'q.");
      navigate("/savat");
      return;
    }

    if (hasMissingField) {
      alert("Iltimos, checkout formadagi majburiy joylarni to'ldiring.");
      return;
    }

    try {
      setPlacingOrder(true);
      const checkoutPayload = {
        firstName: form.firstName.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        phone: Number(form.phone.trim()),
        email: form.email.trim(),
        paymentMethod,
        subtotal,
        total,
        items: cartItems.map((item) => ({
          productId: item.id == null && item.productId == null ? null : Number(item.id ?? item.productId),
          name: item.name,
          image: item.image || "",
          price: Number(item.price ?? 0),
          quantity: Number(item.quantity ?? 1),
        })),
      };

      if (normalizedUserId != null) {
        checkoutPayload.userId = normalizedUserId;
      }

      if (form.company.trim()) {
        checkoutPayload.company = form.company.trim();
      }

      if (form.apartment.trim()) {
        checkoutPayload.apartment = form.apartment.trim();
      }

      if (couponCode.trim()) {
        checkoutPayload.couponCode = couponCode.trim();
      }

      if (discount > 0) {
        checkoutPayload.discount = discount;
      }

      if (saveInfo === false) {
        checkoutPayload.saveInfo = false;
      }

      await post("/api/checkouts", checkoutPayload);

      if (currentUserId) {
        const res = await fetch(`${API_BASE}/api/savat?userId=${currentUserId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            await Promise.all(
              data.map((item) =>
                fetch(`${API_BASE}/api/savat/${item.productId ?? item.id}?userId=${currentUserId}`, {
                  method: "DELETE",
                }).catch(() => {})
              )
            );
          }
        }
      }

      clearScopedItems("cartItems", currentUserId);
      alert(`Buyurtma qabul qilindi. Jami: $${total.toFixed(2)}`);
      navigate("/");
    } catch (error) {
      alert(error.message || "Checkout saqlanmadi.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleApplyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      alert("Coupon code kiriting.");
      return;
    }

    if (normalized === "FREE" || normalized === "ABDURAUF") {
      const nextDiscount = subtotal * 0.2;
      setAppliedDiscount(nextDiscount);
      alert(`Coupon qo'llandi. -$${nextDiscount.toFixed(2)}`);
    } else {
      setAppliedDiscount(0);
      alert("Coupon noto'g'ri.");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-breadcrumb">Account / My Account / Product / View Cart / <span>CheckOut</span></div>

      <div className="checkout-layout">
        <div className="checkout-form-card">
          <h1>Billing Details</h1>

          <div className="checkout-grid">
            <label>
              First Name<span>*</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} />
            </label>
            <label>
              Company Name
              <input name="company" value={form.company} onChange={handleChange} />
            </label>
            <label>
              Street Address<span>*</span>
              <input name="street" value={form.street} onChange={handleChange} />
            </label>
            <label>
              Apartment, floor, etc. (optional)
              <input name="apartment" value={form.apartment} onChange={handleChange} />
            </label>
            <label>
              Town/City<span>*</span>
              <input name="city" value={form.city} onChange={handleChange} />
            </label>
            <label>
              Phone Number<span>*</span>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Email Address<span>*</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </label>
          </div>

          <label className="checkout-save-info">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={() => setSaveInfo((prev) => !prev)}
            />
            <span>Save this information for faster check-out next time</span>
          </label>
        </div>

        <aside className="checkout-summary-card">
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <div className="checkout-item-left">
                  <img src={item.image} alt={item.name} />
                  <span>{item.name} x {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="checkout-total-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-total-row">
            <span>Shipping:</span>
            <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="checkout-total-row">
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="checkout-total-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="checkout-payment-box">
            <div className="checkout-payment-row">
              <label className="checkout-radio">
                <input
                  type="radio"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                <span>Bank</span>
              </label>
              <div className="checkout-payment-icons" aria-hidden="true">
                <span className="pay-chip bkash">bKash</span>
                <span className="pay-chip visa">VISA</span>
                <span className="pay-chip mc">Mastercard</span>
                <span className="pay-chip nagad">Nagad</span>
              </div>
            </div>
            <label className="checkout-radio">
              <input
                type="radio"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span>Cash on delivery</span>
            </label>
          </div>

          <div className="checkout-coupon-row">
            <input
              className="checkout-coupon-input"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
            />
            <button type="button" className="apply-coupon-btn" onClick={handleApplyCoupon}>
              Apply Coupon
            </button>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder} disabled={placingOrder}>
            {placingOrder ? "Processing..." : "Place Order"}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
