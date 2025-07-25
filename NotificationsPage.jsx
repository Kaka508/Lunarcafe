import React, { useState, useEffect } from 'react';

function getTodayNotifications() {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const today = new Date().toISOString().slice(0, 10);
  return notifications.filter(n => n.announceAt.slice(0, 10) === today);
}

function saveNotifications(notifications) {
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState(getTodayNotifications());
  const [description, setDescription] = useState('');
  const [targetTime, setTargetTime] = useState('');

  useEffect(() => {
    // Live countdown and announcement
    const interval = setInterval(() => {
      setNotifications(getTodayNotifications().map(n => {
        const now = new Date();
        const announceAt = new Date(n.announceAt);
        if (!n.announced && now >= announceAt) {
          // Push notification
          if (window.Notification && Notification.permission === 'granted') {
            new Notification('Announcement', { body: n.description });
          }
          n.announced = true;
          // Save updated status
          const all = JSON.parse(localStorage.getItem('notifications') || '[]');
          const index = all.findIndex(x => x.id === n.id);
          if (index !== -1) all[index].announced = true;
          saveNotifications(all);
        }
        return n;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = () => {
    if (notifications.length >= 3) {
      alert('Max 3 notifications per day!');
      return;
    }
    if (!description || !targetTime) {
      alert('Please fill all fields.');
      return;
    }
    const announceAt = new Date(targetTime);
    if (isNaN(announceAt.getTime())) {
      alert('Invalid time');
      return;
    }
    const newNotif = {
      id: Date.now(),
      description,
      announceAt: announceAt.toISOString(),
      createdAt: new Date().toISOString(),
      announced: false
    };
    const all = [...JSON.parse(localStorage.getItem('notifications') || '[]'), newNotif];
    saveNotifications(all);
    setNotifications(getTodayNotifications());
    setDescription('');
    setTargetTime('');
  };

  const getCountdown = (announceAt) => {
    const now = new Date();
    const target = new Date(announceAt);
    const diff = Math.max(0, target - now);
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <h2>Today's Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.announced ? 'normal' : 'bold' }}>
            {n.description} <br />
            {n.announced ? 'Announced!' : `Countdown: ${getCountdown(n.announceAt)}`}
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