import React, { useState, useEffect } from "react";
import NotificationsPage from "./NotificationsPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (input.trim()) {
      localStorage.setItem("user", input.trim());
      setUser(input.trim());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
  };

  useEffect(() => {
    // Request notification permission on load
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="App">
      <h1>Lunarcafe Notifications</h1>
      {user ? (
        <>
          <p>Welcome, {user}! <button onClick={handleLogout}>Log out</button></p>
          <NotificationsPage user={user} />
        </>
      ) : (
        <div className="login">
          <input
            placeholder="Enter username"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          <button onClick={handleLogin}>Log In</button>
        </div>
      )}
    </div>
  );
}

export default App;