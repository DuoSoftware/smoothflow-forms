export const User = user => ({
    category: 'AUTH',
    type: 'AUTH',
    user
});

export const SignIn = issignedin => ({
    category: 'AUTH',
    type: 'SIGNIN',
    issignedin
});

export const SignOut = user => ({
    category: 'AUTH',
    type: 'SIGNOUT',
    user
});

export const WorkspaceUsers = users => ({
    category: 'AUTH',
    type: 'GET_WORKSPACE_USERS',
    users
});