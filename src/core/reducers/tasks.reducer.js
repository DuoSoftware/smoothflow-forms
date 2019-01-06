const tasks = {
    tasks_open : false,
    tasks_loading : false,
    tasks : []
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
            // const tasks = [...state.tasks];
            // tasks.push(action.task);
            return {
                ...state,
                'tasks' : action.task
            };

        default :
                return state
    }
};

export default TaskReducer;