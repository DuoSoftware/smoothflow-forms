import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import TopBar from "./_shell/topbar/sf_tf.topbar";
import Sidenav from "./_shell/sidenav/sf_tf.sidenav";
import Body from "./_shell/body/sf_tf.body";
import Formview from "./_containers/formview/sf_tf.formview.container";
import {
    InjectNotification, InjectTask, LoadForm, OpenGlobalNotifConnection, PreloadShell, SignIn, TasksIotClient, Tokens,
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
import toastr from 'react-redux-toastr';
import ReduxToastr from 'react-redux-toastr'

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
                this.props.dispatch(TasksIotClient(iotClient));

                // Retrieve global connection
                const gIotClient = this.props.tasks.IotClient;

                gIotClient.onConnect(function () {
                    debugger;
                    console.log('connected.');
                    gIotClient.subscribe('tasks');
                    // iotClient.publish('other/bina', "{'message':'Formss'}");
                });
                gIotClient.onConnectionError(function () {
                    // debugger;
                });
                gIotClient.onMessageReceived(function(topic, message) {
                    debugger
                    console.log(topic, message);
                    const msg = JSON.parse(message);
                    this.notificationsManager(topic, msg);
                });
                /* --------------------------------------------------------------- */
            }
        });
    };

    notificationsManager (topic, message) {
        switch(topic) {
            case 'tasks' :
                this.exportTaskNotifications(message);
                break;

            case 'notification' :
                this.props.dispatch(InjectNotification(message));
                toastr.info("Task Update", message.assignee + " has changed the status of " + message.name + " to " + message.status);
                break;
        }
    }

    exportTaskNotifications (message) {
        const _task = JSON.parse(message);
        let _allTasks = [...this.props.tasks.all_tasks];
        _allTasks.map(_t => {
            if(_t._id === _task.data._id) {
                if(_t.assignee !== this.props.user.username) {
                    _t.locked = true;
                }
            }
        });
        this.props.dispatch(InjectTask(_allTasks));
    }

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
                <ReduxToastr
                    timeOut={4000}
                    newestOnTop={false}
                    preventDuplicates
                    position="top-right"
                    transitionIn="fadeIn"
                    transitionOut="fadeOut"
                    closeOnToastrClick/>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    uihelper : state.uihelper,
    user : state.user,
    form: state.form,
    notifications: state.notifications,
    tasks: state.tasks
});
export default connect(mapStateToProps) (App);

