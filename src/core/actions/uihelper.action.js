export const PreloadShell = loader => ({
    category : 'UIHELPER',
    type : 'PRELOAD_SHELL',
    loader
});

export const PreloadWorkspaces = loader => ({
    category : 'UIHELPER',
    type : 'PRELOAD_WORKSPACES',
    loader
});

export const PreloadNotifications = loader => ({
    category : 'UIHELPER',
    type : 'PRELOAD_NOTIFICATIONS',
    loader
});

export const ToggleXsSidenav = () => ({
    category : 'UIHELPER',
    type : 'SIDENAV_TOGGLE_XS'
});
