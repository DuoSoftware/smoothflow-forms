import axios from "axios/index";
import fs from 'fs';
import URLs from "../_urls_";

const TaskService = {
    getAllTasks: () => {
        return axios.get(URLs.tasks.getAllTasks)
    },
    getUserSettings: (url) => {
        return axios.get(url)
    },
    makeFavourite: (id) => {
        return axios.get(URLs.tasks.toggleTaskFavourite + id);
    },
    updateTask: (id) => {
        return axios.get(URLs.tasks.updateTask + id);
    }
};

export { TaskService }