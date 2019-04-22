import React, {Component} from 'react';
import { Button, Card, Modal, List } from 'semantic-ui-react';
import '../stylesheet_QueueIncidents.css';
import fire from '../config/Fire';
import _ from 'lodash';
import DispatchResponders from './DispatchResponders';
import {computeDistance} from '../functions/computeDistance';

class EmergencyDetails extends Component{

    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            open: false,
            open2: false,
            onlineVolunteers: [{}],
            activeResponders: [{}],
            nearestVolunteers: [{}]
        }
        this.getRespondersList = this.getRespondersList.bind(this);
        this.getReporter();
    }

    show = size => () => {
        this.setState({ size, open: true })
        this.getRespondersList();
    }

    showActiveRespondersList = size2 => () => {
        this.setState({ size2, open2: true, open: false }); 
    }

    close = () => this.setState({ open: false });
    closeActiveRespondersList = () => this.setState({ open2: false });
   
    getRespondersList = () => {
        let activeResponders;
        let activeRespondersList;
        const respondersRef = fire.database().ref('mobileUsers/Responder');
        respondersRef.once('value', snapshot => {
            activeResponders = snapshot.val();
            var respondersList = this.extractActiveResponderDetails(activeResponders);
            activeRespondersList = this.getUsersProfiles(respondersList);
            this.setState({activeResponders: activeRespondersList}, () => {
                console.log('new state', this.state.activeResponders);
            });
        });
    }
    
    extractActiveResponderDetails = (responders) => {
        let activeResponderValues = responders;
        let activeRespondersList = _(activeResponderValues)
                            .keys()
                            .map(key => {
                                let cloned = _.clone(activeResponderValues[key]);
                                cloned.key = key;
                                return cloned;
                            })
                            .value();
        return activeRespondersList;
    }

    getUsersProfiles = (userList) => {
        let userProfile = {};
        let userProfiles = [];
        userList.forEach((user) => {
            console.log('responder keys', user.key);
            var userAccountRef = fire.database().ref(`users/${user.key}`);
            userAccountRef.once('value', snapshot => {
                userProfile = snapshot.val();
                userProfile.key = user.key;
                userProfiles.push(userProfile);
                console.log('user profile', userProfile);
            });
        });
        return userProfiles;
    }

    renderRespondersList = () => {
        var respondersList = this.state.activeResponders;
        console.log('respondesr segsdfgf', respondersList);
        console.log('asdgsdghdhf', respondersList);
        return _.map(respondersList, (responder, key) => {
            console.log('key', responder.key)
            return (
                <DispatchResponders firstName={responder.firstName} lastName={responder.lastName} id={responder.key} incidentID={this.props.incidentKey}/>
            );
        });
    }

    requestVolunteers = () => {
        var volunteerNode = fire.database().ref('mobileUsers/Volunteer');
        var nearestVolunteers = [];
        var onlineVolunteers = [];
        var lng = this.props.coordinates.lng;
        var lat = this.props.coordinates.lat;
        volunteerNode.once('value', snapshot => {
            onlineVolunteers = snapshot.val();        
            console.log('online volunteers', onlineVolunteers);
            this.setState({onlineVolunteers}, () => {
                console.log('volunteers node', this.state.onlineVolunteers);
                nearestVolunteers = this.getNearestVolunteers(lng, lat);
                this.getBestVolunteer(nearestVolunteers);
                this.callVolunteer();
            });
        });
    }

    getBestVolunteer = (nearestVolunteers) => {
        var credentialsNode = fire.database();
        var volunteerWithCredentials = [];
        var volunteerNode;
        nearestVolunteers.map((volunteer, key) => {
            credentialsNode.ref(`credentials/${volunteer.uid}`).once('value', snapshot => {
                volunteerNode = snapshot.val();
                volunteerNode.uid = volunteer.uid
                volunteerWithCredentials.push(volunteerNode);
                console.log('volunteer uid', volunteerWithCredentials);
            });
        });
        volunteerWithCredentials.sort((a,b) => (a.points > b.points) ? 1: (a.points === b.points) ?  1 : -1); // sort volunteers
        this.setState({volunteerWithCredentials: volunteerWithCredentials}, () => {
            console.log('sorted setstate', this.state.volunteerWithCredentials);
        })
    }

    callVolunteer = () => {
        var volunteerNode = fire.database();
        var selectedVolunteers = this.state.volunteerWithCredentials;
        var incidentID = this.props.incidentKey
        var isAccepted = false;

        _.map(selectedVolunteers, (volunteer, key) => {
            var uid = volunteer.uid;
            var incidentIDPromise = volunteerNode.ref(`mobileUsers/Volunteer/${uid}`).update({incidentID});
            incidentIDPromise.then(()=>{
                console.log('incident id saved');
                var isAcceptedPromise = volunteerNode.ref(`mobileUsers/Volunteer/${uid}/isAccepted`).once('value', snapshot => {
                    isAccepted = snapshot.val();
                });
                isAcceptedPromise.then(() => {
                    console.log('isAccepted', isAccepted);
                });
            })    
        });
    }

    getNearestVolunteers = (incidentLng, incidentLat) => {
        var incidentCoordinates = {
            longitude: parseFloat(incidentLng),
            latitude: parseFloat(incidentLat)
        };
        var volunteers = this.state.onlineVolunteers;
        var nearestVolunteers = [];
        var distance; 
        var volunteerObject = {};
        _.map(volunteers, (volunteer, key) => {
            console.log('volunteer key', key);
            volunteerObject = volunteer;
            volunteerObject.uid = key;
            var volunteerCoordinates = {
                latitude: parseFloat(volunteer.coordinates.lat),
                longitude: parseFloat(volunteer.coordinates.lng)
            }
            distance = computeDistance(incidentCoordinates.latitude, incidentCoordinates.longitude, volunteerCoordinates.latitude, volunteerCoordinates.longitude);
            if(distance < 500){
                nearestVolunteers.push(volunteer);
                console.log('nearest volunteers', nearestVolunteers);
            }
        });
        return nearestVolunteers;
    }

    // computeDistance = (lat1, lon1, lat2, lon2) => {
    //     var R = 6371; // Radius of the earth in km
    //     var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    //     var dLon = this.deg2rad(lon2 - lon1);
    //     var a =
    //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //         Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    //         Math.sin(dLon / 2) * Math.sin(dLon / 2);

    //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //     var d = R * c; // Distance in km
    //     return d * 1000;
    // }

    // deg2rad = (deg) => {
    //     return deg * Math.PI / 180
    // }

    getReporter = () => {
        console.log('id lhlhklk', this.props.reportedBy);
        var user = fire.database().ref(`users/${this.props.reportedBy}`);
        var firstName, lastName, snap;
        user.once('value', snapshot => {
            console.log('snapshot', snapshot);
            snap = snapshot.val();
            firstName = snap.firstName;
            lastName = snap.lastName;
            this.setState({firstName, lastName}, () => {
                console.log(`${this.state.firstName} ${this.state.lastName} reported an incident`);
            });
        });
    }
      
    render() {
        const { open, size } = this.state;
        const {open2, size2} = this.state;
        return (
            <div>
                <div className="inc_stat"></div> {/*For "if statement" to change icon per type*/}
            <Card.Group>
                <Card color ='red' onClick={this.show('tiny')}> 
                <Card.Content>
                   <h4>{this.props.incidentKey}</h4>
                   <h5>{this.props.incidentType}</h5>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                        {this.props.incidentLocation}
                    </Card.Description>
                     <br></br>
                </Card.Content>
                </Card>
            </Card.Group>
            
            <Modal size={size} open={open} onClose={this.close}>
                <Modal.Header>New Emergency</Modal.Header>
                    <Modal.Content>
                            <p>Reported by: {this.state.firstName} {this.state.lastName}</p>
                            <p>Type of Incident: {this.props.incidentType}</p>
                            <p>Location of Incident: {this.props.incidentLocation}</p>
                            <p>Coordinates: {this.props.coordinates.lng} {this.props.coordinates.lat}</p>
                            <p>Photo of Incident:</p>
                    </Modal.Content>
                        <Modal.Actions>
                            <Button inverted color='gray' onClick={this.showActiveRespondersList('small')}>
                                Dispatch Responders
                            </Button>
                            <Button inverted color='gray' onClick={this.requestVolunteers}>
                                Request Volunteers
                            </Button>
                        </Modal.Actions>
            </Modal>

            <Modal size={size2} open={open2} onClose={this.closeActiveRespondersList}>
            <Modal.Header>Active Responders</Modal.Header>
                <Modal.Content>
                    <Card.Group itemsPerRow={3}>
                        {this.renderRespondersList()}
                    </Card.Group>
                </Modal.Content>
            </Modal>
        </div>
        );
      }
  
    }

EmergencyDetails.defaultProps = {
    name: 'Command Center Personnel',
    accountID : 12345,
    timeReported: new Date(),
    incidentType: 'Police Emergency',
    incidentLocation: 'Mandaue City'
}
export default EmergencyDetails;
