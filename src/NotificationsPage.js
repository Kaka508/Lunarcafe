import React, { useState, useEffect } from "react";

function getTodayNotifications(user) {
  const notifications = JSON.parse(localStorage.getItem(`notifications_${user}`) || "[]");
  const today = new Date().toISOString().slice(0, 10);
  return notifications.filter(n => n.announceAt.slice(0, 10) === today);
}

function saveNotifications(user, notifications) {
  localStorage.setItem(`notifications_${user}`, JSON.stringify(notifications));
}

function NotificationsPage({ user }) {
  const [notifications, setNotifications] = useState(getTodayNotifications(user));
  const [description, setDescription] = useState("");
  const [targetTime, setTargetTime] = useState("");

  useEffect(() => {
    // Live countdown and announcement
    const interval = setInterval(() => {
      setNotifications(prev =>
        prev.map(n => {
          const now = new Date();
          const announceAt = new Date(n.announceAt);
          if (!n.announced && now >= announceAt) {
            // Push notification
            if (window.Notification && Notification.permission === "granted") {
              new Notification("Announcement", { body: n.description });
            }
            n.announced = true;
            // Save updated status to localStorage
            const all = JSON.parse(localStorage.getItem(`notifications_${user}`) || "[]");
            const idx = all.findIndex(x => x.id === n.id);
            if (idx !== -1) all[idx].announced = true;
            saveNotifications(user, all);
          }
          return n;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setNotifications(getTodayNotifications(user));
  }, [user]);

  const addNotification = () => {
    if (notifications.length >= 3) {
      alert("Max 3 notifications per day!");
      return;
    }
    if (!description || !targetTime) {
      alert("Please fill all fields.");
      return;
    }
    const announceAt = new Date(targetTime);
    if (isNaN(announceAt.getTime())) {
      alert("Invalid time");
      return;
    }
    const newNotif = {
      id: Date.now(),
      description,
      announceAt: announceAt.toISOString(),
      createdAt: new Date().toISOString(),
      announced: false
    };
    const all = [...JSON.parse(localStorage.getItem(`notifications_${user}`) || "[]"), newNotif];
    saveNotifications(user, all);
    setNotifications(getTodayNotifications(user));
    setDescription("");
    setTargetTime("");
  };

  const getCountdown = announceAt => {
    const now = new Date();
    const target = new Date(announceAt);
    let diff = Math.floor((target - now) / 1000);
    if (diff < 0) diff = 0;
    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <h2>Today's Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.announced ? "normal" : "bold" }}>
            {n.description} <br />
            {n.announced ? "Announced!" : `Countdown: ${getCountdown(n.announceAt)}`}
          </li>
        ))}
      </ul>
      <h3>Add Notification</h3>
      <input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        value={targetTime}
        onChange={e => setTargetTime(e.target.value)}
      />
      <button onClick={addNotification}>Add</button>
    </div>
  );
}

export default NotificationsPage;