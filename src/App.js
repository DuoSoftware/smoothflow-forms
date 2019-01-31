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
            // Logins: {
            //     "cognito-idp.us-east-1.amazonaws.com/us-east-1_J98Pa2dIT" : "eyJraWQiOiJyZVo2NElnSUNIRktUUlRcLzlzbjR4XC82UzRiR2tKVUJ2U0kxdmxnTmUyazQ9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxOTdmMjhlYy02Y2YwLTQxNDMtODkzOS02NzdjOTQyMGViMDQiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImN1c3RvbTpjb21wYW55X25hbWUiOiJrYXN1biIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0o5OFBhMmRJVCIsImNvZ25pdG86dXNlcm5hbWUiOiIxOTdmMjhlYy02Y2YwLTQxNDMtODkzOS02NzdjOTQyMGViMDQiLCJhdWQiOiIycG9kY2RrNms0MHZjdmdvN2tzMDAxdWN2MCIsImV2ZW50X2lkIjoiMDAwMmJjNTQtMjUxOS0xMWU5LWI1MTYtM2ZkZWE2Mzc0NTczIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NDg5MTI0OTEsIm5hbWUiOiJrYXN1bi53QGR1b3NvZnR3YXJlLmNvbSIsImV4cCI6MTU0ODkxNjA5MSwiaWF0IjoxNTQ4OTEyNDkxLCJlbWFpbCI6Imthc3VuLndAZHVvc29mdHdhcmUuY29tIn0.fric7RELkM9BXojfMhFMEjyapnMVNAk-I36oVetJqXjcnHUuK_tgMepmoUI1mdIRocYaaKtFsZc7XmBCndVfHuYK_Oil56nQPx3QgxNPIBZngqNt6ftTtu17XEl6VTv-X6qzUAILi9bxUpLpNHLoGzHcANdJSqd2l_CPI8hmQnv2FWzX5Rt4VGnCtcLOUL7fjFqBfmITVwsS5QYGSzhF0TEPcREVw6A6CQFSBtCzJzVyykGAxaVr8yBUfO-yLLpcjJiNwtqimXTbYe3tt2DyDQzuyhz9uQSvtdKwp4x-Q8kcP7XKY8zERAG4jy2LL2yX1DCui57Z9XuFWCJYzxw6Iw"
        // }
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
                // let options = {
                //     accessKeyId: "ASIASEMIASG467VNJRVC",
                //     secretKey: "ZnfSM30iVAMtqstLJ7MhDMbrsuzzdrCoyRpFtkht",
                //     sessionToken: "AgoGb3JpZ2luEIH//////////wEaCXVzLWVhc3QtMSKAAo+0Vqrqr+g7tsjHKXeyuffUEAw8uBYPK1TgqGxSzEn4XGgASkvArId89GL27a0Sz6cNv+wqHRsaR1mqLKGBB1QJitQ/GbVzLEFYl3+FdY0UP/O+aM2B+/5hMQn3/Oyx4kWAPy5AgNzPYGOsjPyBjCIV+ak3/h8uSZ1r4xWtRH1pD79JzjnOOuxUQJ8PnD6rptSzetXz3qyYCElrqQAuk76bYM1JvRRnVKPPe4O5GzyUMTeIyazbVhIrTce5FxFtyEAGZ78+sEYQFkY+lg+HfFlBzrn42C5Q4Ix7N7alZagG9UfEz48NEGG5qeKrLHn8SFcxIfSk0ddxD0W9DLTUPksqrwUIh///////////ARAAGgwxNDY4NTEwMDg5NTMiDM3bMZ91xBT1NfOWsSqDBaiz3st3TDHXme8qrb+NR4ZHxiGM3IGguT48tpZn5UX1hjVJdT/8oox4ERxjKebdJv5OUr1SCxoHPQcfZOnSf+l0PG5sJ3h/STIVtrfSmBADnOXZQ+T1atgHOTDU4XLgRyKio6SdI1Z/SIS5rcmEonH0uG5k/G6M7Yc94E5zXyJZolGIBHbiSIojpkElABrm4z2m7A7cjR6bri7pjZDJgAP1e9LAx3212oNQtJjRuo4dm6syBf57bEPoMo/NzaoTEUI/01wiMyZzCCP6TEWbvXxumIvD8QXNZHwmNxXfbDkP8lRQgDNPw/jA88DXYB8UZ/Rapcd+hwW7s7j5kIXEPVyUVTurJEsSX+KQKKlthO/h+YwJyd38ST9FoecPLVAp5HL+vT7zmdAWEYyz+NgtB4VZNZSwS6FxCkq6lgN8Nvdw9vkarqC60Uz11g/BHULe+8MMliqcNNOWGeTtSmodQ0OofGPR6vvfqgno+0pXq7F8bTE3vtM7FyIIA2/1lF8y5yxG8RzWWq2D+FHkh687ua5+Vpf1LJmNRoQ/0auSVtCQIsvrcWvefN2vvQciGxUoEAgmCTdYu78rz2bQeiNF2XwxrPfzSOxtj8qti22VIjy/6PLv1THXLN///3a157or8HomTxI0hJO7lDxtmCiRv4aKpPFqw7KGAeRHMSE7BYtKoa+LUO5+YBFHF1mmxW2URihUItHpfb9DW4Mrh+oPTPKoJFVQZ79eoYXcqxN6N6TEmnl0FOlxduHO1imBEQNqWJgMhrK6Ztak0RaWyOKM53SfWHbBEt1bnjtrFsug8U1NW7LWBUGFW4MieMPb7xnMllw4IDdAdN8qXrmFgF5jvekoojMw/ZHK4gU="
                // };
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
                    _self.notificationsManager(topic, msg);
                });
                /* --------------------------------------------------------------- */
            }
        });
    };

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

