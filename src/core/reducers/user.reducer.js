const initState = {
    Active: true,
    company: 0,
    created_at: "",
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
    is_logged_in: false
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
                username: action.user.username,
                _id: action.user._id,
                email: {
                    contact: action.user.email.contact
                }
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

        default:
            return state
    }
}

export default UserReducer;