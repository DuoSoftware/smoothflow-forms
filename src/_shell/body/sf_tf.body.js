import React, { Component } from 'react'
import './sf_tf.body.scss'
import {KEY, TaskService} from "../../core/services";
import { connect } from 'react-redux'
import {Preloader, Notification, Task} from "../../_components/COMMON";
import {ActiveForm, LoadedForms} from "../../core/actions";
import {Message} from "../../_components/COMMON/Message/message";

class Body extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {

    }

    render() {
        return (
            <div className="sf-tf-body">
                <div className={`sf-notifications ${this.props.tasks.tasks_open || this.props.notifications.notifications_open ? 'sf-notifications-opened' : ''}`}>
                    {
                        this.props.tasks.tasks_open
                        ?   this.props.uihelper._preload_notif_
                            ?   <Preloader type={'BODY'} />
                            :   this.props.tasks.tasks.length
                                ?   this.props.tasks.tasks.map(task =>
                                        <Task key={KEY()} item={task}/>
                                    )
                                :   <Message>No task has been found</Message>
                        :   this.props.notifications.notifications_open
                        ?   this.props.uihelper._preload_notif_
                            ?   <Preloader type={'BODY'} />
                            :   this.props.notifications.notifications.length
                                ?   this.props.notifications.notifications.map(task =>
                                        <Notification key={KEY()} item={task}/>
                                    )
                                :   <Message>No notification has been found</Message>
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