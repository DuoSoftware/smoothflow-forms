import { combineReducers } from 'redux'
import FormReducer from './forms.reducer'
import UserReducer from "./user.reducer";
import UIHelperReducer from "./uihelper.reducer";

export default combineReducers({
    'form': FormReducer,
    'user': UserReducer,
    'uihelper' : UIHelperReducer
});

