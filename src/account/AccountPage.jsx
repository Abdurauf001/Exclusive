import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import "./AccountPage.css";
import { getCurrentUser, clearCurrentUser, setCurrentUser } from "../auth/session";
import { resources, updateItem } from "../api/resources";
import { useNavigate } from "react-router-dom";

const ACCOUNT_DRAFT_KEY = "exclusive.accountDraft";

function readDraft() {
    try {
        return JSON.parse(localStorage.getItem(ACCOUNT_DRAFT_KEY) || "{}");
    } catch {
        return {};
    }
}

const AccountPage = ({ isLogged, setIsLogged }) => {
    const navigate = useNavigate();
    const sessionUser = useMemo(() => getCurrentUser(), [isLogged]);
    const sessionDraft = useMemo(() => readDraft(), [isLogged]);
    const [profile, setProfile] = useState(() => ({
        firstName: sessionUser?.firstName || sessionDraft?.firstName || "",
        lastName: sessionUser?.lastName || sessionDraft?.lastName || "",
        email: sessionUser?.email || sessionDraft?.email || "",
        address: sessionUser?.address || sessionDraft?.address || "",
    }));
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const menuItems = [
        { id: 'manage', title: 'Manage My Account', isMain: true },
        { id: 'profile', title: 'My Profile' },
        { id: 'address-book', title: 'Address Book' },
        { id: 'payment', title: 'My Payment Options' },
        { id: 'orders-main', title: 'My Orders', isMain: true },
        { id: 'returns', title: 'My Returns' },
        { id: 'cancellations', title: 'My Cancellations' },
        { id: 'wishlist-main', title: 'My Wishlist', isMain: true },
    ];

    const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!sessionUser?.id) {
            localStorage.setItem(ACCOUNT_DRAFT_KEY, JSON.stringify(profile));
            alert("Profile draft saved locally.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                fullName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || undefined,
                firstName: profile.firstName || undefined,
                lastName: profile.lastName || undefined,
                email: profile.email,
                address: profile.address || undefined,
            };

            let nextPassword = sessionUser.password || "";
            if (newPassword || confirmPassword || currentPassword) {
                if (!currentPassword || currentPassword !== (sessionUser.password || "")) {
                    alert("Current password is incorrect.");
                    setLoading(false);
                    return;
                }
                if (!newPassword || newPassword !== confirmPassword) {
                    alert("New passwords do not match.");
                    setLoading(false);
                    return;
                }
                payload.password = newPassword;
                nextPassword = newPassword;
            }

            const updated = await updateItem(resources.users, sessionUser.id, payload);
            setCurrentUser({ ...updated, password: nextPassword });
            localStorage.removeItem(ACCOUNT_DRAFT_KEY);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            alert("Profile updated successfully.");
        } catch (err) {
            const msg = err?.data?.message || err?.message || "Profilni saqlashda xatolik";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const draft = readDraft();
        const user = getCurrentUser();
        setProfile({
            firstName: user?.firstName || draft?.firstName || "",
            lastName: user?.lastName || draft?.lastName || "",
            email: user?.email || draft?.email || "",
            address: user?.address || draft?.address || "",
        });
    }, [isLogged]);

    const logout = () => {
        clearCurrentUser();
        setIsLogged(false);
        navigate("/");
    };

    const renderContent = () => {
        if (activeSection !== 'profile') {
            return (
                <div className="account-content-placeholder">
                    <h2>{menuItems.find((item) => item.id === activeSection)?.title || "Kontent"}</h2>
                    <p>Bu yerda "{menuItems.find((item) => item.id === activeSection)?.title}" bo'limining kontenti bo'ladi.</p>
                </div>
            );
        }

        return (
            <div className="edit-profile-form-container">
                <h2>Edit Your Profile</h2>
                <form onSubmit={handleSave}>
                    <div className="name-inputs">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            placeholder="Address"
                        />
                    </div>

                    <div className="password-update-section">
                        <div className="password-section-header">
                            <p>Password Changes</p>
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPasswords((value) => !value)}
                            >
                                {showPasswords ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                id="currentPassword"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                id="newPassword"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type={showPasswords ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        {isLogged && <button type="button" className="cancel-btn" onClick={logout}>Log Out</button>}
                        <button type="submit" className="save-btn" disabled={loading}>Save Changes</button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="account-page-container">
            <div className="breadcrumb">
                <span className="breadcrumb-link">Home</span>
                <ChevronRight size={16} />
                <span>My Account</span>
            </div>

            <div className="account-main-layout">
                <div className="account-sidebar">
                    <h4 className="welcome-text">
                        Welcome! {displayName ? <span className="user-name">{displayName}</span> : null}
                    </h4>

                    <div className="menu-list">
                        {menuItems.map((item) => (
                            <div key={item.id}>
                                {item.isMain && <p className="menu-main-title">{item.title}</p>}
                                {!item.isMain && (
                                    <button
                                        className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                                        onClick={() => setActiveSection(item.id)}
                                    >
                                        {item.title}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="account-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
