import React from 'react'
import './notification.scss'
import {ActiveForm, LoadedForms, OpenTasks, RemoveNotification} from "../../../core/actions";
import { connect } from 'react-redux';
import {Button} from "../";

const Notification = (props) => {

    const markAsRead = (notif) => {
        props.dispatch(RemoveNotification(notif._id));
    };

    return (
        <div className="sf-notification">
            <div className="sf-notification-prefix">
                <span>N</span>
            </div>
            <div className="sf-notification-body">
                <div className="sf-notification-title">
                    <span>{ props.item.name }</span>
                    <Button className="sf-butotn sf-button-xs" onClick={ markAsRead.bind(props.item) }>OK</Button>
                </div>
                <div className="sf-notification-desc">
                    <p>{ props.item.description }</p>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    form: state.form
});

const PageHederToExport = connect(mapStateToProps) (Notification);

export { PageHederToExport as Notification }