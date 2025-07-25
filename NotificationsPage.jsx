import React, { useState } from 'react';

const initialNotifications = [
  { id: 1, message: 'Welcome to the site!', read: false },
  { id: 2, message: 'You have a new message.', read: false },
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.read ? 'normal' : 'bold' }}>
            {n.message}
            {!n.read && (
              <button onClick={() => markAsRead(n.id)}>Mark as read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsPage;