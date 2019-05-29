import React, { Component } from 'react'
import {KEY} from "../../core/services";
import Wrap from "../../_components/COMMON/Wrap/_wrap";
import {Message} from "../../_components/COMMON/Message/message";
import {Divider, Task} from "../../_components/COMMON";

class TasksContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.tasks.all_tasks.length
                ?   <Wrap>
                    { this.props.tasks.tasks.favourites.length ? <h4>Favourites</h4> : null }

                    {
                        this.props.tasks.tasks.favourites.map(task =>
                            <Task className={this.props.tasks.task_fullwidth ? 'sf-task-full' : ''} key={KEY()} item={task}/>
                        )
                    }
                    <Divider></Divider>
                    <h4>Created Tasks</h4>
                    {
                        this.props.tasks.tasks.general.map(task =>
                            <Task className={this.props.tasks.task_fullwidth ? 'sf-task-full' : ''} key={KEY()} item={task}/>
                        )
                    }
                    <h4>Received Tasks</h4>
                    {
                        this.props.tasks.tasks.general.map(task =>
                            <Task className={this.props.tasks.task_fullwidth ? 'sf-task-full' : ''} key={KEY()} item={task}/>
                        )
                    }
                </Wrap>
                :   <Message>No task has been found</Message>
        )
    }
}

export default TasksContainer