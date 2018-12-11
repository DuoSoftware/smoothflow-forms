import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import TopBar from "./_shell/topbar/sf_tf.topbar";
import Sidenav from "./_shell/sidenav/sf_tf.sidenav";
import Body from "./_shell/body/sf_tf.body";
import Formview from "./_containers/formview/sf_tf.formview.container";
import {LoadForm, PreloadShell, SignIn, User} from "./core/actions";
import {UIHelper, UserService} from "./core/services";
import URLs from "./core/_urls_";
// import Tabs from "./_components/Tab/tabs.widget";
// import Tab from "./_components/Tab/tab.widget";
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Wrap from "./_components/COMMON/Wrap/_wrap";
import {createMuiTheme} from "@material-ui/core/index";

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
    }

    // Dummy form id
    id = 'rLxUdm';

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
    };
    render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
            <div className="App">
                <TopBar/>
                <div className="sf-tf-main-container">
                    <Sidenav/>
                    <Body>
                    <Formview/>
                        {/*<Tabs>*/}
                            {/*<Tab iconClassName={'icon-class-0'} linkClassName={'link-class-0'} title={'Form 1'}>*/}
                                {/*<Formview/>*/}
                            {/*</Tab>*/}
                            {/*<Tab iconClassName={'icon-class-1'} linkClassName={'link-class-1'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-2'} linkClassName={'link-class-2'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-3'} linkClassName={'link-class-3'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-4'} linkClassName={'link-class-4'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-5'} linkClassName={'link-class-5'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-6'} linkClassName={'link-class-6'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-7'} linkClassName={'link-class-7'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-8'} linkClassName={'link-class-8'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-9'} linkClassName={'link-class-9'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-10'} linkClassName={'link-class-10'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-11'} linkClassName={'link-class-11'} title={'Form 2'}></Tab>*/}
                            {/*<Tab iconClassName={'icon-class-12'} linkClassName={'link-class-12'} title={'Form 2'}></Tab>*/}
                        {/*</Tabs>*/}

                        {/*<Tabs*/}
                            {/*value={value}*/}
                            {/*onChange={this.handleChange}*/}
                            {/*indicatorColor="primary"*/}
                            {/*textColor="primary"*/}
                            {/*scrollable*/}
                            {/*scrollButtons="auto">*/}

                            {/*<Tab label="Item One" />*/}
                            {/*<Tab label="Item Two" />*/}
                            {/*<Tab label="Item Three" />*/}
                            {/*<Tab label="Item Four" />*/}
                            {/*<Tab label="Item Five" />*/}
                            {/*<Tab label="Item Six" />*/}
                            {/*<Tab label="Item Seven" />*/}
                        {/*</Tabs>*/}

                        {/*{value === 0 && <TabContainer>Item One</TabContainer>}*/}
                        {/*{value === 1 && <TabContainer>Item Two</TabContainer>}*/}
                        {/*{value === 2 && <TabContainer>Item Three</TabContainer>}*/}
                        {/*{value === 3 && <TabContainer>Item Four</TabContainer>}*/}
                        {/*{value === 4 && <TabContainer>Item Five</TabContainer>}*/}
                        {/*{value === 5 && <TabContainer>Item Six</TabContainer>}*/}
                        {/*{value === 6 && <TabContainer>Item Seven</TabContainer>}*/}
                    </Body>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    uihelper : state.uihelper
});

export default connect(mapStateToProps) (App);
