const UIHelper = {
    UUID : () => {
        const uuid = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
        const hostname = window.location.hostname;
        let code = window.btoa(hostname + "-" + uuid);
        code = code.replace(/=/g, '');
        return code;
    },
    parseJWT: (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    },
    getSatellizerToken: () => {
        const cook = document.cookie.split('; ');
        for(const c of cook) {
            const a = c.split('=');
            if(a[0] === 'satellizer_token') {
                return c.split('=')[1];
            }
        }
        return null;
    }
};
const KEY = () => {
    return Math.floor((1 + Math.random()) * 0x1000)
        .toString(16)
        .substring(1);
};

export { UIHelper }
export { KEY }
