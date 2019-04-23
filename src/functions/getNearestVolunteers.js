import {computeDistance} from './computeDistance';
import _ from 'lodash';

export function getNearestMobileUsers(incidentLng, incidentLat, mobileUsers){
    var incidentCoordinates = {
        longitude: parseFloat(incidentLng),
        latitude: parseFloat(incidentLat)
    };
    var nearestUsers = [];
    var distance; 
    var userObject = {};
    _.map(mobileUsers, (user, key) => {
        userObject = user;
        userObject.uid = key;
        var userCoordinates = {
            latitude: parseFloat(user.coordinates.lat),
            longitude: parseFloat(user.coordinates.lng)
        }
        distance = computeDistance(incidentCoordinates.latitude, incidentCoordinates.longitude, userCoordinates.latitude, userCoordinates.longitude);
        if(distance < 500){
            nearestUsers.push(user);
            console.log('nearest volunteers', nearestUsers);
        }
    });
    return nearestUsers;
}