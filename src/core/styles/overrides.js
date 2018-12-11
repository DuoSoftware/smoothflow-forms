import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    props: {
        MuiButtonBase: {
            disableRipple: true,
            minWidth: '100px'
        }
    },
    transitions: {
        create: () => 'none'
    }
});

export default theme;