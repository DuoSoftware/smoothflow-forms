const uihelper = {
    _preload_shell_ : false
};

const UIHelperReducer = (state = uihelper, action) => {
    switch (action.type) {
        case 'PRELOAD_SHELL' :
            return {
                ...state,
                '_preload_shell_' : action.loader
            };

        default :
                return state
    }
};

export default UIHelperReducer;