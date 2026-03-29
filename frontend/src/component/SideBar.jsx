import React from "react";
import dp from "../assets/dp.png";
import { useSelector, useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import { FiSearch, FiZap } from "react-icons/fi";
import axios from "axios";
import { url } from "../App";
import { setOtherUsers, setSelectedUser, setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

  .sidebar-root {
    font-family: 'DM Mono', monospace;
    background: #080c10;
    border-right: 1px solid rgba(0, 255, 200, 0.12);
    position: relative;
    overflow: hidden;
  }

  .sidebar-root::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ffc8, transparent);
  }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #00ffc8 0%, #00b8ff 60%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-tag {
    font-size: 0.6rem;
    color: #00ffc8;
    opacity: 0.6;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .scan-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,200,0.4), transparent);
    animation: scan 4s linear infinite;
    pointer-events: none;
  }

  @keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.6;
    z-index: 0;
  }

  .glow-teal {
    position: absolute;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(0,255,200,0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .header-box {
    background: rgba(0, 255, 200, 0.03);
    border-bottom: 1px solid rgba(0, 255, 200, 0.1);
    padding: 20px;
    position: relative;
  }

  .user-avatar {
    width: 42px; height: 42px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid rgba(0, 255, 200, 0.3);
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  }

  .user-avatar:hover {
    border-color: #00ffc8;
    box-shadow: 0 0 12px rgba(0, 255, 200, 0.3);
  }

  .welcome-txt {
    font-size: 0.65rem;
    color: rgba(0, 255, 200, 0.5);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .username-txt {
    font-size: 0.9rem;
    color: #e2e8f0;
    font-weight: 500;
  }

  .search-box {
    background: rgba(0, 255, 200, 0.04);
    border: 1px solid rgba(0, 255, 200, 0.15);
    border-radius: 6px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 14px;
  }

  .search-box:hover, .search-box.active {
    border-color: rgba(0, 255, 200, 0.4);
    background: rgba(0, 255, 200, 0.07);
  }

  .search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    width: 100%;
  }

  .search-box input::placeholder {
    color: rgba(255,255,255,0.25);
  }

  .search-icon {
    color: rgba(0, 255, 200, 0.5);
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  .section-label {
    font-size: 0.55rem;
    color: rgba(0, 255, 200, 0.4);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 16px 20px 8px;
  }

  .user-card {
    margin: 0 12px 6px;
    padding: 12px 14px;
    border-radius: 6px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
    position: relative;
  }

  .user-card::before {
    content: '';
    position: absolute;
    left: 0; top: 50%;
    transform: translateY(-50%);
    width: 2px; height: 0;
    background: #00ffc8;
    border-radius: 0 2px 2px 0;
    transition: height 0.2s;
  }

  .user-card:hover {
    background: rgba(0, 255, 200, 0.05);
    border-color: rgba(0, 255, 200, 0.2);
  }

  .user-card:hover::before {
    height: 60%;
  }

  .user-card-avatar {
    width: 38px; height: 38px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
  }

  .user-name {
    font-size: 0.82rem;
    color: #e2e8f0;
    font-weight: 500;
  }

  .user-email {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .online-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00ffc8;
    box-shadow: 0 0 6px #00ffc8;
    flex-shrink: 0;
    margin-left: auto;
  }

  .logout-btn {
    margin: 12px;
    padding: 11px;
    border-radius: 6px;
    background: rgba(255, 60, 60, 0.06);
    border: 1px solid rgba(255, 60, 60, 0.2);
    color: rgba(255, 100, 100, 0.8);
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: calc(100% - 24px);
    transition: all 0.2s;
  }

  .logout-btn:hover {
    background: rgba(255, 60, 60, 0.12);
    border-color: rgba(255, 100, 100, 0.4);
    color: #ff6464;
  }

  .no-users {
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 0.78rem;
    margin-top: 40px;
    letter-spacing: 0.05em;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,200,0.2); border-radius: 3px; }
`;

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers } = useSelector((state) => state.user);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${url}/auth/logout`, { withCredentials: true });
      dispatch(setUserData(null));
      dispatch(setOtherUsers([]));
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const filteredUsers = otherUsers?.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <div
        className={`sidebar-root h-screen flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}
        style={{ width: '100%', maxWidth: '320px', minWidth: '260px' }}
      >
        <div className="noise-overlay" />
        <div className="scan-line" />
        <div className="glow-teal" style={{ top: '-80px', left: '-80px' }} />
        <div className="glow-teal" style={{ bottom: '-80px', right: '-80px' }} />

        {/* HEADER */}
        <div className="header-box" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div className="brand-name">NeonTalk</div>
              <div className="brand-tag">// encrypted • real-time</div>
            </div>
            <FiZap style={{ color: '#00ffc8', opacity: 0.6, fontSize: '1rem', marginTop: '4px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={userData?.image || dp}
              alt="profile"
              className="user-avatar"
              onClick={() => navigate("/profile")}
            />
            <div style={{ minWidth: 0 }}>
              <div className="welcome-txt">logged in as</div>
              <div className="username-txt">{userData?.name}</div>
            </div>
          </div>

          {/* SEARCH */}
          <div className={`search-box ${isSearchOpen ? 'active' : ''}`} onClick={() => !isSearchOpen && setIsSearchOpen(true)}>
            <FiSearch className="search-icon" />
            {isSearchOpen ? (
              <>
                <input
                  type="text"
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="search users..."
                />
                <IoClose
                  style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', flexShrink: 0 }}
                  onClick={(e) => { e.stopPropagation(); setIsSearchOpen(false); setSearchText(""); }}
                />
              </>
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>search users...</span>
            )}
          </div>
        </div>

        {/* USER LIST */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          <div className="section-label">— contacts ({filteredUsers?.length || 0})</div>

          {filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-card" onClick={() => dispatch(setSelectedUser(user))}>
                <img src={user.image || dp} alt="profile" className="user-card-avatar" />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                {onlineUsers?.includes(user._id) && <div className="online-dot" />}
              </div>
            ))
          ) : (
            <div className="no-users">no users found_</div>
          )}
        </div>

        {/* LOGOUT */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button className="logout-btn" onClick={handleLogOut}>
            <BiLogOutCircle size={16} />
            disconnect
          </button>
        </div>
      </div>
    </>
  );
}

export default SideBar;