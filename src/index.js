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

const store = createStore(rootReducer);
let _t = UIHelper.getSatellizerToken();

// HTTP config ----------------------------------------------------//
axios.defaults.baseURL = URLs.bot;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + _t;
// END - HTTP config ----------------------------------------------//

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// 32GT7mfASoBwCfQZZhT9HDxZ97ChVmbJX9mb5eXcd7Zx
