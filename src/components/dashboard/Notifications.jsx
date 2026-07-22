import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, CheckCheck, MessageSquare, Heart, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get(`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000')}/api/notifications`, config);
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
        console.error('Unexpected data format:', data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000')}/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000')}/api/notifications/read-all`, {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500 fill-red-500/20" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-500 fill-blue-500/20" />;
      default:
        return <Bell className="h-5 w-5 text-yellow-500 fill-yellow-500/20" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
        <p>{error}</p>
        <button 
          onClick={fetchNotifications}
          className="mt-4 px-4 py-2 bg-white dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all shrink-0"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-zinc-800 mb-4">
              <Bell className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications yet</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              When someone likes or comments on your blogs, you'll see it here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`relative flex gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                !notification.isRead 
                  ? 'bg-white dark:bg-zinc-900 border-yellow-200 dark:border-yellow-900/30 shadow-sm' 
                  : 'bg-gray-50/50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800/60'
              }`}
            >
              {/* Unread indicator */}
              {!notification.isRead && (
                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-500" />
              )}

              {/* Sender Avatar */}
              <div className="shrink-0">
                <Link to={`/author/${notification.sender?._id}`}>
                  <img
                    src={notification.sender?.avatar || 'https://via.placeholder.com/40'}
                    alt={notification.sender?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-zinc-800 shadow-sm hover:border-yellow-400 transition-colors"
                  />
                </Link>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <p className="text-sm text-gray-900 dark:text-zinc-100">
                    <Link 
                      to={`/author/${notification.sender?._id}`}
                      className="font-bold hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors"
                    >
                      {notification.sender?.name}
                    </Link>
                    {' '}
                    <span className="text-gray-600 dark:text-zinc-400">
                      {notification.type === 'like' ? 'liked your blog' : 'commented on your blog'}
                    </span>
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-500 shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>

                {notification.blog && (
                  <Link 
                    to={`/blog/${notification.blog._id}`}
                    className="block text-sm font-medium text-yellow-600 dark:text-yellow-500 hover:underline truncate mt-1"
                  >
                    "{notification.blog.title}"
                  </Link>
                )}
                
                {/* Type Icon Indicator */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700">
                    {getIcon(notification.type)}
                  </div>
                  
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
