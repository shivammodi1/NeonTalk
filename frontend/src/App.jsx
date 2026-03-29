import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import getCurrentUser from "./custom/getCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import getOtherUsers from "./custom/getOtherUsers";
import getMessages from "./custom/getMessages";
import { useEffect } from "react";
import { io } from "socket.io-client"; // Import Socket.IO client
import { setOnlineUsers, setSocket } from "./redux/userSlice";

export const url = "http://localhost:3000/api";

function App() {
  getCurrentUser();
  getOtherUsers();
  getMessages();

  const dispatch = useDispatch();

  const { userData, socket, onlineUsers } = useSelector((state) => state.user);

  // Initialize Socket.IO client and connect to the server
  useEffect(() => {
    if (!userData) {
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
      return;
    }
    const socketio = io("http://localhost:3000", {
      query: {
        userId: userData?._id,
      },
    });
    dispatch(setSocket(socketio));
    // get online users from the server
    socketio.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });
    return () => {
      socketio.close();
    };
  }, [userData]);

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/profile" />}
      />

      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />

      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
