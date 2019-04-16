export const OpenTasks = open => ({
    category: 'TASK',
    type: 'TASK_OPEN',
    open
});

export const InjectTask = task => ({
    category: 'TASK',
    type: 'TASK_INJECT',
    task
});

export const TasksFullwidth = state => ({
    category: 'TASK',
    type: 'TASK_FULLWIDTH',
    state
});

export const TasksIotClient = client => ({
    category: 'TASK',
    type: 'TASK_IOTCLIENT',
    client
});