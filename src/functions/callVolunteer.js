import fire from '../config/Fire';
import _ from 'lodash';

export function callVolunteer(volunteerWithCredentials, incidentKey){
    var volunteerNode = fire.database();
    var selectedVolunteers = volunteerWithCredentials;
    var incidentID = incidentKey
    var isAccepted = false;

    _.map(selectedVolunteers, (volunteer, key) => {
        // var uid = volunteer.uid;
        // var incidentIDPromise = volunteerNode.ref(`mobileUsers/Volunteer/${uid}`).update({incidentID});
        // incidentIDPromise.then(()=>{
        //     console.log('incident id saved');
        //     var isAcceptedPromise = volunteerNode.ref(`mobileUsers/Volunteer/${uid}/isAccepted`).once('value', snapshot => {
        //         isAccepted = snapshot.val();
        //     });
        //     isAcceptedPromise.then(() => {
        //         console.log('isAccepted', isAccepted);
        //     });
        // })    
    });
}