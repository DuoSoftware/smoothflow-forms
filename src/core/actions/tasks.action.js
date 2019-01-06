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