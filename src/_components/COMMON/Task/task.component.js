import React from 'react'
import './task.scss'
import {ActiveForm, LoadedForms, OpenTasks} from "../../../core/actions";
import { connect } from 'react-redux';
import {Button} from "../";

const selectTask = (e, notif, props) => {
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

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const Task = (props) => {
    return (
        <div className={`sf-task${props.tasks.task_fullwidth ? ' sf-task-full' : ''}`} onClick={(e) => selectTask(e, props.item, props)}>
            <div className="sf-task-header">
                <div className="sf-task-prefix" style={{'background' : getRandomColor()}}>
                    <span>T</span>
                </div>
                <div className="sf-task-title">{ props.item.task_name }</div>
                <div className="sf-task-status">{ props.item.review_status }</div>
            </div>
            <div className="sf-task-body">
                <div className="sf-task-desc">
                    <p>{ props.item.description }</p>
                </div>
            </div>
            <div className="sf-task-footer">
                <div className="sf-task-assignee">
                    <span>From: <b>{ props.item.assigner }</b></span>
                </div>
                <div className="sf-task-assign-to">
                    <span>To: <b>{ props.item.assigner }</b></span>
                </div>
                <div className={`sf-task-favourite${props.item.favourite ? ' sf-task-favourite-on' : ''}`}>
                    <i className="material-icons">star{props.item.favourite ? '' : '_border'}</i>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    form: state.form,
    tasks: state.tasks
});

const PageHederToExport = connect(mapStateToProps) (Task);

export { PageHederToExport as Task }