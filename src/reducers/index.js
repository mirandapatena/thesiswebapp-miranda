import {combineReducers} from 'redux';
import incidentsReducer from './incidentsReducer';

const rootReducer = combineReducers({
    incidents: incidentsReducer,
}); 

export default rootReducer;