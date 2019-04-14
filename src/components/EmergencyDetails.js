import React, {Component} from 'react';
import { Button, Card, Modal, List } from 'semantic-ui-react';
import '../stylesheet_QueueIncidents.css';
import fire from '../config/Fire';
import _ from 'lodash';
import DispatchResponders from './DispatchResponders';
//import HaversineGeolocation from 'haversine-geolocation';
let responders;
class EmergencyDetails extends Component{

    constructor(props){
        super(props);
        this.state = {
            open: false,
            open2: false,
            onlineVolunteer: [{
                uid: '',
                coordinates: {
                    lng: '',
                    lat: '' 
                }
            }],
            activeResponders: [{}]
        }
        this.getRespondersList = this.getRespondersList.bind(this);
    }

    show = size => () => {
        this.setState({ size, open: true })
        this.getRespondersList();
        console.log('Modal pressed');
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
        console.log('asdgsdghdhf', respondersList);
        return _.map(respondersList, (responder, key) => {
            console.log('key', responder.key)
            return (
                <DispatchResponders firstName={responder.firstName} lastName={responder.lastName} id={responder.key} incidentID={this.props.incidentKey}/>
                
            );
        });
    }

    //<ul>{responder.firstName} {responder.lastName} <Button floated='right' color='black' onClick={this.dispatchResponder(responder.key)}>Dispatch</Button></ul>

    dispatchResponder = (responderKey) => {
        console.log('responderasdfsgfds', responderKey);
        var incidentID = this.props.incidentKey;
        // const dispatchRef = fire.database().ref(`mobileUsers/Responder/${responderKey}`);
        // dispatchRef.update({incidentID});
    }
    //<DispatchResponders firstName={responder.firstName} lastName={responder.lastName}/>
    // locateVolunteers = () => {
    //     var volunteerNode = fire.database().ref('mobileUsers/Volunteer');
    //     var onlineVolunteers = [];
    //     var lng = this.props.coordinates.lng;
    //     var lat = this.props.coordinates.lat;
    //     volunteerNode.once('value', snapshot => {
    //         onlineVolunteers = snapshot.val();        
    //         console.log('asdfasgfd', onlineVolunteers);
            
    //     });
    //     this.locateNearestVolunteers(onlineVolunteers, lat, lng);
    // }

    // rad = (x) => {return x*Math.PI/180;}
    // locateNearestVolunteers = (onlineVolunteers, incidentLat, incidentLng) => {
    //     console.log('locatenewasdag', onlineVolunteers);
    //     var radius = 1.5; // sample radius
    //     var lat = incidentLat;
    //     var lng = incidentLng;
    //     var R = 6371; // radius of earth in km
    //     var userFormat = {
    //         uid: '',
    //         coordinates: {
    //             lng: '',
    //             lat: ''
    //         },
    //         distanceToIncident: ''
    //     }
    //     var usersWithDistance = [];
    //     var onlineVolunteersList = _.values(onlineVolunteers);
    //     var {new_lat, new_lng} = this.getRadius(500, lng, lat);
    //     var newCoords = {
    //         longitude: new_lng,
    //         latitude: new_lng
    //     }
    //     var incidentCoords = {
    //         latitude: lat,
    //         longitude: lng
    //     }

    //     console.log(`New lat: ${new_lat} Old lat: ${lat}`);
    //     console.log(`New lng: ${new_lng} Old lat: ${lng}`);
    //     var hav = HaversineGeolocation.getDistanceBetween(incidentCoords, newCoords, 'm');
    //     console.log(`Haversine ${hav}`);
        //TODO: add nearest users to stack
        //create stack of nearest volunteers
        // sort stack with the volunteer with highest points at the top
        // prompt volunteer at top of stack
        // if doest not accept, pop stack
        //   -prompt next volunteer
        // if accept, go to volunteer node in mobileUsers in firebase, listen to node for tracking volunteer
   // }

    // getRadius = (radius, lng, lat) => {
    //     const meters = radius;
    //     const coef = meters * 0.0000089;
    //     const new_lat = lat + coef;
    //     const new_lng = lng + coef / Math.cos(new_lat * 0.018);
    //     return {
    //         new_lat, new_lng
    //     }
    // }

    render() {
        const { open, size } = this.state;
        const {open2, size2} = this.state;
        // this.locateVolunteers();
        return (
            <div>
                <div className="inc_stat"></div> {/*For "if statement" to change icon per type*/}
            <Card.Group>
                <Card color ='red' onClick={this.show('tiny')}> 
                <Card.Content>
                    <Card.Header>{this.props.name}<div className="inc_typ"></div> {/*Incident Type*/}
                    </Card.Header>
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
                            <p>Reported by: {this.props.reportedBy}r</p>
                            <p>Type of Incident: {this.props.incidentType}</p>
                            <p>Location of Incident: {this.props.incidentLocation}</p>
                            <p>Coordinates: {this.props.coordinates.lng} {this.props.coordinates.lat}</p>
                            <p>Photo of Incident:</p>
                    </Modal.Content>
                        <Modal.Actions>
                            <Button inverted color='gray' onClick={this.showActiveRespondersList('tiny')}>
                                Dispatch Responders
                            </Button>
                            <Button inverted color='gray'>
                                Request Volunteers
                            </Button>
                        </Modal.Actions>
            </Modal>

            <Modal size={size2} open={open2} onClose={this.closeActiveRespondersList}>
            <Modal.Header>Active Responders</Modal.Header>
                <Modal.Content>
                    <Card.Group>
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
