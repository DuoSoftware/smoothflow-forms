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
            accessKeyId: 'ASIA2EZAZJQDOVBYBZ3F',
            secretKey: 'Yogg7WznqDCa5+cpZTY1F92rneh4r3l6Zi9lMJA4',
            sessionToken: 'AgoGb3JpZ2luEEEaCXVzLWVhc3QtMSKAAm4ZctnGAuQ/xFOes5NX5iJQU2+LSvWpmibL8/x167pXHABGYqHrGib0QpS7bcMnFPuXU2BjYicjaWI2GzNOPA2Z/fUI6UqjrN4bbaYbfkwjm8Of6BcKD5O6J+jYpU0C0XG4bEYNJ/PFk+jJenFo+/Jk/kjDvaNB9zQC/3ZPfoSaYfhsEHspR0ntmau9bV0nGdPnPbimLT7dvublSd+TaFmn6kYEkBupJeyTZvUWZVhIJBWrTIJGwNemRRCzdMosGOF1BBtqa251HcwQqAFWVwsRi0kupFKLny+oDnZPz6+J4eF6sLOWKleyUoX6SpNoX/nnZ60NYMDMhXQv1oIusZgqpgUIJxABGgw2OTc0NjQwODE0MTQiDOUl6f750WN1aQ23TiqDBTUE4Abdy1VO/p5gTR7PalyxPGOlUZbJd+yx1PFEVO+9P/tS1F8DqeS8Adqu8BDYENb1IUOJmvRmvpeLi4/e1xxqcJ5Zbjlg1opSsw0VyzgfmYSalXffRxmHN+7eIm0B/26kqUaflhySH0SpIVYEHFoBsAiRntsFGmZzK6bpTb7BOuG0yl355y+d5HLdQicE9HslPe6TB09e7yeAvrBFOupIrxS4kr6kFwnFLblsczSwvG0V9o3pmemRYFCcFqdJ7DnCP4Zkdcp5dwPE3oYlyc6WLm+zbeEDK7QtZY+A9rrm6/KcKtgaqojDsXaC5hyKPku81BjdIkF46ES35q2OkIavwyc9JTqh76NS0SyRVcYctqKIePEI6xKrD1GVXiyWb5/l0oZYF2dYikj4rEPlDo620zS6Zl1TauM6DH/l4f7Cq7FYAgkOX/TyFIfd+rPiIBxuoU9Gj1wuMpsEEho6fYC1ixT2SzQDj1dwedaOhIop/zxXKAsZvXa/zg32XFcmTr/AzW47dV4YPom6PacuWIjT2Ndg+uO+2Dfx6kfAaJMCeMedKae0AxICFgkqojReHV/kvtvWDEeN1LH07F/tBqinJkZ5AIOZXV/O4wNcd4hwg9SIvyHSfclmN9Vf4AKt9acw+8It1YYa2QoXWvu2kFLwfRFKHJlSkvbeGqS+mgBGO4+AtotJKaIVk/jGOJQpZ7P22UqIQkmbU6HW6z9nZ283RSYJm8iyfq8GW3S/d5XbiiyFioth+0gLOpF3HCmu0mPtgPyIx8sfOtN83tQDLvmDeWEZflXp4G10y6vspVsGT0dnBKirdcotriXXVjv7j7lBe/b/YU6b1bEzOrXErm51IoEwtMbL4QU='
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
                        <Tabs>
                            {
                                this.props.form.loaded_forms.map(form =>
                                    <Tab key={KEY()} iconClassName={'icon-class-0'} linkClassName={'link-class-0'} title={form.form_name}>
                                        <Formview form={ form.form_link }/>
                                    </Tab>
                                )
                            }
                        </Tabs>

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
