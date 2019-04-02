import {SIGNED_IN} from '../constants';

let user = {
    email: null
}

export default function userReducer(state = user, action){
    switch(action.type){
        case SIGNED_IN:
            const {email, userID} = action.payload;
            user = {email, userID}
            return user;
        default:
            return state;
    }
}
