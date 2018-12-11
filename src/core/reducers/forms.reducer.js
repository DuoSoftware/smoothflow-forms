const form = {
    url: '',
};

const FormReducer = (state = form, action) => {
    switch (action.type) {
        case 'LOAD_FORM' :
            return {
                ...state,
                url: action.form
            };

        default :
            return state;
    }
};

export default FormReducer;