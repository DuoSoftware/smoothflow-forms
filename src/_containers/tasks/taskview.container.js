import React, { Component } from 'react'
import './task.scss'
import {Button, Divider, Preloader} from "../../_components/COMMON";
import Comment from "../../_components/COMMON/Comment/comment.component";
import { connect } from 'react-redux'
import moment from 'moment'
import { TaskService, UIHelper} from "../../core/services";
import Select from 'react-select'
import Timer from 'react-compound-timer'
import Wrap from "../../_components/COMMON/Wrap/_wrap";
import { toastr } from 'react-redux-toastr'

class TaskView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.task,
            newcomment: '',
            reassignTo: null,
            users: [],
            controls: [],
            loading: false,
            editAssignee: false
        }
    }
    componentDidMount() {
        const _task = this.state.task;
        _task.created_at = moment(this.state.task.created_at).format('LLL');
        _task.updated_at = moment(this.state.task.updated_at).format('LLL');
        const wusers = this.props.user.workspace_users.map(user => {
            return {
                value: user,
                label: user
            }
        });

        const taskControls = [];
        for(let d of Object.keys(_task.raw_data)) {
            if (d.indexOf('Button') !== -1) {
                let _d = _task.raw_data[d];
                if (_d !== "") {
                    taskControls.push({
                        label: _d,
                        link: _task.raw_data.RawData2
                    });
                }
            }
        };
        this.setState(s=>({
            ...s,
            task: _task,
            users: wusers,
            controls: taskControls
        }));
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
    handleReassign(user, url, action, self) {
        debugger
        self.setState(s=> ({
            ...s,
            reassignTo: user
        }));
        this.executeTask(null, url, action);
    }

    executeTask(e, url, action) {
        if(e)e.preventDefault();
        this.setState(s=>({...s, loading: true}));
        const payload = {};
        const P = JSON.parse(this.state.task.raw_data.RawData3.replace(/'/g, '"'));
        for(let p of P) {
            payload[p] = null;
        };

        if (payload.hasOwnProperty('InSessionID')) payload.InSessionID = UIHelper.UUID();
        if (payload.hasOwnProperty('TaskAction')) payload.TaskAction = action;
        if (payload.hasOwnProperty('SessionData')) payload.SessionData = "{}";
        payload['typeform_payload'] = "{}";
        if (action === 'Reassign') {
            if (this.state.reassignTo) {
                payload['TaskData'] = this.state.reassignTo.value;
            }
        } else {
            payload['TaskData'] = "";
        }


        TaskService.executeControl(url, payload)
            .then(res=> {
                debugger
                if (res.data.IsSuccess) {
                    this.updateTask(action);
                } else {
                    this.setState(s=>({...s, loading: false}));
                    toastr.error(this.state.task.form_name, "Failed to update task. Please try again later.");
                }
            })
            .catch(res=>{
                this.setState(s=>({...s, loading: false}));
                toastr.error(this.state.task.form_name, "Failed to update task. Please try again later.");
            })

        // Update task
        
    }

    updateTask(action) {
        const _payload = {...this.state.task};
        if (action === 'Approve') {
            _payload.state = 'INPROGRESS';
        };
        TaskService.updateTask(this.state.task._id, _payload)
            .then(res=> {
                if (res.data.IsSuccess) {
                    this.setState(s=>({...s, loading: false}));
                    toastr.success(this.state.task.form_name, "Task has been updated successfully");
                } else {
                    this.setState(s=>({...s, loading: false}));
                    toastr.error(this.state.task.form_name, "Failed to update task. Please try again later.");
                }
            })
            .catch(res=>{
                this.setState(s=>({...s, loading: false}));
                toastr.error(this.state.task.form_name, "Failed to update task. Please try again later.");
            })
    }

    render() {
        const _self = this;
        return (
            <div className={`sf-task-view ${this.props.className} ${this.props.type === 'app' ? ' sf-tf-appview' : ''}`} id={this.props.id}>
                {
                    this.state.loading
                    ?   <Preloader type={'BODY'}/>
                    :   <form action="">
                            <div className="sf-task-view-header">
                                <h1 className="sf-task-view-title">{this.state.task.form_name}</h1>
                                <div className={`sf-task-status${' task-sla-'+ this.state.task.raw_data.sla_status}`} style={{marginRight: 10}}>
                                    {this.state.task.raw_data.sla_status ? <i className="material-icons">check</i> : <i className="material-icons">close</i>}  SLA
                                </div>
                                <div className={`sf-task-status${' task-'+ this.state.task.review_status.toUpperCase()}`}>{this.state.task.review_status}</div>
                            </div>
                            <Divider style={{margin: '0 0 20px 0'}}/>
                            <div className="sf-task-view-summary">
                                <div className="-summary-block">
                                    <div className="-block-row">
                                        <b>Description</b>
                                        <p className="sf-task-view-dxesc">{this.state.task.description}</p>
                                    </div>
                                    <div className="-block-row">
                                        <b>Created date</b>
                                        <div>{ this.state.task.created_at }</div>
                                    </div>
                                    <div className="-block-row">
                                        <b>Updated date</b>
                                        <div>{ this.state.task.updated_at }</div>
                                    </div>
                                </div>
                                <div className="-summary-block">
                                    <div className="-block-row -block-inline">
                                        <b>Requester</b>
                                        <div>
                                            <div className="sf-image-box">
                                                <div className="sf-comment-user">
                                                    {/*{this.state.task.assigner.substring(0, 1)}*/}
                                                    <img src="images-(1).jpg" alt=""/>
                                                    </div>
                                                <span>{this.state.task.assigner}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="-block-row -block-inline">
                                        <b>Assignee</b>
                                        <div>
                                            {
                                                this.state.editAssignee
                                                ?
                                                    this.state.controls.map(control =>
                                                        control.label === 'Reassign'
                                                            ?   <Wrap>
                                                                    <Select
                                                                        value={this.state.reassignTo}
                                                                        onChange={(e)=>this.handleReassign(e, control.link, control.label, _self)}
                                                                        options={this.state.users}
                                                                    />
                                                                    <i className="material-icons revert-contorl" onClick={e=>this.setState(s=>({...s,editAssignee: false}))}>close</i>
                                                                </Wrap>
                                                            :   null
                                                    )
                                                :   <div className="sf-image-box">
                                                        <div className="sf-comment-user">
                                                            {/*{this.state.task.assignee.substring(0, 1)}*/}
                                                            <img src="images-(2).jpg" alt=""/>
                                                        </div>
                                                        <span>{this.state.task.assignee}</span>
                                                        <i className="material-icons" onClick={e=>this.setState(s=>({...s,editAssignee: true}))}>edit</i>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="-block-row -block-inline">
                                        <b>Created</b>
                                        <div>
                                            <div className="sf-image-box">
                                                <div className="sf-comment-user">
                                                    {/*{this.state.task.assigner.substring(0, 1)}*/}
                                                    <img src="images-(1).jpg" alt=""/>
                                                    </div>
                                                <span>{this.state.task.assigner}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="-block-row -block-inline">
                                        <b>Watchers</b>
                                        <div>
                                            <div className="sf-image-box">
                                                <div className="sf-comment-user">
                                                    {/*{this.state.task.assignee.substring(0, 1)}*/}
                                                    <img src="images-(2).jpg" alt=""/>
                                                    </div>
                                                <span>{this.state.task.assignee}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider/>
                                    <div className="-block-sla-info">
                                        <div className="-block-row -block-inline">
                                            <b>Current remaining</b>
                                            <span>
                                        <Timer initialTime={3500000}
                                               direction="backward"
                                               formatValue={(value) => `${(value < 10 ? `0${value}` : value)} : `}>
                                            <Timer.Hours formatValue={value => `${value} : `} />
                                            <Timer.Minutes />
                                            <Timer.Seconds formatValue={value => `${value}`} />
                                        </Timer>
                                    </span>
                                        </div>
                                        <div className="-block-row -block-inline">
                                            <b>Total remaining</b>
                                            <span>
                                        <Timer initialTime={5500000}
                                               direction="backward"
                                               formatValue={(value) => `${(value < 10 ? `0${value}` : value)} : `}>
                                            <Timer.Hours formatValue={value => `${value} : `} />
                                            <Timer.Minutes />
                                            <Timer.Seconds formatValue={value => `${value}`} />
                                        </Timer>
                                    </span>
                                        </div>
                                        <div className="-block-row -block-inline">
                                            <b>Total SLA</b>
                                            <span>10 hours</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <b>Inputs</b>
                            <div className="sf-task-view-content">
                                {
                                    this.state.task.raw_data.RawData1.map(formdata=>
                                        <div className="-content-row">
                                            <div className="-content-row-cell">{formdata.Question}</div>
                                            <div className="-content-row-cell">{formdata.Answer}</div>
                                        </div>
                                    )
                                }
                            </div>

                            <b>Attachments</b>
                            <div className="sf-task-attachments">
                                <i className="material-icons">attachment</i>
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
                                    <textarea id="newComment" value={this.state.newcomment} onChange={(e)=>this.newCommentTrack(e)} placeholder="Type your comment here.." />
                                    <div style={{textAlign: 'right', marginTop: 5}}>
                                        <Button className="sf-button sf-button-secondary sf-button-secondary-s" type="button" onClick={(e)=>this.addComment(e)}>Add</Button>
                                    </div>
                                </div>
                            </div>

                            <Divider/>
                            <div className="sf-task-view-actions">
                                <div className="-reasign-to">
                                    {/*{*/}
                                        {/*this.state.controls.map(control =>*/}
                                            {/*control.label === 'Reassign'*/}
                                                {/*?   <Wrap>*/}
                                                    {/*<Select*/}
                                                        {/*value={this.state.reassignTo}*/}
                                                        {/*onChange={(e)=>this.handleReassign(e, _self)}*/}
                                                        {/*options={this.state.users}*/}
                                                    {/*/>*/}
                                                    {/*<Button type="button" className="sf-button sf-button-primary sf-button-primary-s" onClick={e=>this.executeTask(e, control.link, control.label)}>{control.label}</Button>*/}
                                                {/*</Wrap>*/}
                                                {/*: null*/}
                                        {/*)*/}
                                    {/*}*/}
                                </div>

                                {
                                    this.state.controls.map(control =>
                                        control.label !== 'Reassign'
                                            ?   <Button className={`sf-button${control.label === 'Reject' ? ' sf-button-clear' : control.label === 'Approve' ? ' sf-button-primary sf-button-primary-p' : '' }`} onClick={(e)=>this.executeTask(e, control.link, control.label)}>{control.label}</Button>
                                            :   null
                                    )
                                }
                                {/*<Button className="sf-button sf-button-clear" onClick={(e)=>this.updateTask(e)}>Reject</Button>*/}
                                {/*<Button className="sf-button sf-button-primary sf-button-primary-p" onClick={(e)=>this.updateTask(e)}>Accept</Button>*/}
                            </div>
                        </form>
                }
            </div>
        )
    }
}

const mapStateToProps=s=>({
    user: s.user
});
export default (connect(mapStateToProps))(TaskView);