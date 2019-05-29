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
import config from './config/_awsconfig'
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js'
import toastr from 'react-redux-toastr';
import ReduxToastr from 'react-redux-toastr'
import openSocket from 'socket.io-client';
// const socket = openSocket('http://smoothflow.herokuapp.com');
import Amplify, { PubSub } from 'aws-amplify'
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import ampconfig from './core/lib/AWS_COG_CONFIG_COMMON__';
import ampconfigprod from './core/lib/AWS_COG_CONFIG_COMMON__PROD';

let awsc = null;
if (window.location.hostname == "localhost" ||
    window.location.hostname == "dev.smoothflow.io" ||
    window.location.hostname == "smoothflow-dev.s3-website-us-east-1.amazonaws.com" ||
    window.location.hostname == "d35ie0dhlww2mo.cloudfront.net") {
    awsc = ampconfig;
} else if (window.location.hostname == "smoothflow.io" ||
    window.location.hostname == "prod.smoothflow.io" ||
    window.location.hostname == "d3ored5mvntnxi.cloudfront.net") {
    awsc = ampconfigprod;
}

// Amplify.addPluggable(new AWSIoTProvider({
//     aws_pubsub_region: awsc.region,
//     aws_pubsub_endpoint: 'a3p10iauyn1h5f-ats.iot.us-east-1.amazonaws.com',
// }));

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

    componentDidMount() {
        // const _t = UIHelper.getSatellizerToken();
        Amplify.Auth.currentSession()
            .then(_ses => {
                this.props.dispatch(PreloadShell(true));
                const _sesuser = _ses.idToken.payload;
                UserService.getUserProfile()
                    .then(profile => {
                        if (profile.data.IsSuccess) {
                            profile.data.Result.given_name = _sesuser.given_name;
                            profile.data.Result.family_name = _sesuser.family_name;
                            this.props.dispatch(PreloadShell(false));
                            this.props.dispatch(User(profile.data.Result));
                            this.props.dispatch(SignIn(true));

                            this.continueIoTConfig(_ses.idToken.jwtToken);
                            // const company = _ses.idToken.jwtToken;
                            // const host = 'dev.smoothflow.io';   //window.location.host;
                            //
                            // UserService.getUserSettings(URLs.auth.getUserSettings(host, company))
                            //     .then((settings) => {
                            //         profile.data.Result.settings = settings.data.Result;
                            //         this.props.dispatch(PreloadShell(false));
                            //         this.props.dispatch(User(profile.data.Result));
                            //     })
                            //     .catch(_errorRes => {
                            //         this.props.dispatch(PreloadShell(false));
                            //         this.props.dispatch(User(profile.data.Result));
                            //     });

                        }
                    })
                    .catch(errorRes => {
                        this.props.dispatch(PreloadShell(false));
                    });
            })
            .catch(eres => {
                debugger
            })
        const urlParams = new URLSearchParams(window.location.search);
        const formID = urlParams.get('formId');
        if(formID) {
            this.props.dispatch(LoadForm('https://kasun7.typeform.com/to/' + formID));
        }

        /* AWS - IoT
        ================================================================== */
        // const tokens = AWS.config.credentials;
        // const _self = this;
        //
        // // cognito-idp.us-east-1.amazonaws.com/us-east-1_J98Pa2dIT
        // function attachPrincipalPolicy(policyName, principal) {
        //     new AWS.Iot().attachPrincipalPolicy({ policyName: policyName, principal: principal }, function (err, data) {
        //         if (err) {
        //             // console.error(err); // an error occurred
        //         }
        //     });
        // }
        //
        // //Generate loginKey
        // const userPool = new CognitoUserPool({
        //     UserPoolId: config.cognito.awsCognitoUserPoolId,
        //     ClientId: config.cognito.awsCognitoUserPoolAppClientId,
        //     Storage: new CookieStorage({
        //         secure: false,
        //         domain: "localhost"
        //     })
        // });
        // function getLoginKey() {
        //     const session = null;
        //     if(userPool) {
        //         const currentUser = userPool.getCurrentUser();
        //         if(currentUser) {
        //             return currentUser.getSession(function(err, session) {
        //                 return session.getIdToken().getJwtToken();
        //             });
        //         }
        //     }
        // }
        //
        // let login = {};
        // AWS.config.region = config.awsRegion;

        // const session = getLoginKey();
        // const loginKey = `cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognito.awsCognitoUserPoolId}`;
        // login[loginKey] = session;
        //
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId: config.cognito.awsCognitoIdentityPoolId,
        //     Logins: login
        // });
        //
        // AWS.config.credentials.refresh((error) => {
        //     if (error) {
        //         debugger
        //     } else {
        //         // attachPrincipalPolicy("Server", AWS.config.credentials.identityId);
        //         let options = {
        //             accessKeyId: AWS.config.credentials.accessKeyId,
        //             secretKey: AWS.config.credentials.secretAccessKey,
        //             sessionToken: AWS.config.credentials.sessionToken
        //         };
        //         // debugger;
        //         let iotClient = new IoTClient(options);
        //
        //         iotClient.onConnect(function () {
        //             debugger;
        //             console.log('connected.');
        //             iotClient.subscribe('tasks');
        //             // iotClient.publish('other/bina', "{'message':'Formss'}");
        //         });
        //         iotClient.onConnectionError(function () {
        //             debugger;
        //         });
        //         iotClient.onMessageReceived(function(topic, message) {
        //             debugger
        //             console.log(topic, message);
        //             const msg = JSON.parse(message);
        //             _self.notificationsManager(topic, msg);
        //         });
        //         /* --------------------------------------------------------------- */
        //     }
        // });

        // PubSub.subscribe('myTopic').subscribe({
        //     next: data => console.log('Message received', data),
        //     error: error => console.error(error),
        //     close: () => console.log('Done'),
        // });
    };
    attachPrincipalPolicy(policyName, principal) {
        debugger
        new AWS.Iot().attachPrincipalPolicy({ policyName: policyName, principal: principal }, function (err, data) {
            if (err) {
                console.log(err, err.stack);
            }
        });
    }
    continueIoTConfig(login) {
        const _self = this;
        Amplify.Auth.currentCredentials().then(res=>{
            AWS.config.region = config.awsRegion;
            let Login = {};
            const loginKey = `cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognito.awsCognitoUserPoolId}`;
            Login[loginKey] = login;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: config.cognito.awsCognitoIdentityPoolId,
                Logins: Login
            });

            AWS.config.credentials.refresh((error) => {
                if (error) {
                    debugger
                } else {
                    debugger
                    this.attachPrincipalPolicy("Server", res._identityId);
                    let options = {
                        accessKeyId: res.accessKeyId,
                        secretKey: res.data.Credentials.SecretKey,
                        sessionToken: res.sessionToken
                    };
                    debugger;
                    let iotClient = new IoTClient(options);

                    iotClient.onConnect(function (err) {
                        debugger;
                        console.log('connected.');
                        iotClient.subscribe('myTopic');
                        // iotClient.publish('other/bina', "{'message':'Formss'}");
                    });
                    iotClient.onConnectionError(function (err) {
                        debugger;
                    });
                    iotClient.onMessageReceived(function(topic, message) {
                        debugger
                        console.log(topic, message);
                        const msg = JSON.parse(message);
                        _self.notificationsManager(topic, msg);
                    });
                    /* --------------------------------------------------------------- */
                }
            });
        })

        // /* AWS - IoT
        // ================================================================== */
        // const tokens = AWS.config.credentials;
        //
        // // cognito-idp.us-east-1.amazonaws.com/us-east-1_J98Pa2dIT
        // function attachPrincipalPolicy(policyName, principal) {
        //     new AWS.Iot().attachPrincipalPolicy({ policyName: policyName, principal: principal }, function (err, data) {
        //         if (err) {
        //             // console.error(err); // an error occurred
        //         }
        //     });
        // }
        //
        // //Generate loginKey
        // const userPool = new CognitoUserPool({
        //     UserPoolId: config.cognito.awsCognitoUserPoolId,
        //     ClientId: config.cognito.awsCognitoUserPoolAppClientId
        // });
        // function getLoginKey() {
        //     const session = null;
        //     if(userPool) {
        //         const currentUser = userPool.getCurrentUser();
        //         if(currentUser) {
        //             return currentUser.getSession(function(err, session) {
        //                 return session.getIdToken().getJwtToken();
        //             });
        //         }
        //     }
        // }
        // AWS.config.region = config.awsRegion;
        //
        // let login = {};
        // const session = getLoginKey();
        // const loginKey = `cognito-idp.${config.awsRegion}.amazonaws.com/${config.cognito.awsCognitoUserPoolId}`;
        // login[loginKey] = session;
        //
        // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        //     IdentityPoolId: config.cognito.awsCognitoIdentityPoolId,
        //     Logins: login
        // });
        //
        // AWS.config.credentials.refresh((error) => {
        //     if (error) {
        //         debugger
        //     } else {
        //         debugger
        //         attachPrincipalPolicy("Server", AWS.config.credentials.identityId);
        //         let options = {
        //             accessKeyId: AWS.config.credentials.accessKeyId,
        //             secretKey: AWS.config.credentials.secretAccessKey,
        //             sessionToken: AWS.config.credentials.sessionToken
        //         };
        //         // debugger;
        //         let iotClient = new IoTClient(options);
        //
        //         iotClient.onConnect(function () {
        //             debugger;
        //             console.log('connected.');
        //             iotClient.subscribe('tasks');
        //             // iotClient.publish('other/bina', "{'message':'Formss'}");
        //         });
        //         iotClient.onConnectionError(function () {
        //             debugger;
        //         });
        //         iotClient.onMessageReceived(function(topic, message) {
        //             debugger
        //             console.log(topic, message);
        //             const msg = JSON.parse(message);
        //             _self.notificationsManager(topic, msg);
        //         });
        //         /* --------------------------------------------------------------- */
        //     }
        // });
    }

    notificationsManager (topic, message) {
        switch(message.data.type) {
            case 'task' :
                this.exportTaskNotifications(message, this.props.user.username);
                break;

            case 'notification' :
                const notif = {
                    name: message.data.name,
                    description: message.data.assignee + " has changed the status of " + message.data.name + " to " + message.data.status
                }
                this.props.dispatch(InjectNotification(notif));
                // toastr.info("Task Update", message.data.assignee + " has changed the status of " + message.data.name + " to " + message.data.status);
                break;
        }
    }

    exportTaskNotifications (message, username) {
        debugger
        let _allTasks = [...this.props.tasks.all_tasks];
        _allTasks.map(_t => {
            if(_t._id === message.data._id) {
                if(_t.assignee !== username) {
                    debugger
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
                            ?   <Message>Open a form from your left menu.</Message>
                            :   <Tabs>
                                    {
                                        this.props.form.loaded_forms.map(form =>
                                            <Tab key={KEY()} iconClassName={'icon-class-0'} linkClassName={'link-class-0'} title={form.form_name}>
                                                { form }
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
                    closeOnToastrClick />
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

