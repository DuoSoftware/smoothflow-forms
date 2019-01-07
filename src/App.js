import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import TopBar from "./_shell/topbar/sf_tf.topbar";
import Sidenav from "./_shell/sidenav/sf_tf.sidenav";
import Body from "./_shell/body/sf_tf.body";
import Formview from "./_containers/formview/sf_tf.formview.container";
import {InjectNotification, LoadForm, PreloadShell, SignIn, User} from "./core/actions";
import {KEY, UIHelper, UserService} from "./core/services";
import URLs from "./core/_urls_";
import Tabs from "./_components/Tab/tabs.widget";
import Tab from "./_components/Tab/tab.widget";
import Wrap from "./_components/COMMON/Wrap/_wrap";
import {createMuiTheme} from "@material-ui/core/index";
import IoTClient from './core/lib/iot-client';
import {Message} from "./_components/COMMON/Message/message";

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
        let options = {
            accessKeyId: '',
            secretKey: '',
            sessionToken: ''
        };
        const _self = this;

        let iotClient = new IoTClient(options);
        iotClient.onConnect(function () {
            console.log('connected.');
            iotClient.subscribe('kassa');
            iotClient.publish('kassa', "{'message':'AAwa'}");
        });
        iotClient.onMessageReceived(function(topic, message) {
            console.log(topic, message);
            _self.props.dispatch(InjectNotification(message));
        });
        /* --------------------------------------------------------------- */
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
                    {/*<Formview/>*/}
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

                        {/*<Tabs*/}
                            {/*value={value}*/}
                            {/*onChange={this.handleChange}*/}
                            {/*indicatorColor="primary"*/}
                            {/*textColor="primary"*/}
                            {/*variant="scrollable"*/}
                            {/*scrollButtons="auto">*/}
                            {/*<Tab label="Form 1" />*/}
                            {/*<Tab label="Form 2" />*/}
                        {/*</Tabs>*/}
                        {/*{value === 0 && <TabContainer>Item One</TabContainer>}*/}
                        {/*{value === 1 && <TabContainer>Item Two</TabContainer>}*/}
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
