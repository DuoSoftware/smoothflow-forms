import React, {Component} from 'react'
import './task.scss'
import {ActiveForm, InjectTask, LoadedForms, OpenTasks} from "../../../core/actions";
import { connect } from 'react-redux';
import {Button, Preloader} from "../";
import $ from 'jquery';
import {TaskService} from "../../../core/services";

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fav_toggle_loading : ''
        };
    }

    componentDidMount() {
    }

    selectTask = (e, notif) => {
        if (!notif.locked) {
            if ($(e.target).hasClass('sf-task-fav-icon')) {
                this.setState(state => ({
                    ...state,
                    fav_toggle_loading: notif._id
                }));
                TaskService.makeFavourite(notif._id)
                    .then(res => {
                        if (res.data.IsSuccess) {
                            const _tasks = [...this.props.tasks.all_tasks];
                            _tasks.map(task => {
                                if (task._id === res.data.Result._id) {
                                    task.is_favorite = res.data.Result.is_favorite;
                                }
                            });
                            this.setState(state => ({
                                ...state,
                                fav_toggle_loading: ''
                            }));
                            this.props.dispatch(InjectTask(_tasks));
                        }
                    })
                    .catch(erres => {
                        debugger;
                    });
            } else if ($(e.target).hasClass('sf-checkout-button')) {
                if (notif) this.updateState(e, notif);
            } else {
                let fgs = [...this.props.form.loaded_forms];
                let alreary_loaded = false;
                if (fgs.length) {
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
                    this.props.dispatch(ActiveForm(notif, 0));
                    this.props.dispatch(OpenTasks(false));
                }
                if(!alreary_loaded) fgs.push(notif);
                this.props.dispatch(ActiveForm(notif, null));
                this.props.dispatch(OpenTasks(false));
                this.props.dispatch(LoadedForms(fgs));
            }
        }
    };

    getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    updateState (e, item) {
        debugger
        if (item) {
            let payload = {
                "task_name": item.task_name,
                "form_name" : item.form_name,
                "form_id" : item.form_id,
                "assigner" : item.assigner,
                "assignee" : this.props.user.username,
                "review_status": "STARTED",
                "raw_data": {
                    "Link" : item.raw_data.Link
                },
                "description": item.description
            };

            TaskService.updateTask(item._id, payload)
                .then(res => {
                    debugger
                    if (res.data.IsSuccess) {
                        const data = res.data.Result;
                        const allTasks = this.props.tasks.all_tasks;
                        allTasks.map(task => {
                            if(task._id === data._id) {
                                task.review_status = data.review_status;
                            }
                        });
                        this.props.dispatch(InjectTask(allTasks));
                        this.lockTask(item);
                    }
                })
                .catch(erres => {
                    debugger;
                })
        }
    }

    lockTask(task) {
        debugger
        const data = {
            "topic": "tasks",
            "data": {
                "type" : "task",
                "status" : "STARTED",
                "name" : task.task_name,
                "assignee" : this.props.user.username,
                "_id" : task._id
            }
        };
        this.props.tasks.IotClient.publish('tasks', JSON.stringify(data));
    };

    render () {
        return (
            <div className={`sf-task${this.props.tasks.task_fullwidth ? ' sf-task-full' : ''} ${this.props.tasks.locked ? ' sf-task-locked' : ''}`}
                 onClick={(e) => this.selectTask(e, this.props.item)}>
                <div className="sf-task-header">
                    <div className="sf-task-prefix" style={{'background': this.getRandomColor()}}>
                        <span>T</span>
                    </div>
                    <div className="sf-task-title">{this.props.item.task_name}</div>
                    { this.props.item.locked ? <i className="material-icons">lock</i> : null}
                    <div className="sf-task-status">{this.props.item.review_status}</div>
                </div>
                <div className="sf-task-body">
                    <div className="sf-task-desc">
                        <p>{this.props.item.description}</p>
                    </div>
                </div>
                <div className="sf-task-footer">
                    <div className="sf-task-assignee">
                        <span>From: <b>{this.props.item.assigner}</b></span>
                    </div>
                    <div className="sf-task-assign-to">
                        <span>To: <b>{this.props.item.assigner}</b></span>
                    </div>
                    {
                        this.props.item.review_status !== 'STARTED' && this.props.item.assignee !== this.props.user.username
                        ?   <div className="sf-task-assign-to">
                                <Button className="sf-checkout-button sf-button sf-button-xsmall sf-button-secondary">
                                    Check out
                                </Button>
                            </div>
                        :   null
                    }
                    <div
                        className={`sf-task-fav-icon sf-task-favourite${this.props.item.is_favorite ? ' sf-task-favourite-on' : ''}`}>
                        {
                            this.state.fav_toggle_loading === this.props.item._id
                                ? <Preloader type={'INLINE'}/>
                                :
                                <i className="sf-task-fav-icon material-icons">star{this.props.item.is_favorite ? '' : '_border'}</i>

                        }
                    </div>
                </div>
            </div>
        )
    }
};

const mapStateToProps = state => ({
    form: state.form,
    tasks: state.tasks,
    user: state.user
});

const PageHederToExport = connect(mapStateToProps) (Task);

export { PageHederToExport as Task }