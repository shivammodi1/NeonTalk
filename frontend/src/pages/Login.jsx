import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { url } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

  .auth-root {
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    background: #080c10;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  .auth-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,200,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,200,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .auth-glow-1 {
    position: absolute;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(0,255,200,0.08) 0%, transparent 65%);
    top: -150px; left: -150px;
    pointer-events: none;
  }

  .auth-glow-2 {
    position: absolute;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%);
    bottom: -100px; right: -100px;
    pointer-events: none;
  }

  .auth-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    margin: 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(0,255,200,0.15);
    border-radius: 4px;
    padding: 40px;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  }

  .auth-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00ffc8, transparent);
  }

  .auth-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 20px; height: 20px;
    background: #00ffc8;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    opacity: 0.3;
  }

  .auth-brand {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    background: linear-gradient(135deg, #00ffc8, #00b8ff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.03em;
    text-align: center;
    margin-bottom: 4px;
  }

  .auth-subtitle {
    text-align: center;
    color: rgba(0,255,200,0.4);
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .field-label {
    font-size: 0.65rem;
    color: rgba(0,255,200,0.5);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: block;
  }

  .auth-input {
    width: 100%;
    background: rgba(0,255,200,0.04);
    border: 1px solid rgba(0,255,200,0.15);
    border-radius: 4px;
    padding: 12px 14px;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .auth-input:focus {
    border-color: rgba(0,255,200,0.45);
    background: rgba(0,255,200,0.07);
    box-shadow: 0 0 16px rgba(0,255,200,0.07);
  }

  .auth-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .field-group {
    margin-bottom: 16px;
  }

  .pw-wrapper {
    position: relative;
  }

  .pw-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: rgba(0,255,200,0.4);
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }

  .pw-toggle:hover { color: #00ffc8; }

  .auth-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, rgba(0,255,200,0.15), rgba(0,184,255,0.1));
    border: 1px solid rgba(0,255,200,0.35);
    border-radius: 4px;
    color: #00ffc8;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }

  .auth-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(0,255,200,0.22), rgba(0,184,255,0.16));
    box-shadow: 0 0 24px rgba(0,255,200,0.15);
  }

  .auth-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .auth-error {
    color: #ff6464;
    font-size: 0.72rem;
    text-align: center;
    margin-top: 4px;
    letter-spacing: 0.05em;
  }

  .auth-switch {
    text-align: center;
    margin-top: 24px;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.05em;
  }

  .auth-link {
    color: #00ffc8;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    text-decoration: none;
  }

  .auth-link:hover { opacity: 1; }

  .noise-overlay {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
    z-index: 0;
  }

  .corner-tag {
    position: absolute;
    bottom: -1px;
    left: -1px;
    width: 20px; height: 20px;
    border-left: 1px solid rgba(0,255,200,0.3);
    border-bottom: 1px solid rgba(0,255,200,0.3);
    border-radius: 0 0 0 3px;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${url}/auth/login`, { email, password }, { withCredentials: true });
      dispatch(setUserData(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-grid" />
        <div className="noise-overlay" />
        <div className="auth-glow-1" />
        <div className="auth-glow-2" />

        <div className="auth-card">
          <div className="corner-tag" />
          <div className="auth-brand">NeonTalk</div>
          <div className="auth-subtitle">// authenticate to connect</div>

          <form onSubmit={handleLogin}>
            <div className="field-group">
              <label className="field-label">email_address</label>
              <input className="auth-input" type="email" placeholder="user@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="field-group">
              <label className="field-label">password</label>
              <div className="pw-wrapper">
                <input className="auth-input" type={showPassword ? "text" : "password"} placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingRight: '40px' }} />
                <div className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>

            {error && <div className="auth-error">[error] {error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "authenticating..." : "→ login"}
            </button>
          </form>

          <div className="auth-switch">
            no account?{" "}
            <span className="auth-link" onClick={() => navigate("/signup")}>
              create one
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;