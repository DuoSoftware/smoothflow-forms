import React from 'react'
import './notification.scss'
import {ActiveForm, LoadedForms, OpenTasks} from "../../../core/actions";
import { connect } from 'react-redux';

const selectNotification = (e, notif, props) => {
    let fgs = [...props.form.loaded_forms];
    let alreary_loaded = false;
    if (fgs.length) {
        debugger
        fgs.map(g => {
            if (g.form_name === notif.task_name) {
                g.selected = true;
                const i = fgs.indexOf(g);
                alreary_loaded = true;
            } else {
                g.selected = false;
            }
        });
    } else {
        props.dispatch(ActiveForm(notif, 0));
        props.dispatch(OpenTasks(false));
    }
    if(!alreary_loaded) fgs.push(notif);
    props.dispatch(ActiveForm(notif, null));
    props.dispatch(OpenTasks(false));
    props.dispatch(LoadedForms(fgs));
};

const Notification = (props) => {
    return (
        <div className="sf-notification" onClick={(e) => selectNotification(e, props.item, props)}>
            <div className="sf-notification-prefix">
                <span>N</span>
            </div>
            <div className="sf-notification-body">
                <div className="sf-notification-title">{ props.item.task_name }</div>
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