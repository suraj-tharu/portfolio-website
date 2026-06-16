// NotificationCenter - Premium notification system with toast notifications
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}

const typeConfig = {
    success: { icon: CheckCircle, color: '#22c55e', bg: 'bg-green-500/10' },
    error: { icon: AlertCircle, color: '#ef4444', bg: 'bg-red-500/10' },
    warning: { icon: AlertCircle, color: '#f59e0b', bg: 'bg-yellow-500/10' },
    info: { icon: Info, color: '#3b82f6', bg: 'bg-blue-500/10' }
};

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = useCallback((message: string, type: NotificationType = 'info', duration = 4000) => {
        const id = Math.random().toString(36);
        setNotifications(prev => [...prev, { id, message, type, duration }]);

        if (duration) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return { notify, removeNotification, notifications };
};

interface NotificationCenterProps {
    notifications: Notification[];
    onRemove: (id: string) => void;
}

export const NotificationCenter = ({ notifications, onRemove }: NotificationCenterProps) => {
    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notif) => {
                    const config = typeConfig[notif.type];
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: 400, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 400, scale: 0.9 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 ${config.bg} pointer-events-auto`}
                        >
                            <Icon size={20} style={{ color: config.color }} />
                            <span className="text-sm font-medium text-[var(--text)]">{notif.message}</span>
                            <motion.button
                                onClick={() => onRemove(notif.id)}
                                className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={16} />
                            </motion.button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
