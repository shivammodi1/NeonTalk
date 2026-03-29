import React, { useRef, useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import dp from "../assets/dp.png";
import { setSelectedUser } from "../redux/userSlice";
import { BsSendFill } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { url } from "../App";
import { setMessages, clearMessages } from "../redux/messageSlice";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');

  .msg-root {
    font-family: 'DM Mono', monospace;
    background: #080c10;
    background-image:
      radial-gradient(ellipse 60% 40% at 70% 20%, rgba(0,255,200,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 30% 80%, rgba(0,184,255,0.04) 0%, transparent 60%);
    position: relative;
  }

  .msg-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  .msg-header {
    background: rgba(8, 12, 16, 0.95);
    border-bottom: 1px solid rgba(0, 255, 200, 0.12);
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 10;
    backdrop-filter: blur(20px);
  }

  .msg-header::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,200,0.4), transparent);
  }

  .back-btn {
    background: rgba(0,255,200,0.06);
    border: 1px solid rgba(0,255,200,0.2);
    border-radius: 6px;
    padding: 6px 8px;
    cursor: pointer;
    color: #00ffc8;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .back-btn:hover {
    background: rgba(0,255,200,0.12);
    box-shadow: 0 0 12px rgba(0,255,200,0.2);
  }

  .header-avatar {
    width: 36px; height: 36px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid rgba(0,255,200,0.3);
    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
  }

  .header-name {
    font-size: 0.88rem;
    color: #e2e8f0;
    font-weight: 500;
  }

  .status-badge {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
  }

  .header-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    background: linear-gradient(135deg, #00ffc8, #00b8ff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-left: auto;
    margin-right: auto;
    letter-spacing: -0.02em;
  }

  .msg-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,255,200,0.2); border-radius: 3px; }

  .msg-bubble-me {
    max-width: 68%;
    align-self: flex-end;
    background: linear-gradient(135deg, rgba(0,255,200,0.15), rgba(0,184,255,0.1));
    border: 1px solid rgba(0,255,200,0.25);
    border-radius: 12px 12px 2px 12px;
    padding: 10px 14px;
    color: #e2e8f0;
    font-size: 0.82rem;
    line-height: 1.5;
    position: relative;
    box-shadow: 0 0 20px rgba(0,255,200,0.05);
  }

  .msg-bubble-other {
    max-width: 68%;
    align-self: flex-start;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px 12px 12px 2px;
    padding: 10px 14px;
    color: #b0bec5;
    font-size: 0.82rem;
    line-height: 1.5;
  }

  .msg-bubble-me::after {
    content: '';
    position: absolute;
    right: -1px; bottom: -1px;
    width: 8px; height: 8px;
    background: rgba(0,255,200,0.25);
    border-radius: 2px 0 0 0;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: rgba(255,255,255,0.15);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .empty-icon {
    font-size: 2rem;
    opacity: 0.3;
  }

  .input-area {
    padding: 14px 16px;
    border-top: 1px solid rgba(0,255,200,0.1);
    background: rgba(8,12,16,0.98);
    position: relative;
    z-index: 10;
    backdrop-filter: blur(20px);
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0,255,200,0.04);
    border: 1px solid rgba(0,255,200,0.15);
    border-radius: 8px;
    padding: 10px 14px;
    transition: border-color 0.2s;
  }

  .input-row:focus-within {
    border-color: rgba(0,255,200,0.35);
    box-shadow: 0 0 20px rgba(0,255,200,0.05);
  }

  .msg-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 0.82rem;
  }

  .msg-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(0,255,200,0.4);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color 0.2s;
    flex-shrink: 0;
  }

  .icon-btn:hover {
    color: #00ffc8;
  }

  .send-btn {
    background: linear-gradient(135deg, #00ffc8, #00b8ff);
    border: none;
    border-radius: 6px;
    padding: 8px 10px;
    cursor: pointer;
    color: #080c10;
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .send-btn:hover {
    box-shadow: 0 0 16px rgba(0,255,200,0.4);
    transform: translateY(-1px);
  }

  .preview-img {
    width: 32px; height: 32px;
    border-radius: 4px;
    object-fit: cover;
    border: 1px solid rgba(0,255,200,0.3);
    flex-shrink: 0;
    cursor: pointer;
  }

  .loading-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0,255,200,0.4);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .welcome-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    position: relative;
    z-index: 1;
  }

  .welcome-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.5rem;
    background: linear-gradient(135deg, #00ffc8, #00b8ff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.03em;
  }

  .welcome-sub {
    color: rgba(255,255,255,0.2);
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .welcome-hint {
    margin-top: 12px;
    padding: 10px 20px;
    border: 1px solid rgba(0,255,200,0.1);
    border-radius: 6px;
    color: rgba(0,255,200,0.35);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
  }

  .msg-time {
    font-size: 0.6rem;
    opacity: 0.35;
    margin-top: 4px;
    text-align: right;
  }
`;

function MessageArea() {
  const dispatch = useDispatch();
  const { selectedUser, userData, socket, onlineUsers } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);

  const [picker, setPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      if (!selectedUser) { dispatch(clearMessages()); return; }
      dispatch(clearMessages());
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${url}/msg/get/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (isMounted && result.data?.data) {
          dispatch(setMessages(Array.isArray(result.data.data) ? result.data.data : []));
        }
      } catch (error) {
        if (isMounted) dispatch(setMessages([]));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMessages();
    return () => { isMounted = false; };
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      if (!selectedUser) return;
      if (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id) {
        dispatch(setMessages([...(messages || []), newMessage]));
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => { socket.off("newMessage", handleNewMessage); };
  }, [socket, selectedUser, messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && !backendImage) return;
    if (!selectedUser) return;
    try {
      const formData = new FormData();
      formData.append("message", message);
      if (backendImage) formData.append("image", backendImage);
      const token = localStorage.getItem("token");
      const result = await axios.post(`${url}/msg/send/${selectedUser._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (result.data?.data) dispatch(setMessages([...messages, result.data.data]));
      setMessage(""); setFrontendImage(null); setBackendImage(null); setPicker(false);
    } catch (error) {
      console.log("SEND ERROR:", error);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{styles}</style>
      <div className={`msg-root flex-col h-screen ${selectedUser ? "flex" : "hidden md:flex"}`} style={{ flex: 1, minWidth: 0 }}>

        {/* HEADER */}
        <div className="msg-header">
          <button className="back-btn" onClick={() => dispatch(setSelectedUser(null))}>
            <IoIosArrowRoundBack size={20} />
          </button>

          {selectedUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={selectedUser?.image || dp} alt="profile" className="header-avatar" />
              <div>
                <div className="header-name">{selectedUser?.name}</div>
                <div className="status-badge">
                  <div
                    className="status-dot"
                    style={{
                      background: onlineUsers?.includes(selectedUser._id) ? '#00ffc8' : '#ff4444',
                      boxShadow: onlineUsers?.includes(selectedUser._id) ? '0 0 6px #00ffc8' : 'none'
                    }}
                  />
                  <span style={{ color: onlineUsers?.includes(selectedUser._id) ? '#00ffc8' : '#ff6464', opacity: 0.8 }}>
                    {onlineUsers?.includes(selectedUser._id) ? 'online' : 'offline'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="header-title">NeonTalk</div>
          )}
        </div>

        {/* BODY */}
        {!selectedUser ? (
          <div className="welcome-screen">
            <div className="welcome-logo">NeonTalk</div>
            <div className="welcome-sub">// encrypted • real-time • open</div>
            <div className="welcome-hint">← select a contact to start chatting</div>
          </div>
        ) : (
          <div className="msg-body">
            {loading ? (
              <div className="loading-state">loading transmission...</div>
            ) : messages?.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⬡</div>
                <div>no messages yet</div>
                <div style={{ opacity: 0.5 }}>start the conversation_</div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender === userData?._id;
                return (
                  <div key={msg._id || index} className={isMe ? "msg-bubble-me" : "msg-bubble-other"}>
                    {msg.message && <p>{msg.message}</p>}
                    {msg.image && (
                      <img src={msg.image} alt="msg" style={{ marginTop: '8px', borderRadius: '6px', maxHeight: '160px', border: '1px solid rgba(0,255,200,0.15)' }} />
                    )}
                    <div className="msg-time">{formatTime(msg.createdAt)}</div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* EMOJI PICKER */}
        {picker && (
          <div style={{ position: 'absolute', bottom: '80px', left: '16px', zIndex: 50 }}>
            <EmojiPicker onEmojiClick={(d) => setMessage(p => p + d.emoji)} theme="dark" />
          </div>
        )}

        {/* INPUT */}
        {selectedUser && (
          <div className="input-area">
            <form onSubmit={handleSendMessage}>
              <div className="input-row">
                {frontendImage && (
                  <div style={{ position: 'relative' }}>
                    <img src={frontendImage} alt="preview" className="preview-img" onClick={() => { setFrontendImage(null); setBackendImage(null); }} />
                    <IoClose style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#080c10', borderRadius: '50%', color: '#ff6464', fontSize: '0.7rem', cursor: 'pointer' }} onClick={() => { setFrontendImage(null); setBackendImage(null); }} />
                  </div>
                )}

                <button type="button" className="icon-btn" onClick={() => setPicker(!picker)}>
                  <MdOutlineEmojiEmotions />
                </button>

                <input type="file" accept="image/*" hidden ref={imageRef} onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) { setBackendImage(file); setFrontendImage(URL.createObjectURL(file)); }
                }} />

                <button type="button" className="icon-btn" onClick={() => imageRef.current.click()}>
                  <LuImagePlus />
                </button>

                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="type a message..."
                  className="msg-input"
                />

                <button type="submit" className="send-btn">
                  <BsSendFill />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default MessageArea;