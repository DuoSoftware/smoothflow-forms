import toastr from 'react-redux-toastr';

const notifications = {
    notifications_open : false,
    notifications: [],
    notifications_hidden: [],
    global_notif_connection : null,
    tokens: {}
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
            // const nonewline = action.notif.replace(/\r?\n|\r/, '');
            // debugger
            // const parsed = {
            //     "task_name": "Notification",
            //     "form_name" : "",
            //     "form_id" : "",
            //     "assigner" : "",
            //     "assignee" : "",
            //     "review_status": "",
            //     "raw_data": {},
            //     "description": JSON.parse(nonewline).message
            // };
            notifs.push(action.notif);
            return {
                ...state,
                'notifications' : notifs
            };

        case 'GLOBAL_CONNECTION' :
            return {
                ...state,
                'global_notif_connection' : action.connection
            };

        case 'TOKENS' :
            return {
                ...state,
                'tokens' : action.tokens
            };

        case 'REMOVE' :
            const _notifs = [...state.notifications];
            const _notifs_hidden = [...state.notifications_hidden];
            const i = _notifs.indexOf(action.notif);
            _notifs.splice(i, 1);
            _notifs_hidden.push(action.notif);
            return {
                ...state,
                'notifications' : _notifs,
                'notifications_hidden' : _notifs_hidden
            };

        default :
                return state
    }
};

export default NotificationReducer;