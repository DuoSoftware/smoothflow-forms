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
import config from './config/config'
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js'
import { toastr } from 'react-redux-toastr';
import ReduxToastr from 'react-redux-toastr'
import openSocket from 'socket.io-client';
// const socket = openSocket('http://smoothflow.herokuapp.com');

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
            //     "cognito-idp.us-east-1.amazonaws.com/us-east-1_J98Pa2dIT": "eyJraWQiOiJcL0xGMTZ3YUpNbkZxNzJHeVZaaGVyV3NrbkNLQkswbjdOVGMwREpyTTd6cz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOTdmMjhlYy02Y2YwLTQxNDMtODkzOS02NzdjOTQyMGViMDQiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xX2Y0NTk2MTRlLWMxMjQtNDZlMi05ODIyLTQyODQ3N2ExMTFmMCIsImV2ZW50X2lkIjoiNjU2MDhkZmYtMzQwOC0xMWU5LTgyM2EtMzlkMjUxOTczYmYyIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTU1MDU1NDYyNywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfSjk4UGEyZElUIiwiZXhwIjoxNTUwNTU4MjI3LCJpYXQiOjE1NTA1NTQ2MjcsImp0aSI6IjcyNTgxZTE0LWJjNjMtNGNhNC1iMTA2LTAyZjZkOTkwYjc3YSIsImNsaWVudF9pZCI6IjJwb2RjZGs2azQwdmN2Z283a3MwMDF1Y3YwIiwidXNlcm5hbWUiOiIxOTdmMjhlYy02Y2YwLTQxNDMtODkzOS02NzdjOTQyMGViMDQifQ.iDC2ngV53XigdCgrx504OwzS4x-iUOvgu15UHqzwW-fCZiU0xIV-vsh1orScIMD0aS8oUmFRMMGJkfWbpB0HrfHt1KgopVD41slS8MtaYJd3O4tDP3xw81lSCsTVy8BsnwG4B-OjUA1OIfHNJbgtv1d25IrHT8_qkenTQxgDFMEoI6WzIclKmzCoPUnktcboTcwdjXrtR9KjVqTL-bVM3JLZCTtmYcWAOCs-JHmMpWVoN_94Wrge5ICMlCQ2B0h9465hLqYBz3ykMLnAkhpXLyLM26ITOPq0WqPwhG062qQk0Y2at2uG5KJGPVPD-uzT1AOIu9KUssvrAZWG_UeQyQ"
        //
        // }
        });

        AWS.config.credentials.refresh((error) => {
            if (error) {
                console.error(error);
            } else {
                attachPrincipalPolicy("Server", AWS.config.credentials.identityId);
                // debugger
                // let options = {
                //     accessKeyId: "ASIASEMIASG4RINDW5WW",
                //     secretKey: "BL+CWsV4uXIjvgxU/R4s9e27FZulbMG3+j+CDsNb",
                //     sessionToken: "AgoGb3JpZ2luEJ7//////////wEaCXVzLWVhc3QtMSKAAqw7Lj/NqEP76LLpSKToXy5iklEeFf1paiydl62PSlH4gbofYeIUAThrdezmyX3enfsFkqNrsnMR8cIl1RA8na7FrnZVtLwaPh6lFScuNK2WkISmqFQfJaUnHrDbFhye5Z7LqtYoBeAAApPKZwbsPx47W4Pv4oXmTXryTb8bIEACR/1EyzUwYx+Unx5yU5xrUwM2oQTzQrLEVnD6tv3mxHQn8NWMKlKvb6fkOEs+E9siheodYvKVVrK277YIAlpLT6ZXzgMB0eSiQ8CK4I570kU+MMYgyDeJ7OTAcOKX5qMovXlkO2ClVdBPf1i8vj1IhqbCFzEPZLOABREQtlDMo30qrwUIo///////////ARAAGgwxNDY4NTEwMDg5NTMiDL2eKvJFROjHMbnyXiqDBeZXCItgqjnLl/LX5GdXDXmQtihFPafrihyy1Qm1NgvOhUCIvcYYpnQ8M/Cu98TJneVj8IpZ2EEPaMM82OR8beKokQ3UJ92f9E4Tb6NbKTCBkhJaSNcrkLbAQsRwlDF9X0Y7PL3ZnrUzcpLKk9qiQGDT/u8VHvt5tBNuYg+O+g/JTYSM5lXi5CVlUKiGjc8NSbK2PmXuu+i94thwA8L5tFnhTHSV7BSQgt9KfghlU661fxnxcqmqnT2QlgvpXHlNItBerjhKRqIINv5bdMrfv3R56uIxImx455X46Ij2sda8r6feQcAD5SdNDPyuLXzbtOOXJtIpFOrQqyoztpEV21t4+1KrSRSWECeMFCVrDzR0Y9Xn2x0/Gef/XdzY5HJmlOvRD2ykXQJfasj2D4C4Sfufz8eiWeE/c9dq184d16wizhruUJZ+jsRh0+ydVCdIBtpNmaPcD10a+NC4sIkU1mjUaNqarHV4kB8+Cco9e4T4Ka4wo14dSb85xvKqu6D2CTxcfNzWqytXODvj0eyOBfvgno6jxpe6lNYrcimymy1n+I4ZKKDz2kSWCb/kI0TGnZJLymDG09epdvBJFn75cMdV0Vy83W1siKk+4+sMbJfegAcMgSodZhPVkUcPxBecPU00xH7GqD7rz0kpu3gffzMICk74f0npCJ7N9mpHCQaFAlHcrKAKfOdvu72OPo2arQFUlewGjPPBqbDnDtbAsyAF4RHFdJcuc6fgVsPKxVs2jgJz99r6hDeM2byWwCPAU5SUy5TDxjQ1p+mYWp86FIMAB1NMlTJMuHn32f4quEHg9I0YGQwqo+1Omsp+LkhCabCz0XpI2pNxTVO0nnP+7nc4OwYwzrrQ4gU="
                // };
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
                    _self.notificationsManager(topic, msg);
                });
                /* --------------------------------------------------------------- */
            }
        });

        //Smoothflow Webchat connection
        // socket.on("connect", () => {
        //     console.log("socket connected")
        // });
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
                toastr.success("Task Update", "Test");
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

