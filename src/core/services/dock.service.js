import axios from "axios/index";
import fs from 'fs';
import URLs from "../_urls_";

const DockService = {
    getAllWorkspaces: () => {
        return axios.get(URLs.dock.getAllWorkspaces)
    }
};

export { DockService }