import React, { Component } from 'react'
import './sf_tf.topbar.scss'
import { connect } from 'react-redux'
import RedirectOutside from "../../core/_auth.redirect";
import URLs from "../../core/_urls_";
import {Button, ButtonGroup, Dropdown, List, Preloader, Textbox} from "../../_components/COMMON";
import Wrap from "../../_components/COMMON/Wrap/_wrap";
import {InjectTask, OpenNotifications, OpenTasks, PreloadNotifications} from "../../core/actions";
import {TaskService} from "../../core/services";

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userctrl : false
        };
    }

    // LOCAL dev authentication ---------------------------//
    localSignIn = () => {
        document.cookie = "satellizer_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrYXN1bi53QGR1b3NvZnR3YXJlLmNvbSIsImp0aSI6ImYwYWZmMGM1LWZkZTQtNDM3Mi05ZGYxLWJlZjkyMGY0ZTAyZSIsInN1YiI6IkFjY2VzcyBjbGllbnQiLCJleHAiOjE1NDcwMTExNTksInRlbmFudCI6MSwiY29tcGFueSI6NDEsImNvbXBhbnlOYW1lIjoia2FzdW4iLCJjb250ZXh0Ijp7fSwic2NvcGUiOlt7InJlc291cmNlIjoibXlOYXZpZ2F0aW9uIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJteVVzZXJQcm9maWxlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJhdHRyaWJ1dGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiZ3JvdXAiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicmVzb3VyY2V0YXNrYXR0cmlidXRlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InRhc2siLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicHJvZHVjdGl2aXR5IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6IlNoYXJlZCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ0YXNraW5mbyIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJhcmRzcmVzb3VyY2UiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiYXJkc3JlcXVlc3QiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicmVxdWVzdG1ldGEiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicXVldWUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoicmVxdWVzdHNlcnZlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJzaXB1c2VyIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlclByb2ZpbGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoib3JnYW5pc2F0aW9uIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiXX0seyJyZXNvdXJjZSI6InJlc291cmNlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJwYWNrYWdlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJjb25zb2xlIiwiYWN0aW9ucyI6WyJyZWFkIl19LHsicmVzb3VyY2UiOiJ1c2VyU2NvcGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidXNlckFwcFNjb3BlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXJNZXRhIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXJBcHBNZXRhIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImNsaWVudCIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJjbGllbnRTY29wZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ3YWxsZXQiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfV0sImlhdCI6MTU0NjQwNjM1OX0.3SUIVqvPIkfSVZHrxz8KoO5oM4AgyFAbYAe-FSzESYg";
        return <RedirectOutside url={URLs.auth.signup} _rollback_point={window.location.href} />
    };
    // END - LOCAL dev authentication ---------------------//

    signUp = () => {
        window.location.replace(URLs.auth.signup + '?r=' + window.location.href);
    };
    signIn = () => {
        window.location.replace(URLs.auth.signin + '?r=' + window.location.href);
    };
    toggleUserCtrlPanel = (task, e) => {
        switch (task) {
            case 'TOGGLE' :
                this.setState(state => ({
                    ...state,
                    userctrl: {
                        ...state.userctrl,
                        togglePanel: !this.state.userctrl.togglePanel
                    }
                }));
                break;

            case 'LOGOUT' :
                window.localStorage.removeItem('satellizer_token');
                window.location.replace(URLs.auth.signin);
                break;

            default :
                return;
        }
    };

    openNotifications =(e)=> {
        const isopen = this.props.notifications.notifications_open;
        if (isopen) {
            this.props.dispatch(OpenNotifications(false));
        } else {
            this.props.dispatch(OpenNotifications(true));

        }
        this.props.dispatch(OpenTasks(false));
    };

    openTasks =(e)=> {
        const isopen = this.props.tasks.tasks_open;
        if (isopen) {
            this.props.dispatch(OpenTasks(false));
        } else {
            this.props.dispatch(OpenTasks(true));
            this.props.dispatch(PreloadNotifications(true));
            TaskService.getAllTasks()
                .then(tasks => {
                    debugger
                    tasks.data.Result.map(task => {
                        task.Link = task.raw_data.Link;
                    });
                    this.props.dispatch(PreloadNotifications(false));
                    this.props.dispatch(InjectTask(tasks.data.Result));
                })
                .catch(error => {
                    debugger
                    this.props.dispatch(PreloadNotifications(false));
                });
        }
        this.props.dispatch(OpenNotifications(false));
    };

    render () {
        return (
            <div className="sf-tf-topbar">
                <div className="sf-tf-topbar-brand">
                    <div className="sf-tf-topbar-logo">
                        <img src="https://smoothflow.io/images/logo-smoothflow-beta-purple.svg" alt=""/> <span
                        className="sf-tf-topbar-logo-text">DOCK</span>
                    </div>
                </div>
                <div className="sf-topbar-btngrp-wrap">

                </div>
                <div className="sf-tf-topbar-tools">
                    {
                        this.props.uihelper._preload_shell_
                        ?   <Preloader type={'SHELL:TOPBAR'}/>
                        :   <Wrap>
                                {
                                    this.props.user.is_logged_in
                                    ?   <Wrap>
                                            <button className={`sf-tf-topbar-tool sf-button sf-button-circle${this.props.tasks.tasks_open ? ' sf-tf-topbar-tool-selected' : ''}`} onClick={ (e)=> this.openTasks(e) }>
                                                <span className="sf-icon icon-sf_ico_items"></span>
                                            </button>
                                            <button className={`sf-tf-topbar-tool sf-button sf-button-circle${this.props.notifications.notifications_open ? ' sf-tf-topbar-tool-selected' : ''}`} onClick={ (e)=> this.openNotifications(e) }>
                                                <span className="sf-icon icon-sf_ico_notification"></span>
                                            </button>
                                            <div className="sf-tf-topbar-tool sf-topbar-textimg" onClick={this.toggleUserCtrlPanel.bind(null, 'TOGGLE')}>
                                                <span>{ this.props.user.email.contact.split('')[0] }</span>
                                            </div>
                                            {/*<span*/}
                                                {/*className="sf-tf-topbar-tool "*/}
                                                {/*onClick={this.toggleUserCtrlPanel.bind(null, 'TOGGLE')}><span*/}
                                                {/*className={`sf-icon icon-sf_ico_${this.state.userctrl.togglePanel ? 'chevron_up' : 'chevron_down'}`}></span>*/}
                                            {/*</span>*/}
                                        </Wrap>
                                    :   <div>
                                            <Button
                                                className="sf-button sf-button-secondary sf-button-small sf-button-clear sf-button-caps"
                                                style={{'marginRight': '10px'}}
                                                onClick={() => this.localSignIn()}
                                            >Sign In</Button>
                                            <Button
                                                className="sf-button sf-button-secondary sf-button-small sf-button-clear sf-button-caps"
                                                onClick={() => this.signUp()}
                                            >Sign Up</Button>
                                        </div>
                                }
                            </Wrap>
                    }
                </div>
                {
                    this.props.user.is_logged_in
                        ?   <Dropdown toggle={this.state.userctrl.togglePanel} openPos={55} closedPos={40} height={'auto'}>
                                <List>
                                    <li onClick={this.toggleUserCtrlPanel.bind(null, 'LOGOUT')}>
                                        <Textbox icon={'home'}>Log out</Textbox>
                                    </li>
                                </List>
                            </Dropdown>
                        :   null
                }
            </div>
        )
    }
};


const mapStateToProps = state => ({
    user: state.user,
    uihelper: state.uihelper,
    notifications: state.notifications,
    tasks: state.tasks
});

export default connect(mapStateToProps) (TopBar);