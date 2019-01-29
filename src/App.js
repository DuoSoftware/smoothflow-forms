import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import TopBar from "./_shell/topbar/sf_tf.topbar";
import Sidenav from "./_shell/sidenav/sf_tf.sidenav";
import Body from "./_shell/body/sf_tf.body";
import Formview from "./_containers/formview/sf_tf.formview.container";
import {
    InjectNotification, LoadForm, OpenGlobalNotifConnection, PreloadShell, SignIn, Tokens,
    User
} from "./core/actions";
import {KEY, UIHelper, UserService} from "./core/services";
import URLs from "./core/_urls_";
import Tabs from "./_components/Tab/tabs.widget";
import Tab from "./_components/Tab/tab.widget";
import Wrap from "./_components/COMMON/Wrap/_wrap";
import IoTClient from './core/lib/iot-client';
import {Message} from "./_components/COMMON/Message/message";
import AWS from 'aws-sdk'
import config from './config'
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js'

function TabContainer(props) {
    return (
        <Wrap>
            {props.children}
        </Wrap>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };

        const { classes } = this.props;
        const { value } = this.state;
    }

    // Dummy form id
    //id = 'rLxUdm';
    // https://kasun7.typeform.com/to/rLxUdm

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentDidMount = () => {
        const _t = UIHelper.getSatellizerToken();
        const urlParams = new URLSearchParams(window.location.search);
        const formID = urlParams.get('formId');
        if (_t) {
            this.props.dispatch(PreloadShell(true));
            this.props.dispatch(SignIn(true));
            UserService.getUserProfile()
                .then(profile => {
                    if (profile.data.IsSuccess) {
                        const _tokenParsed = UIHelper.parseJWT(_t);
                        const company = _tokenParsed.companyName;
                        const host = 'dev.smoothflow.io';   //window.location.host;

                        UserService.getUserSettings(URLs.auth.getUserSettings(host, company))
                            .then((settings) => {
                                profile.data.Result.settings = settings.data.Result;
                                this.props.dispatch(PreloadShell(false));
                                this.props.dispatch(User(profile.data.Result));
                            })
                            .catch(_errorRes => {
                                console.log(_errorRes);
                                this.props.dispatch(PreloadShell(false));
                                this.props.dispatch(User(profile.data.Result));
                            });

                    }
                })
                .catch(errorRes => {
                    console.log(errorRes);
                    this.props.dispatch(PreloadShell(false));
                });
        }
        if(formID) {
            this.props.dispatch(LoadForm('https://kasun7.typeform.com/to/' + formID));
        }

        /* AWS - IoT
        ================================================================== */
        const tokens = AWS.config.credentials;
        const _self = this;

        // cognito-idp.us-east-1.amazonaws.com/us-east-1_J98Pa2dIT
        function attachPrincipalPolicy(policyName, principal) {
            new AWS.Iot().attachPrincipalPolicy({ policyName: policyName, principal: principal }, function (err, data) {
                if (err) {
                    console.error(err); // an error occurred
                }
            });
        }

        //Generate loginKey
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.awsCognitoUserPoolId,
            ClientId: config.cognito.awsCognitoUserPoolAppClientId,
            Storage: new CookieStorage({
                secure: false,
                domain: "localhost"
            })
        });
        function getLoginKey() {
            const session = null;
            if(userPool) {
                const currentUser = userPool.getCurrentUser();
                if(currentUser) {
                    return currentUser.getSession(function(err, session) {
                        return session.getIdToken().getJwtToken();
                    });
                }
            }
        }

        let login = {};
        AWS.config.region = config.awsRegion;

        const session = getLoginKey();
        const loginKey = `cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognito.awsCognitoUserPoolId}`;
        login[loginKey] = session;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.cognito.awsCognitoIdentityPoolId,
            Logins: login
        });

        AWS.config.credentials.refresh((error) => {
            if (error) {
                console.error(error);
            } else {
                attachPrincipalPolicy("Server", AWS.config.credentials.identityId);
                // debugger
                let options = {
                    accessKeyId: AWS.config.credentials.accessKeyId,
                    secretKey: AWS.config.credentials.secretAccessKey,
                    sessionToken: AWS.config.credentials.sessionToken
                };
                _self.props.dispatch(Tokens(options));
                // debugger;
                let iotClient = new IoTClient(options);

                // Globally exposing the connection to use inside the entire app
                // this.props.dispatch(OpenGlobalNotifConnection(iotClient));

                // Retrieve global connection
                // const gIotClient = this.props.notifications.global_notif_connection;

                iotClient.onConnect(function () {
                    debugger;
                    console.log('connected.');
                    iotClient.subscribe('tasks');
                    // iotClient.publish('other/bina', "{'message':'Formss'}");
                });
                iotClient.onConnectionError(function () {
                    // debugger;
                });
                iotClient.onMessageReceived(function(topic, message) {
                    debugger
                    console.log(topic, message);
                    _self.props.dispatch(InjectNotification(message));
                });
                /* --------------------------------------------------------------- */
            }
        });
    };

    loadSelectedForm = (e, i) => {
        debugger
    };

    render() {
        return (
            <div className="App">
                <TopBar/>
                <div className="sf-tf-main-container">
                    <Sidenav/>
                    <Body>
                    {
                        !this.props.form.loaded_forms.length
                        ?   <Message>No form has been found</Message>
                        :   <Tabs>
                                {
                                    this.props.form.loaded_forms.map(form =>
                                        <Tab key={KEY()} iconClassName={'icon-class-0'} linkClassName={'link-class-0'} title={form.form_name}>
                                            <Formview form={ form.form_link }/>
                                        </Tab>
                                    )
                                }
                            </Tabs>
                    }
                    </Body>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    uihelper : state.uihelper,
    form: state.form,
    notifications: state.notifications
});
export default connect(mapStateToProps) (App);
