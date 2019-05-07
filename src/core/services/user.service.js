import axios from "axios/index";
import fs from 'fs';
import URLs from "../_urls_";

const UserService = {
    getUserProfile: () => {
        return axios.get(URLs.user.base_ + URLs.user.me)
    },
    getUserSettings: (url) => {
        return axios.get(url)
    }
};

export { UserService }