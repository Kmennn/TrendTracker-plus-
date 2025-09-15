import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

const notifications = [
  { id: 1, text: 'New trend "AI in Healthcare" is rapidly growing.', time: '15m ago', read: false },
  { id: 2, text: 'Your alert for "Sustainable Energy" was triggered.', time: '1h ago', read: false },
  { id: 3, text: 'A new report on "Quantum Computing" is available.', time: '3h ago', read: true },
  { id: 4, text: 'Welcome to TrendTracker! Get started by exploring trends.', time: '1d ago', read: true },
];

const NotificationPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-0 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h4 className="font-semibold text-white flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </h4>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-2">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  notif.read ? 'text-gray-400' : 'text-white bg-blue-500/10'
                }`}
              >
                <p className="text-sm">{notif.text}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
           <div className="p-2 border-t border-gray-700 text-center">
                <button className="text-sm text-blue-400 hover:underline">
                    Mark all as read
                </button>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;