const notifications = {
    notifications_open : false,
    notifications: []
};

const NotificationReducer = (state = notifications, action) => {
    switch (action.type) {
        case 'NOTIFICATION_OPEN' :
            return {
                ...state,
                'notifications_open' : action.open
            };

        case 'INJECT_NOTIFICATION' :
            // debugger
            const notifs = [...state.notifications];
            const nonewline = action.notif.replace(/\r?\n|\r/, '');
            const parsed = {
                "task_name": "Notification",
                "form_name" : "",
                "form_id" : "",
                "assigner" : "",
                "assignee" : "",
                "review_status": "",
                "raw_data": {},
                "description": JSON.parse(nonewline).message
            };
            notifs.push(parsed);
            return {
                ...state,
                'notifications' : notifs
            };

        default :
                return state
    }
};

export default NotificationReducer;