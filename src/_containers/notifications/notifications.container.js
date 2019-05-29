import React, { Component } from 'react'
import {KEY} from "../../core/services";
import {Message, Notification} from "../../_components/COMMON";

class NotificationsContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            this.props.notifications.length
                ?   this.props.notifications.map(task =>
                    <Notification key={KEY()} item={task}/>
                )
                :   <Message>No notification has been found</Message>
        )
    }
}

export default NotificationsContainer