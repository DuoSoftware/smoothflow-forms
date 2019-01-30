import {PreloadNotifications} from "../actions";

const tasks = {
    tasks_open : false,
    tasks_loading : false,
    task_fullwidth : false,
    IotClient : null,
    all_tasks : [],
    tasks: {
        favourites: [],
        general: []
    }
};

const TaskReducer = (state = tasks, action) => {

    switch (action.type) {
        case 'TASK_OPEN' :
            return {
                ...state,
                'tasks_open' : action.open
            };

        case 'TASK_LOADING' :
            return {
                ...state,
                'tasks_loading' : action.loading
            };

        case 'TASK_INJECT' :
            let _tasks = {
                favourites: [],
                general: []
            };
            action.task.map(t => {
                if(t.is_favorite) _tasks.favourites.push(t);
                else _tasks.general.push(t);
            });
            return {
                ...state,
                'all_tasks' : action.task,
                'tasks' : _tasks
            };

        case 'TASK_FULLWIDTH' :
            return {
                ...state,
                'task_fullwidth' : action.state
            };

        case 'TASK_IOTCLIENT' :
            return {
                ...state,
                'IotClient' : action.client
            };

        default :
                return state
    }
};

export default TaskReducer;