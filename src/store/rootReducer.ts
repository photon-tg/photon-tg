import { combineReducers } from 'redux';
import userReducer from '@/model/user/reducer';
import applicationReducer from '@/model/application/reducer';
import battleReducer from '@/model/battle/reducer';
import translationsReducer from '@/model/translations/reducer';

const rootReducer = combineReducers({
	user: userReducer,
	application: applicationReducer,
	battle: battleReducer,
	translations: translationsReducer,
});

export default rootReducer;
