import React from 'react'
import './notification.scss'
import {ActiveForm, LoadedForms, OpenTasks, RemoveNotification} from "../../../core/actions";
import { connect } from 'react-redux';

const Notification = (props) => {
    const markAsRead = (e, notif) => {
        props.dispatch(RemoveNotification(notif));
    };

    return (
        <div className="sf-notification">
            <div className="sf-notification-prefix">
                <span>N</span>
            </div>
            <div className="sf-notification-body">
                <div className="sf-notification-title">
                    <span style={ {'flex':'1'} }>{ props.item.name }</span>
                    <i className="material-icons" onClick={ (e) => markAsRead(e, props.item) } style={ {'color':'#aaa'} }>visibility_off</i>
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