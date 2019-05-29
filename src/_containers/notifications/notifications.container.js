import React, { Component } from 'react'
import {KEY} from "../../core/services";
import {Message, Notification} from "../../_components/COMMON";
import { connect } from 'react-redux'

class NotificationsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            this.props.notifications.notifications.length
                ?   this.props.notifications.notifications.map(task =>
                    <Notification key={KEY()} item={task}/>
                )
                :   <Message>No notification has been found</Message>
        )
    }
}

const setStateToProps = s => ({
    notifications: s.notifications
})

export default (connect(setStateToProps))(NotificationsContainer);