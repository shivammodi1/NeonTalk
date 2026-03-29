# ⚡ NeonTalk

> **encrypted • real-time • open**

A modern real-time chat application built with React, Redux, Socket.io, and Node.js.

🔗 **Live Demo:** [https://neontalk-f640.onrender.com](https://neontalk-f640.onrender.com)

---

## ✨ Features

- 🔐 JWT Authentication (Signup / Login / Logout)
- 💬 Real-time messaging via Socket.io
- 🖼️ Image sharing in chat
- 😄 Emoji picker
- 🟢 Online / Offline user status
- 👤 Profile management (name + avatar)
- 📱 Fully responsive (mobile + desktop)
- 🔍 User search

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|------|-------|
| React | UI framework |
| Redux Toolkit | State management |
| Tailwind CSS | Styling |
| Socket.io Client | Real-time communication |
| Axios | HTTP requests |
| React Router | Navigation |
| DM Mono + Syne | Typography |

### Backend
| Tech | Usage |
|------|-------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| Socket.io | WebSockets |
| JWT | Authentication |
| Cloudinary | Image uploads |
| Bcrypt | Password hashing |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── component/
│   │   ├── SideBar.jsx
│   │   └── MessageArea.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   └── Profile.jsx
│   ├── redux/
│   │   ├── store.js
│   │   ├── userSlice.js
│   │   └── messageSlice.js
│   ├── socket.js
│   └── App.jsx

backend/
├── controllers/
├── models/
├── routes/
├── middleware/
└── server.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB URI
- Cloudinary account

### Installation

```bash
# Clone the repo
git clone https://github.com/shivammodi1/NeonTalk.git
cd neontalk
```

```bash
# Install backend dependencies
cd backend
npm install
```

```bash
# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run Locally

```bash
# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

---

## 🔧 Redux Store Setup

Socket.io instance is stored **outside Redux** to avoid serialization warnings:

```js
// socket.js
let socket = null;
export const setSocket = (s) => { socket = s; };
export const getSocket = () => socket;
export const clearSocket = () => { socket = null; };
```

```js
// store.js
export const store = configureStore({
  reducer: { user: userReducer, message: messageReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
```

---

## 📦 Deployment

This app is deployed on **Render** (free tier).

> ⚠️ Note: Free tier has a cold start delay of ~30 seconds on first load.

---

## 👨‍💻 Author

Built with ❤️ by Shivam Modi

---

## 📄 License

MIT License — feel free to use and modify.
