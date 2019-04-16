import { combineReducers } from 'redux'
import FormReducer from './forms.reducer'
import UserReducer from "./user.reducer";
import UIHelperReducer from "./uihelper.reducer";
import NotificationReducer from "./notifications.reducer";
import TaskReducer from "./tasks.reducer";
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
    'form': FormReducer,
    'user': UserReducer,
    'uihelper' : UIHelperReducer,
    'notifications' : NotificationReducer,
    'tasks' : TaskReducer,
    'toastr': toastrReducer
});

