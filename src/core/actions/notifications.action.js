export const OpenNotifications = open => ({
    category: 'NOTIFICATION',
    type: 'NOTIFICATION_OPEN',
    open
});

export const InjectNotification = notif => ({
    category: 'NOTIFICATION',
    type: 'INJECT_NOTIFICATION',
    notif
});