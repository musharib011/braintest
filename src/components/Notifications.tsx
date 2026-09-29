import React, { useEffect, useState } from 'react';

export interface Notification {
  id: number;
  type: 'xp' | 'coins' | 'combo' | 'achievement' | 'levelup' | 'streak' | 'perfect' | 'daily';
  message: string;
  icon?: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onRemove: (id: number) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-xs pointer-events-none">
      {notifications.map((n) => (
        <NotificationToast key={n.id} notification={n} onRemove={onRemove} />
      ))}
    </div>
  );
};

const NotificationToast: React.FC<{ notification: Notification; onRemove: (id: number) => void }> = ({ notification, onRemove }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(notification.id), 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const bgColor = {
    xp: 'from-indigo-500 to-purple-500',
    coins: 'from-yellow-500 to-amber-500',
    combo: 'from-orange-500 to-red-500',
    achievement: 'from-emerald-500 to-teal-500',
    levelup: 'from-pink-500 to-rose-500',
    streak: 'from-orange-500 to-yellow-500',
    perfect: 'from-purple-500 to-pink-500',
    daily: 'from-blue-500 to-cyan-500',
  }[notification.type];

  return (
    <div
      className={`
        bg-gradient-to-r ${bgColor} text-white px-4 py-2.5 rounded-xl shadow-lg
        transform transition-all duration-300 pointer-events-auto
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-center gap-2">
        {notification.icon && <span className="text-lg">{notification.icon}</span>}
        <span className="font-medium text-sm">{notification.message}</span>
      </div>
    </div>
  );
};
