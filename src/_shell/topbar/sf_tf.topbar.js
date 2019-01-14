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
        document.cookie = "satellizer_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0eXJpZS5kYWx0ZW5AcGx1dG9jb3cuY29tIiwianRpIjoiNzMwOWE2N2YtOGQxZC00OGYwLThmZjQtMzVjN2IxOTAzZDIzIiwic3ViIjoiQWNjZXNzIGNsaWVudCIsImV4cCI6MTU0NzcwMTEyMywidGVuYW50IjoxLCJjb21wYW55IjoyNDUsImNvbXBhbnlOYW1lIjoiQ29nbml0b1Rlc3QxMjM0IiwiY29udGV4dCI6e30sInNjb3BlIjpbeyJyZXNvdXJjZSI6Im15TmF2aWdhdGlvbiIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoibXlVc2VyUHJvZmlsZSIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoiYXR0cmlidXRlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6Imdyb3VwIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InJlc291cmNldGFza2F0dHJpYnV0ZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ0YXNrIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InByb2R1Y3Rpdml0eSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJTaGFyZWQiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoidGFza2luZm8iLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiYXJkc3Jlc291cmNlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6ImFyZHNyZXF1ZXN0IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InJlcXVlc3RtZXRhIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InF1ZXVlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InJlcXVlc3RzZXJ2ZXIiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoic2lwdXNlciIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXJQcm9maWxlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6Im9yZ2FuaXNhdGlvbiIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIl19LHsicmVzb3VyY2UiOiJyZXNvdXJjZSIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoicGFja2FnZSIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoiY29uc29sZSIsImFjdGlvbnMiOlsicmVhZCJdfSx7InJlc291cmNlIjoidXNlclNjb3BlIiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0seyJyZXNvdXJjZSI6InVzZXJBcHBTY29wZSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyTWV0YSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJ1c2VyQXBwTWV0YSIsImFjdGlvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl19LHsicmVzb3VyY2UiOiJjbGllbnQiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoiY2xpZW50U2NvcGUiLCJhY3Rpb25zIjpbInJlYWQiLCJ3cml0ZSIsImRlbGV0ZSJdfSx7InJlc291cmNlIjoid2FsbGV0IiwiYWN0aW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX1dLCJpYXQiOjE1NDcwOTYzMjN9.3Vf5GXr9w06M1ZuZ0AA2Szgt3cuIgo7WCWQyEsZ3K64";
        return <RedirectOutside url={URLs.auth.signup} _rollback_point={window.location.href} />
    };
    // END - LOCAL dev authentication ---------------------//

    signUp = (e) => {
        window.location.replace(URLs.auth.signup + '?r=' + window.location.href);
    };
    signIn = (e) => {
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
        }
        else {
            this.props.dispatch(OpenTasks(true));
            this.props.dispatch(PreloadNotifications(true));
            TaskService.getAllTasks()
                .then(tasks => {
                    tasks.data.Result.map(task => {
                        if(task.raw_data) task.Link = task.raw_data.Link;
                        task.type = "Dropdown";
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
                                                { this.props.notifications.notifications.length ? <span className="sf-notif-indecator"></span> : null }
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
                                                onClick={(e) => this.signIn(e)}
                                            >Sign In</Button>
                                            <Button
                                                className="sf-button sf-button-secondary sf-button-small sf-button-clear sf-button-caps"
                                                onClick={(e) => this.signUp(e)}
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