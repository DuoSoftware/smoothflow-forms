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
            accessKeyId: 'ASIA2EZAZJQDND5EHUVZ',
            secretKey: 'lOv883CCS8bn3V3TUXSH6VPAFkph2Igj52XcLI1t',
            sessionToken: 'AgoGb3JpZ2luEDYaCXVzLWVhc3QtMSKAAjrIVy8rQtOw5JrVpj9SLnyC4+jBpdxsgnSzIuuudvfGiG40dN8heRtjoEBR6WVJqyfo8icb9eCy0QjZb6d19OriW6SP9GUscaqxFEwxVo5wMwnwUvQV2muFx2AOJAn6TTLkz/96VLj0iHCwcdF1d4H0KzX1ujKFkX7FPjzZDBs1hL4ZOAz7XgRI4+W4lGIBHqEByoi12BhJzhUZakZahCYfwSXHyU0fi99kIM1TNM84cbY/zB9HkNgLarru3dwVccRlZ0hsjL6L5b5eiG7QXkm8iME3Ks81PO+t+aLgARz4dqAvxni0O8FSUkpEZ6bN7ACTUlKYCGZnzi8m2K+yBRoqpgUIGxABGgw2OTc0NjQwODE0MTQiDHgCWrkZ7uK+c2fWFiqDBfxXKJZHSC58hmhsk9Vh7tY+rqN9zgWKlvyWb/UL6hbCV0/+ZRHaDBlorkcNKT+bB62wLCVO5YTDv36wgfXUvLPwbrPxiU32ALZBhi+ulv45RdiD8kcaj+111Z7yaWA36ZGVzHh1Ob6BKo9e3B6he+CMFVbVi6W7R7iSFJ0ILzRaX6wEFHZN+odPbs4LGPOQniJgGa1hWyRxa2w9WVJiZQudiT52C63tBLPcmArcgUdyCvny3NyVtZNibG7mS3kmzCuFMGs21nxXUbtF/wEZ4lwd9ILPcqD7UsZ7fPW4T57OBT2p6+jOGjy/iwDrBgbvvzihvrwVojWiggNnMBpqkW9fs7e2DJfiO1sIM2dsl4qqrsPjpNqJ1VELxVPZJgq6pBPOC1fBwrkoXn/DGfr4oBwDz4d94n2cQIVrXgMAvmY2Uvr+0Q8qT0Crh8HeXkyD2afbiWbRo79uPUxPf6qP/pZQx379ayBKaTo+eqLra1zk4WX8D+RagC4bug18q8aeg0QBAHQjQaaW2M44QE8sysV7Uv9lmZhIPaWyaOomvDWPr/CpfifGowFJfQ7YZMRLfltTsyRxqkMoLY/zVmLyToH9N+LGSsd+y+UF/JwLvxlMLMH/GJnPlg5OPhy7eOWk2cRELVD4RfFF7pPJafZL9iVKx+m4+QvwAqG9ybQ9/VWYX76zFavQbHX9/mYg2hTBCat0G/gLMOs7CmVHDGS7o2bZr45G7tBWy8PVB9EEPrBf4i36jrq1ESdUG/2XluApOl5cKclky5dQXyDlckbrtBo0h9QRuU9zQjVK7m/rlIuq9f8J/11DRvQzJeRUx1crsfl62tEBdt7CUNJgyM9i+boDw/IwsIzJ4QU='
        };
        const _self = this;

        let iotClient = new IoTClient(options);
        iotClient.onConnect(function () {
            console.log('connected.');
            iotClient.subscribe('bina');
            // iotClient.publish('kassa', 'AAwa');
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
                                        <Formview form={ form.Link }/>
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
