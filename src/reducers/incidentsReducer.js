import {GET_INCIDENTS} from '../constants';

export default function(state = {}, action){
    switch(action.type){
        case GET_INCIDENTS: 
            return action.payload;
        default: return state;
    }
}