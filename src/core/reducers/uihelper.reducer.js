const uihelper = {
    _preload_shell_ : false,
    _preload_workspaces_ : false,
    _preload_notif_ : false,
    _sidenav_xs_ : false
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

        case 'SIDENAV_TOGGLE_XS' :
            return {
                ...state,
                '_sidenav_xs_' : !state._sidenav_xs_
            };

        default :
                return state
    }
};

export default UIHelperReducer;