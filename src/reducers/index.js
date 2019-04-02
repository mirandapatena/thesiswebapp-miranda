import {combineReducers} from 'redux';
import incidentsReducer from './incidentsReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    incidents: incidentsReducer,
    user: userReducer
}); 

export default rootReducer;