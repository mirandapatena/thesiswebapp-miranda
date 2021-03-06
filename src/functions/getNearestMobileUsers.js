import {computeDistance} from './computeDistance';
import _ from 'lodash';
import fire from 'firebase'
export function getNearestMobileUsers(incidentLng, incidentLat, mobileUsers, user_type){
    var incidentCoordinates = {
        longitude: parseFloat(incidentLng),
        latitude: parseFloat(incidentLat)
    };
    var nearestUsers = [];
    var distance; 
    var userObject = {};
    console.log('shittt');
    console.log('mobile users', user_type);
    _.map(mobileUsers, (user, key) => {
        userObject = user;
        if(!user.isAccepted){
            userObject.uid = key;
            var userCoordinates = {
                latitude: parseFloat(user.coordinates.lat),
                longitude: parseFloat(user.coordinates.lng)
            }
            distance = computeDistance(incidentCoordinates.latitude, incidentCoordinates.longitude, userCoordinates.latitude, userCoordinates.longitude);
            userObject.distance = distance;
            if(user_type === 'Volunteer'){
                var points;
                if(distance <= 500){
                    console.log('fuckeys', user.key);
                    var volunteerNode = fire.database().ref(`credentials/${user.key}/points`);
                    volunteerNode.once('value', snapshot => {
                        points = snapshot.val();
                        userObject.points = points;
                        console.log('points', userObject);
                    })
                    nearestUsers.push(userObject);
                    console.log('nearest volunteerss', userObject);
                }
            }else if(user_type === 'Responder' && !user.isAccepted){
                nearestUsers.push(user);
                console.log('nearest responders', userObject);
            }
        }
    });
    if(user_type === 'Responder'){
        nearestUsers.sort((a,b) => parseFloat(a.distance) - parseFloat(b.distance));
    }
    if(user_type === 'Volunteer'){
        nearestUsers.sort((a,b) => parseFloat(a.points) - parseFloat(b.points));
        console.log('nearest volunteers', nearestUsers);
    }
    console.log('nearest fuc', nearestUsers);
    return nearestUsers;
}