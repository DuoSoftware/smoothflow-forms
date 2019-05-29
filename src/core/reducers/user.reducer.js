const initState = {
    Active: true,
    company: 0,
    created_at: "",
    sesuser : null,
    email: {
        contact: "",
        type: "email",
        display: "",
        verified: false
    },
    tenant: 1,
    updated_at: "",
    user_meta: {role: ""},
    username: "",
    _id: "",
    is_logged_in: false,
    workspace_users: []
};
const UserReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SIGNIN' :
            return {
                ...state,
                is_logged_in: action.issignedin
            };

        case 'AUTH' :
            return {
                ...state,
                sesuser : action.user
            };

        case 'SIGNOUT' :
            return {
                ...state,
                is_logged_in: false
            };

        case 'GET_MY_ACTIVITIES' :
            return {
                ...state,
                myactivities: action.activities
            };

        case 'USER_LOADER' :
            return {
                ...state,
                loading: action.loader
            };

        case 'GET_MY_INTEGRATIONS' :
            return {
                ...state,
                integrations: action.integrations
            };

        case 'GET_WORKSPACE_USERS' :
            return {
                ...state,
                workspace_users: action.users
            };

        default:
            return state
    }
}

export default UserReducer;