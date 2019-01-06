import React, { Component } from 'react'
import './sf_tf.body.scss'
import {Notification} from "../../_components/COMMON/Notification/notification.component";
import {KEY, TaskService} from "../../core/services";
import { connect } from 'react-redux'
import {Preloader} from "../../_components/COMMON";
import {ActiveForm, LoadedForms} from "../../core/actions";

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
                            :   this.props.tasks.tasks.map(task =>
                                    <Notification key={KEY()} item={task}/>
                                )
                        :   this.props.notifications.notifications_open
                        ?   this.props.uihelper._preload_notif_
                            ?   <Preloader type={'BODY'} />
                            :   this.props.notifications.notifications.map(task =>
                                    <Notification key={KEY()} item={task}/>
                                )
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