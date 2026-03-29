import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dp from "../assets/dp.png";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiEdit2, FiCalendar, FiMail, FiUser } from "react-icons/fi";
import { url } from "../App";
import { setUserData } from "../redux/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

  .profile-root {
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    background: #080c10;
    position: relative;
    overflow-x: hidden;
  }

  .profile-grid {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .profile-glow-1 {
    position: fixed;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,255,200,0.05) 0%, transparent 65%);
    top: -200px; left: -200px;
    pointer-events: none;
  }

  .profile-glow-2 {
    position: fixed;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%);
    bottom: -150px; right: -150px;
    pointer-events: none;
  }

  .back-btn {
    position: fixed;
    top: 20px; left: 20px;
    z-index: 20;
    background: rgba(0,255,200,0.06);
    border: 1px solid rgba(0,255,200,0.2);
    border-radius: 6px;
    padding: 8px 10px;
    cursor: pointer;
    color: #00ffc8;
    display: flex;
    align-items: center;
    transition: all 0.2s;
  }
  .back-btn:hover {
    background: rgba(0,255,200,0.12);
    box-shadow: 0 0 12px rgba(0,255,200,0.2);
  }

  .profile-container {
    position: relative;
    z-index: 10;
    max-width: 780px;
    margin: 0 auto;
    padding: 80px 24px 40px;
  }

  .profile-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .profile-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    background: linear-gradient(135deg, #00ffc8, #00b8ff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.03em;
  }

  .profile-sub {
    font-size: 0.65rem;
    color: rgba(0,255,200,0.4);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .profile-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(0,255,200,0.1);
    border-radius: 4px;
    padding: 36px;
    position: relative;
  }

  .profile-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,200,0.4), transparent);
  }

  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 36px;
  }

  .avatar-wrapper {
    position: relative;
    display: inline-block;
  }

  .avatar-img {
    width: 100px; height: 100px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid rgba(0,255,200,0.3);
    display: block;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }

  .avatar-edit-btn {
    position: absolute;
    bottom: -8px; right: -8px;
    background: linear-gradient(135deg, #00ffc8, #00b8ff);
    border: none;
    border-radius: 6px;
    padding: 6px;
    cursor: pointer;
    color: #080c10;
    display: flex;
    align-items: center;
    box-shadow: 0 0 12px rgba(0,255,200,0.3);
  }

  .avatar-handle {
    font-size: 0.72rem;
    color: rgba(0,255,200,0.4);
    margin-top: 16px;
    letter-spacing: 0.1em;
  }

  .fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 600px) {
    .fields-grid { grid-template-columns: 1fr; }
  }

  .field-group { display: flex; flex-direction: column; }

  .field-label {
    font-size: 0.6rem;
    color: rgba(0,255,200,0.45);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .field-input {
    background: rgba(0,255,200,0.04);
    border: 1px solid rgba(0,255,200,0.12);
    border-radius: 4px;
    padding: 11px 14px;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    outline: none;
    transition: all 0.2s;
  }

  .field-input:focus {
    border-color: rgba(0,255,200,0.4);
    background: rgba(0,255,200,0.07);
  }

  .field-input[readonly] {
    color: rgba(255,255,255,0.3);
    cursor: not-allowed;
    background: rgba(255,255,255,0.02);
    border-color: rgba(255,255,255,0.06);
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px;
    margin-bottom: 28px;
  }

  .stat-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 4px;
    padding: 14px;
  }

  .stat-label {
    font-size: 0.58rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .stat-value {
    font-size: 0.78rem;
    color: #e2e8f0;
    word-break: break-all;
  }

  .status-active {
    color: #00ffc8;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
  }

  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00ffc8;
    box-shadow: 0 0 6px #00ffc8;
  }

  .btn-row {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-edit {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 24px;
    background: rgba(0,255,200,0.07);
    border: 1px solid rgba(0,255,200,0.3);
    border-radius: 4px;
    color: #00ffc8;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .btn-edit:hover {
    background: rgba(0,255,200,0.13);
    box-shadow: 0 0 16px rgba(0,255,200,0.15);
  }

  .btn-save {
    padding: 11px 24px;
    background: rgba(0,255,200,0.12);
    border: 1px solid rgba(0,255,200,0.4);
    border-radius: 4px;
    color: #00ffc8;
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .btn-save:hover:not(:disabled) { box-shadow: 0 0 16px rgba(0,255,200,0.2); }
  .btn-save:disabled { opacity: 0.3; cursor: not-allowed; }

  .btn-cancel {
    padding: 11px 24px;
    background: rgba(255,60,60,0.07);
    border: 1px solid rgba(255,60,60,0.25);
    border-radius: 4px;
    color: rgba(255,100,100,0.8);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .btn-cancel:hover { background: rgba(255,60,60,0.12); }
`;

function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("File must be under 5MB"); return; }
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const hasChanges = () => name !== userData?.name || backendImage !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges()) { setIsEditing(false); return; }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) formData.append("image", backendImage);
      const token = localStorage.getItem("token");
      const res = await axios.put(`${url}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      dispatch(setUserData(res.data));
      setIsEditing(false);
      setBackendImage(null);
    } catch (error) {
      alert("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(userData?.name || "");
    setFrontendImage(userData?.image || dp);
    setBackendImage(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="profile-root">
        <div className="profile-grid" />
        <div className="profile-glow-1" />
        <div className="profile-glow-2" />

        <button className="back-btn" onClick={() => navigate("/")}>
          <IoIosArrowRoundBack size={22} />
        </button>

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-title">NeonTalk</div>
            <div className="profile-sub">// identity configuration</div>
          </div>

          <div className="profile-card">
            <form onSubmit={handleSubmit}>

              {/* AVATAR */}
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <img src={frontendImage} alt="profile" className="avatar-img" />
                  {isEditing && (
                    <>
                      <input type="file" hidden id="imageInput" accept="image/*" onChange={handleImageChange} />
                      <label htmlFor="imageInput" className="avatar-edit-btn">
                        <IoCameraOutline size={16} />
                      </label>
                    </>
                  )}
                </div>
                <div className="avatar-handle">@{userData?.userName}</div>
              </div>

              {/* FIELDS */}
              <div className="fields-grid">
                <div className="field-group">
                  <label className="field-label"><FiUser size={10} /> full_name</label>
                  <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} readOnly={!isEditing} />
                </div>
                <div className="field-group">
                  <label className="field-label"><FiUser size={10} /> username</label>
                  <input className="field-input" value={`@${userData?.userName}`} readOnly />
                </div>
                <div className="field-group">
                  <label className="field-label"><FiMail size={10} /> email</label>
                  <input className="field-input" value={userData?.email} readOnly />
                </div>
                <div className="field-group">
                  <label className="field-label"><FiCalendar size={10} /> member_since</label>
                  <input className="field-input" value={formatDate(userData?.createdAt)} readOnly />
                </div>
              </div>

              {/* STATS */}
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-label">account_id</div>
                  <div className="stat-value" style={{ fontSize: '0.68rem', opacity: 0.7 }}>{userData?._id}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">status</div>
                  <div className="status-active">
                    <div className="status-dot" />
                    active
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="btn-row">
                {!isEditing ? (
                  <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>
                    <FiEdit2 size={13} /> edit profile
                  </button>
                ) : (
                  <>
                    <button type="submit" className="btn-save" disabled={!hasChanges() || isSubmitting}>
                      {isSubmitting ? "saving..." : "→ save"}
                    </button>
                    <button type="button" className="btn-cancel" onClick={handleCancel}>cancel</button>
                  </>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;