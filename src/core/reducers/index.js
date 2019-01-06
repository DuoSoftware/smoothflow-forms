import { combineReducers } from 'redux'
import FormReducer from './forms.reducer'
import UserReducer from "./user.reducer";
import UIHelperReducer from "./uihelper.reducer";
import NotificationReducer from "./notifications.reducer";
import TaskReducer from "./tasks.reducer";

export default combineReducers({
    'form': FormReducer,
    'user': UserReducer,
    'uihelper' : UIHelperReducer,
    'notifications' : NotificationReducer,
    'tasks' : TaskReducer
});

