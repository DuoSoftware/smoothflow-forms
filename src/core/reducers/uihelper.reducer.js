const uihelper = {
    _preload_shell_ : false,
    _preload_workspaces_ : false,
    _preload_notif_ : false
};

const UIHelperReducer = (state = uihelper, action) => {
    switch (action.type) {
        case 'PRELOAD_SHELL' :
            return {
                ...state,
                '_preload_shell_' : action.loader
            };

        case 'PRELOAD_WORKSPACES' :
            return {
                ...state,
                '_preload_workspaces_' : action.loader
            };

        case 'PRELOAD_NOTIFICATIONS' :
            return {
                ...state,
                '_preload_notif_' : action.loader
            };

        default :
                return state
    }
};

export default UIHelperReducer;