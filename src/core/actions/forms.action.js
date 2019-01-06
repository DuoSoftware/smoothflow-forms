export const LoadForm = form => ({
    category: 'FORMS',
    type: 'LOAD_FORM',
    form
});

export const LoadWorkspaces = workspaces => ({
    category: 'FORMS',
    type: 'LOAD_WORKSPACES',
    workspaces
});

export const SelectedWorkspace = workspace => ({
    category: 'FORMS',
    type: 'SELECTED_WORKSPACE',
    workspace
});

export const ActiveForm = (form, index) => ({
    category: 'FORMS',
    type: 'ACTIVE_FORM',
    form,
    index
});

export const LoadedForms = forms => ({
    category: 'FORMS',
    type: 'LOADED_FORM',
    forms
});

