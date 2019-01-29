const tasks = {
    tasks_open : false,
    tasks_loading : false,
    task_fullwidth : false,
    tasks : {
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
            return {
                ...state,
                'tasks' : action.task
            };

        case 'TASK_FULLWIDTH' :
            return {
                ...state,
                'task_fullwidth' : action.state
            };

        default :
                return state
    }
};

export default TaskReducer;