import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './core/reducers'
import axios from 'axios'
import URLs from './core/_urls_'
import {UIHelper} from "./core/services/uihelper.service";
import 'react-perfect-scrollbar/dist/css/styles.css';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './core/styles/overrides'
import Amplify from 'aws-amplify/lib/index'
import ampconfig from './core/lib/AWS_COG_CONFIG_COMMON__';

let _w, _t, _p = null;
const store = createStore(rootReducer);
const _scopes = localStorage.getItem('scopes');

if (_scopes) {
    _w = UIHelper.parseJWT(_scopes).tenant;
    _p = UIHelper.parseJWT(_scopes).company;
}
const awsc = ampconfig;
// const awsweb_parsed = JSON.parse(ampconfig);
Amplify.configure(awsc);

function fetchSession() {
    return Amplify.Auth.currentSession();
}

// HTTP config ----------------------------------------------------//
fetchSession().then(function (value) {
    _t = value.idToken.jwtToken;
    axios.defaults.baseURL = URLs.base;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + _t;
    axios.defaults.headers.common['companyInfo'] = _w + ':' + _p;

    ReactDOM.render(
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </Provider>
        , document.getElementById('root'));
}, function (reason) {
    ReactDOM.render(
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <App />
            </MuiThemeProvider>
        </Provider>
        , document.getElementById('root'));
});
// END - HTTP config ----------------------------------------------//

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// 32GT7mfASoBwCfQZZhT9HDxZ97ChVmbJX9mb5eXcd7Zx
