import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../lib/api';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // We start with 0 unread, SignalR will push new notifications
    setUnreadCount(0);
    setNotifications([]);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/notification`)
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message: string) => {
      setNotifications(prev => [message, ...prev]);
      setUnreadCount(prev => prev + 1);
      // In a real app, trigger a toast notification here
    });

    connection.start()
      .then(() => console.log("SignalR Connected to Notification Hub"))
      .catch(err => console.error("SignalR Connection Error: ", err));

    return () => {
      connection.stop();
    };
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {notifications.map((msg, idx) => (
                  <li key={idx} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${idx < unreadCount ? 'bg-indigo-50/30' : ''}`}>
                    <p className="text-sm text-slate-800 line-clamp-2">{msg}</p>
                    <p className="text-xs text-slate-400 mt-1">Just now</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>
          <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 w-full p-2">
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
