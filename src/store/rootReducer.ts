import { combineReducers } from 'redux';
import userReducer from '@/model/user/reducer';
import applicationReducer from '@/model/application/reducer';

const rootReducer = combineReducers({
	user: userReducer,
	application: applicationReducer,
});

export default rootReducer;
