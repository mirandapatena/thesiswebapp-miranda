import React, {Component} from 'react';
import { Button, Card, Modal, List } from 'semantic-ui-react';
import '../stylesheet_QueueIncidents.css';
import fire from '../config/Fire';
import _ from 'lodash';
import DispatchResponders from './DispatchResponders';
import {callVolunteer} from '../functions/callVolunteer';
import {getNearestMobileUsers} from '../functions/getNearestVolunteers';

class EmergencyDetails extends Component{

    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            open: false,
            open2: false,
            open3: false,
            onlineVolunteers: [{}],
            activeResponders: [{}],
            nearestVolunteers: [{}],
            isRequestingResponders: false,
            isRequestingVolunteers: false
        }
        this.getRespondersList = this.getRespondersList.bind(this);
        this.getReporter();

        var isRequestingResponders = fire.database().ref(`incidents/${this.props.incidentKey}/isRequestingResponders`);
        var isRequestingVolunteers = fire.database().ref(`incidents/${this.props.incidentKey}/isRequestingVolunteers`);
        var requestResponders;
        var requestVolunteers;
        isRequestingResponders.on('value', snapshot => {
            requestResponders = snapshot.val();
            this.setState({isRequestingResponders: requestResponders});
            if(requestResponders){
                //request responders;
            }
        });
        isRequestingVolunteers.on('value', snapshot => {
            requestVolunteers = snapshot.val();
            this.setState({isRequestingVolunteers: requestVolunteers});
            if(requestVolunteers){
                //request volunteers
            }
        });
    }

    show = size => () => {
        this.setState({ size, open: true })
        this.getRespondersList();
    }

    showActiveRespondersList = size2 => () => {
        this.setState({ size2, open2: true, open: false , open3: false}); 
    }

    showActiveVolunteersList = size3 => () => {
        this.setState({size3, open3: true, open: false, open2: false});
    }

    close = () => this.setState({ open: false });
    closeActiveRespondersList = () => this.setState({ open2: false });
    closeActiveVolunteersList = () => this.setState({ open3: false });

    requestVolunteersListener(){
        

    }
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
                nearestVolunteers = getNearestMobileUsers(lng, lat, this.state.onlineVolunteers);
                this.getBestVolunteer(nearestVolunteers);
                callVolunteer(this.state.volunteerWithCredentials, this.props.incidentKey);
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
    getRequestVolunteerDisplay = () => {
        if(this.state.isRequestingVolunteers){
            return 'Request Additional Volunteers';
        }else{
            return 'Request Volunteer';
        }
    }

    getRequestResponderDisplay = () => {
        if(this.state.isRequestingResponders){
            return 'Request Additional Responders';
        }else{
            return 'Dispatch Responders';
        }
    }

    alertRequest = () => {
       if(this.state.isRequestingResponders){
           return 'asgsdhdrthdf';
       }
       return 'dshdutsdyrstertrjyr';
    }
    render() {
        const { open, size } = this.state;
        const {open2, size2} = this.state;
        const { open3, size3 } = this.state;


       
        // this.locateVolunteers();
        return (
            <div>
            <div className="inc_stat"></div> {/*For "if statement" to change icon per type*/}
            <Card.Group>
                <Card color ='red' onClick={this.show('tiny')}> 
                    <Card.Content>
                    <h4>{this.props.incidentKey}</h4>
                    {this.state.isRequestingVolunteers === true ? <h5>RAV</h5> : ''}
                    {this.state.isRequestingResponders === true ? <h5>RAR</h5> : ''}
                    </Card.Content>
                    <Card.Content>
                    <h5>{this.props.incidentType}</h5>
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
                            <p><b>Reported by:</b> {this.state.firstName} {this.state.lastName}</p>
                            <p><b>Type of Incident:</b> {this.props.incidentType}</p>
                            <p><b>Location of Incident:</b> {this.props.incidentLocation}</p>
                            <p><b>Coordinates:</b> {this.props.coordinates.lng} {this.props.coordinates.lat}</p>
                            <p><b>Photo of Incident:</b></p>
                    </Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={this.showActiveRespondersList('small')}>
                                {this.state.isRequestingResponders === true ? 'Request Additional Responders' : 'Dispatch Responders'}
                            </Button>
                            {/*this.requestVolunteers */}
                            <Button color='blue' onClick={this.showActiveVolunteersList('small')}>
                                {this.state.isRequestingVolunteers === true ? 'Request Additional Volunteers' : 'Request Volunteers'}
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

            <Modal size={size3} open={open3} onClose={this.closeActiveVolunteersList}>
            <Modal.Header>Active Volunteers</Modal.Header>
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
export default EmergencyDetails;
