import axios from "axios/index";
import fs from 'fs';
import URLs from "../_urls_";

const TaskService = {
    getAllTasks: () => {
        return axios.get(URLs.tasks.getAllTasks)
    },
    getTasksByAssignee: (assignee) => {
        return axios.get(URLs.tasks.getTasksByAssignee + assignee)
    },
    getUserSettings: (url) => {
        return axios.get(url)
    },
    makeFavourite: (id) => {
        return axios.get(URLs.tasks.toggleTaskFavourite + id);
    },
    updateTask: (id, item) => {
        return axios.put(URLs.tasks.updateTask + id, item);
    },
    executeControl: (url, payload) => {
        return axios.post(url, payload);
    }
};

export { TaskService }