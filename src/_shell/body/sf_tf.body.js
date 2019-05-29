import React, { Component } from 'react'
import './sf_tf.body.scss'
import {KEY, TaskService} from "../../core/services";
import { connect } from 'react-redux'
import {Preloader, Notification, Task, Button} from "../../_components/COMMON";
import {ActiveForm, InjectNotification, LoadedForms, PreloadNotifications, TasksFullwidth} from "../../core/actions";
import {Message} from "../../_components/COMMON/Message/message";
import Wrap from "../../_components/COMMON/Wrap/_wrap";
import {Divider} from "../../_components/COMMON/Divider/divider.component";
import IoTClient from "../../core/lib/iot-client";
import _ from "lodash";
import TasksContainer from "../../_containers/tasks/tasks.container";
import NotificationsContainer from "../../_containers/notifications/notifications.container";

class Body extends Component {

    constructor(props) {
        super(props);
        this.state = {
            task_fullwidth : false
        };
    };

    componentDidMount() {
    }

    tasksAll = (e, status) => {
        this.props.dispatch(TasksFullwidth(status));
    };

    render() {
        return (
            <div className="sf-tf-body">
                <div className={`sf-notifications ${this.props.tasks.tasks_open || this.props.notifications.notifications_open ? 'sf-notifications-opened' : ''} ${this.props.tasks.task_fullwidth ? 'sf-notifications-full' : ''}`}>
                    {
                        this.props.tasks.tasks_open
                        ?   <div className={`sf-flexbox-row sf-flex-center`} style={ {'marginBottom': '15px', 'position': 'relative', 'zIndex': 1} }>
                                <h2 className="sf-flex-1" style={{'margin':0}}>Tasks</h2>
                                {
                                    this.props.tasks.task_fullwidth ? <Button className="sf-button sf-button-circle" onClick={ (e) => this.tasksAll(e, false)}><span className="sf-icon icon-sf_ico_close_circle"></span></Button> : <Button className="sf-tasks-showall sf-button sf-button-xsmall" onClick={ (e) => this.tasksAll(e, true)}>Show All</Button>
                                }
                            </div>
                        :   null
                    }
                    {
                        this.props.tasks.tasks_open
                        ?   this.props.uihelper._preload_notif_
                            ?   <Preloader type={'BODY'} />
                            :   <TasksContainer tasks={this.props.tasks}/>
                        :
                        this.props.notifications.notifications_open
                        ?   this.props.uihelper._preload_notif_
                            ?   <Preloader type={'BODY'} />
                            :   <NotificationsContainer notifications={this.props.notifications}/>
                        :   null
                    }
                </div>
                { this.props.children }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    uihelper : state.uihelper,
    tasks : state.tasks,
    notifications: state.notifications
});

export default (connect(mapStateToProps)) (Body);