const form = {
    url: '',
    workspaces: [],
    selected_workspace: null,
    loaded_forms: [],
    active_form: null,
    active_form_index: null
};

const FormReducer = (state = form, action) => {
    switch (action.type) {
        case 'LOAD_FORM' :
            return {
                ...state,
                url: action.form
            };

        case 'LOAD_WORKSPACES' :
            return {
                ...state,
                workspaces: action.workspaces
            };

        case 'SELECTED_WORKSPACE' :
            return {
                ...state,
                selected_workspace: action.workspace
            };

        case 'ACTIVE_FORM' :
            return {
                ...state,
                active_form: action.form,
                active_form_index: action.index
            };

        case 'LOADED_FORM' :
            return {
                ...state,
                loaded_forms: action.forms
            };

        default :
            return state;
    }
};

export default FormReducer;