import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Notifications.css';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchNotifications();
    }
  }, [user, isOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/${user.uid}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications-container">
      <button onClick={() => setIsOpen(!isOpen)} className="notifications-trigger">
        <Bell size={22} />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="notifications-dropdown"
          >
            <div className="dropdown-header">Your Notifications</div>
            {notifications.length > 0 ? (
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <p className="notification-message">{notification.message}</p>
                    <button onClick={() => markAsRead(notification.id)} className="mark-read-btn">
                      <Check size={16} /> Mark as Read
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-notifications">No new notifications.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
