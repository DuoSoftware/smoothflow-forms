import React, { Component } from 'react'
import './task.scss'
import {Button, Divider} from "../../_components/COMMON";
import Comment from "../../_components/COMMON/Comment/comment.component";
import { connect } from 'react-redux'
import moment from 'moment'
import {TaskService} from "../../core/services";
import Select from 'react-select'

class TaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.task,
            newcomment: '',
            reasignTo: '',
            users: [
                { value: 'shehan@duosoftware.com', label: 'Shehan' },
                { value: 'kalana@duosoftware.com', label: 'Kalana' },
                { value: 'binara@duosoftware.com', label: 'Binara' }
            ]
        }
    }
    newCommentTrack = (e) => {
        const value = e.target.value;
        this.setState(s=> ({
            ...s,
            newcomment: value
        }))
    };
    addComment = (e) => {
        const task = this.state.task;
        const d = new Date();
        const newcom = {
            comment: this.state.newcomment,
            name: this.props.user.sesuser.given_name + ' ' + this.props.user.sesuser.family_name,
            time: moment(d).format('LLL')
        };
        task.raw_data.comments.push(newcom);
        // TaskService.updateTask()
        this.setState(s=>({
            ...s,
            task: task
        }));
    };
    handleReasign(user, self) {
        self.setState(s=> ({
            ...s,
            reasignTo: user
        }));
    }

    updateTask() {
        TaskService.updateTask(this.state.task)
            .then(res=> {
                debugger
            })
            .catch(res=>{
                debugger
            })
    }

    render() {
        const _self = this;
        return (
            <div className="sf-task-view">
                <form action="">
                    <div className="sf-task-view-header">
                        <h2 className="sf-task-view-title">{this.state.task.form_name}</h2>
                        <div className={`sf-task-status${' task-'+ this.state.task.review_status.toUpperCase()}`}>{this.state.task.review_status}</div>
                    </div>
                    <p className="sf-task-view-dxesc">{this.state.task.description}</p>
                    <b>Requested items</b>
                    <div className="sf-task-view-content">

                    </div>

                    <b>Comments</b>
                    <div className="sf-task-view-comments">
                        <div className="-comments-list">
                            {
                                this.state.task.raw_data.comments.map(comment=>
                                    <Comment comment={comment}></Comment>
                                )
                            }
                        </div>
                        <div className="-new-comment">
                            <div>Add new comment..</div>
                            <textarea id="newComment" value={this.state.newcomment} onChange={(e)=>this.newCommentTrack(e)} />
                            <Button className="sf-button sf-button-secondary sf-button-secondary-s" type="button" onClick={(e)=>this.addComment(e)}>Add</Button>
                        </div>
                    </div>

                    <Divider/>
                    <div className="sf-task-view-actions">
                        <div className="-reasign-to">
                            <Select
                                value={this.state.reasignTo}
                                onChange={(e)=>this.handleReasign(e, _self)}
                                options={this.state.users}
                            />
                            <Button className="sf-button sf-button-secondary sf-button-secondary-s">Reasign</Button>
                        </div>
                        <Button className="sf-button sf-button-primary sf-button-primary-p">Accept</Button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps=s=>({
    user: s.user
});

export default (connect(mapStateToProps))(TaskView);