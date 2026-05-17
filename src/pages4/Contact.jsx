import React, { useState } from 'react';
import { Phone, Mail } from "lucide-react";
import { createItem, resources } from "../api/resources";
import './Style.css'

function Contact() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsSubmitting(true);
        try {
            const phoneValue = formData.phone?.trim() || "";
            const payload = {
                name: formData.name,
                email: formData.email,
                subject: phoneValue,
                message: formData.message,
            };
            await createItem(resources.contacts, payload);
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (err) {
            const apiMessage = err?.data?.message || err?.message || "Saqlashda xatolik.";
            console.error("Contact submit failed:", err);
            setStatus({ type: 'error', message: apiMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-breadcrumb">
                <span>Home</span>
                <span className="divider">/</span>
                <span className="current">Contact</span>
            </div>

            <div className="contact-section-container">
                <div className="contact-info-block">
                    <div className="info-section">
                        <h3>
                            <span className="icon-wrap"><Phone size={16} /></span>
                            Call To Us
                        </h3>
                        <p>We are available 24/7, 7 days a week.</p>
                        <p><strong>Phone: +998 91 767 25 00</strong></p>
                    </div>

                    <hr />

                    <div className="info-section">
                        <h3>
                            <span className="icon-wrap"><Mail size={16} /></span>
                            Write To Us
                        </h3>
                        <p>Fill out our form and we will contact you within 24 hours.</p>
                        <p>Emails: <strong>customer@gmail.com</strong></p>
                        <p>Emails: <strong>support@gmail.com</strong></p>
                    </div>
                </div>

                <div className="contact-form-block">
                    <form onSubmit={handleSubmit} className="contact-form">
                        {status.message && (
                            <div className={`form-status ${status.type}`}>
                                {status.message}
                            </div>
                        )}
                        <div className="form-input-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name *"
                                value={formData.name || ''}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email *"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="phone"
                                placeholder="Your Phone *"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="8"
                            value={formData.message || ''}
                            onChange={handleChange}
                            required
                        ></textarea>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="send-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
