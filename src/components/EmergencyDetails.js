import React, {Component} from 'react';
import { Button, Card, Modal, Table, Icon } from 'semantic-ui-react';
import '../stylesheet_QueueIncidents.css';
import fire from '../config/Fire';
import _ from 'lodash';
import {callVolunteer} from '../functions/callVolunteer';
import {getNearestMobileUsers} from '../functions/getNearestMobileUsers';
import DispatchMobileUser from './DispatchMobileUser';

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
            bestVolunteers: [{}],
            respondersList: [{}],
            activeResponders: [{}],
            nearestVolunteers: [{}],
            isRequestingResponders: false,
            isRequestingVolunteers: false,
            timeReceived: '',
            volunteerAccept: false,
            volunteerReject: false,
            timeOut: false,
            waitTime: false,
            ms: '',
            s: '',
            m: ''
        }
        // console.log('time received', this.props.timeReceived);
        // var newDate = new Date(this.props.timeReceived);
        // console.log('time fuck', Date.parse(this.props.timeReceived));
        this.getRespondersList = this.getRespondersList.bind(this);
        this.getReporter();

        let start = Date.parse(this.props.timeReceived);
        setInterval(_ => {
            let current = new Date();
            let count = +current - +start;
            let ms = count % 1000;
            let s = Math.floor((count /  1000)) % 60;
            let m = Math.floor((count / 60000)) % 60;
            this.setState({ms, s, m});
        }, 10);
    }

    componentDidMount(){
        var isRequestingResponders = fire.database().ref(`incidents/${this.props.incidentKey}/isRequestingResponders`);
        var isRequestingVolunteers = fire.database().ref(`incidents/${this.props.incidentKey}/isRequestingVolunteers`);
        var requestResponders;
        var requestVolunteers;
        isRequestingResponders.on('value', snapshot => {
            requestResponders = snapshot.val();
            this.setState({isRequestingResponders: requestResponders});
        });
        isRequestingVolunteers.on('value', snapshot => {
            requestVolunteers = snapshot.val();
            this.setState({isRequestingVolunteers: requestVolunteers});
        });
    }

    show = size => () => {
        this.getRespondersList();
        this.requestVolunteers();
        this.setState({ size, open: true })
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

    // getVolunteersList = () => {
    //     let activeVolunteers;
    //     let volunteersList = [];
    //     let activeRespondersList;
    //     const volunteerRef = fire.database().ref('mobileUsers/Responder');
    //     volunteerRef.once('value', snapshot => {
    //         activeVolunteers = snapshot.val();
    //         var volunteerList = 
    //     });
    // }

    getRespondersList = () => {
        let activeResponders;
        let activeRespondersList;
        const respondersRef = fire.database().ref('mobileUsers/Responder');
        respondersRef.once('value', snapshot => {
            activeResponders = snapshot.val();
            this.setState({respondersList: this.extractActiveMobileUserDetails(activeResponders)}, () => {
                activeRespondersList = getNearestMobileUsers(this.props.coordinates.lng, this.props.coordinates.lat, this.state.respondersList, 'Responder');
                console.log('activeRespondersList', activeResponders);
                this.setState({activeResponders: this.getUsersProfiles(activeRespondersList)}, () => {
                    console.log('new state', this.state.activeResponders);
                });
            });
        });
    }
    
    extractActiveMobileUserDetails = (mobileUsers) => {
        let activeMobileUserValues = mobileUsers;
        let activeMobileUserList = _(activeMobileUserValues)
                            .keys()
                            .map(key => {
                                let cloned = _.clone(activeMobileUserValues[key]);
                                cloned.key = key;
                                return cloned;
                            })
                            .value();
        return activeMobileUserList;
    }

    getUsersProfiles = (userList) => {
        let userProfile = {};
        let userProfiles = [];
        let temp;
        userList.forEach((user) => {
            console.log('responder keys', user.key);
            var userAccountRef = fire.database().ref(`users/${user.key}`);
            userAccountRef.once('value', snapshot => {
                temp = snapshot.val();
                // user.firstName = userProfile.firstName;
                // user.lastName = userProfile.lastName;
                // user
                // userProfile.key = user.key;
                userProfile = user;
                console.log('get user profiles', user.isAccepted);
                if(!user.isAccepted){
                    userProfile.uid = user.key;
                    userProfile.firstName = temp.firstName;
                    userProfile.lastName = temp.lastName;
                    userProfile.email = temp.email;
                    userProfile.contactNumber = temp.contactNumber;
                    userProfiles.push(userProfile);
                }
                
                console.log('user profile', userProfile);
            });
        });
        return userProfiles;
    }

    renderRespondersList = () => {
        //var respondersList = this.state.activeResponders;
        //console.log('responders lista', respondersList);
        return _.map(this.state.activeResponders, (responder, key) => {
            return (
                <DispatchMobileUser firstName={responder.firstName} lastName={responder.lastName} id={responder.uid} incidentID={this.props.incidentKey} distance={responder.distance} contactNumber={responder.contactNumber} email={responder.email} user_type='Responder'/>
            );
        });
    }

    requestVolunteers = () => {
        let activeVolunteers;
        let activeVolunteersList;
        const volunteerRef = fire.database().ref('mobileUsers/Volunteer');
        volunteerRef.once('value', snapshot => {
            activeVolunteers = snapshot.val();
            console.log('activeVolunteersa', activeVolunteers);
            this.setState({onlineVolunteers: this.extractActiveMobileUserDetails(activeVolunteers)}, () => {
                console.log('active volunteer var', this.state.onlineVolunteers);
                activeVolunteersList = getNearestMobileUsers(this.props.coordinates.lng, this.props.coordinates.lat, this.state.onlineVolunteers, 'Volunteer');
                console.log('active volunteer list', activeVolunteersList);
                this.setState({bestVolunteers: this.getUsersProfiles(activeVolunteersList)}, () => {
                    console.log('the best', this.state.bestVolunteers);
                });
            });
        });
    }

    renderVolunteersList = () => {
        console.log('renderVolunteersList', this.state.bestVolunteers);
        return _.map(this.state.bestVolunteers, (volunteer, key) => {
            return (
                <DispatchMobileUser firstName={volunteer.firstName} lastName={volunteer.lastName} id={volunteer.uid} incidentID={this.props.incidentKey}
                distance={volunteer.distance} user_type='Volunteer' email={volunteer.email} contactNumber={volunteer.contactNumber}/>
            );
        });
    }

    volunteerDispatch = () => {
        while(this.state.m <= 7){
            var volunteer = this.state.bestVolunteers;
            volunteer.forEach((volunteer)=>{
                var isAccepted = false;
                while(!(this.state.s % 30) === 0 || !this.state.isAccepted){
                    var volunteerNode = fire.database().ref(`mobileUser/Volunteer/${volunteer.uid}`);
                    var isAcceptedNode = fire.database().ref(`mobileUser/Volunteer/${volunteer.uid}/isAccepted`);
                    volunteerNode.update({incidentID: this.props.incidentKey});
                    isAcceptedNode.once('child_changed', snapshot => {
                        isAccepted = snapshot.val();
                        this.setState({isAccepted});
                    });
                }
            });
            
        }
    }

    getBestVolunteer = (nearestVolunteers) => {
        var credentialsNode = fire.database();
        var volunteerWithCredentials = [];
        var volunteerNode;
        nearestVolunteers.map((volunteer, key) => {
            console.log('volunteer distance', volunteer.distance);
            credentialsNode.ref(`credentials/${volunteer.uid}`).once('value', snapshot => {
                volunteerNode = snapshot.val();
                volunteerNode.uid = volunteer.uid
                volunteerNode.distance = volunteer.distance;
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
                    <Card.Header>
                        <p className='incidentStyleType'><b>{this.props.incidentType}</b></p>
                        <p className='incidentContent'>{this.props.incidentKey}</p>
                        <p>{this.state.m}:{this.state.s}:{this.state.ms}</p>
                    </Card.Header>
                    <Card.Content>
                        <p className='incidentReportedBy'><b>Reported By:</b> {this.state.firstName} {this.state.lastName}</p>
                        <Card.Description>
                            <b>{this.props.incidentLocation}</b>
                        </Card.Description> 
                        <br></br>
                    {this.state.isRequestingVolunteers === true ?
                        <Card.Description extra style={{paddingBottom:'3px', paddingTop: '3px', color: 'red', borderTop:'0px solid!important', fontSize:'12px'}}>
                            <p className='card-extra'>Requesting Additional Volunteer <Icon name='warning circle'/></p>
                        </Card.Description>:null}
                    {this.state.isRequestingResponders === true ?
                        <Card.Description extra style={{paddingBottom:'3px', paddingTop: '3px', color: 'red', borderTop:'0px solid!important', fontSize:'12px'}}>
                            <p>Requesting Additional Responder <Icon name='warning circle'/></p>
                        </Card.Description>:null}
                    </Card.Content>
                </Card>
            </Card.Group>
            
            <Modal size={size} open={open} onClose={this.close}>
                <Modal.Header>New Emergency</Modal.Header>
                    <p>{this.state.m}:{this.state.s}:{this.state.ms}</p>
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
                                {this.state.isRequestingVolunteers === true ? 'Request Additional Volunteers' : 'Request Volunteer'}
                            </Button>
                        </Modal.Actions>
            </Modal>

            <Modal size={size2} open={open2} onClose={this.closeActiveRespondersList}>
            <Modal.Header>Active Responders</Modal.Header>
                <Modal.Content>
                    <p>{this.state.m}:{this.state.s}:{this.state.ms}</p>
                    {/* <Card.Group itemsPerRow={3}>
                        {this.renderRespondersList()}
                    </Card.Group> */}
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Responders</Table.HeaderCell>
                                <Table.HeaderCell>Responder Details</Table.HeaderCell>
                                <Table.HeaderCell>Dispatch</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.renderRespondersList()}
                        </Table.Body>
                    </Table>
                </Modal.Content>
            </Modal>

            <Modal size={size3} open={open3} onClose={this.closeActiveVolunteersList}>
            <Modal.Header>Active Volunteers</Modal.Header>
                <Modal.Content>
                    <p>{this.state.m}:{this.state.s}:{this.state.ms}</p>
                    {/* <Card.Group itemsPerRow={3}>
                        {this.renderVolunteersList()}
                    </Card.Group> */}
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Volunteers</Table.HeaderCell>
                                <Table.HeaderCell>Volunteer Details</Table.HeaderCell>
                                <Table.HeaderCell>Dispatch</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.renderVolunteersList()}
                        </Table.Body>    
                    </Table>
                    <Button onClick={this.volunteerDispatch}>Request Volunteer</Button>
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