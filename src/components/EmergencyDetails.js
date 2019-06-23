import React, {Component} from 'react';
import { Button, Card, Modal, Table, Icon, Message, Image } from 'semantic-ui-react';
import '../stylesheet_QueueIncidents.css';
import fire from '../config/Fire';
import _ from 'lodash';
import {callVolunteer} from '../functions/callVolunteer';
import {getNearestMobileUsers} from '../functions/getNearestMobileUsers';
import DispatchMobileUser from './DispatchMobileUser';
import swal from 'sweetalert';
import {NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {computeDistance} from '../functions/computeDistance';

class EmergencyDetails extends Component{

    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            responderFirstName:'',
            responderLastName:'',
            volunteerFirstName: '',
            volunteerLastName: '',
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
            noteIncident: '',
            volunteerAccept: false,
            volunteerReject: false,
            timeOut: false,
            waitTime: false,
            ms: '',
            s: '',
            m: '',
            dispatchNumberOfResponders: '',
            dispatchNumberOfVolunteers: '',
            temp: ''
        }
        // console.log('time received', this.props.timeReceived);
        // var newDate = new Date(this.props.timeReceived);
        // console.log('time fuck', Date.parse(this.props.timeReceived));
        this.getRespondersList = this.getRespondersList.bind(this);
        //this.getReporter();
        this.getResponderName();
        this.getVolunteerName();
        this.requestVolunteers();

        // let start = Date.parse(this.props.timeReceived);
        // setInterval(_ => {
        //     let current = new Date();
        //     let count = +current - +start;
        //     let ms = count % 1000;
        //     let s = Math.floor((count /  1000)) % 60;
        //     let m = Math.floor((count / 60000)) % 60;
        //     this.setState({ms, s, m});
        // }, 10);
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
        
        var isRespondingResponder = fire.database().ref(`incidents/${this.props.incidentKey}/isRespondingResponder`);
        var isRespondingResponderShown = fire.database().ref(`incidents/${this.props.incidentKey}/isRespondingResponderShown`);
        var respondingResponder;
        var respondingResponderShown;
        isRespondingResponder.on('value', snapshot => {
            respondingResponder = snapshot.val();
            this.setState({isRespondingResponder: respondingResponder});
            console.log('isRespondingResponder',respondingResponder);

            isRespondingResponderShown.on('value', snapshot => {
                respondingResponderShown = snapshot.val();
                this.setState({isRespondingResponderShown: respondingResponderShown});
                console.log('isRespondingResponderShown',respondingResponderShown);

                if(respondingResponder === true && respondingResponderShown === false){
                    var a = <div>
                                {/* <p>Incident Type: {this.props.incidentType}</p> */}
                                <p><b>Incident Location:</b> {this.props.incidentLocation}</p>
                                <p>Responder <b>{this.state.responderFirstName} {this.state.responderLastName}</b> has accepted this incident.</p>
                            </div>; 
            
                    NotificationManager.success(a);
                }
            });
        });

        var isRespondingVolunteer = fire.database().ref(`incidents/${this.props.incidentKey}/isRespondingVolunteer`);
        var isRespondingVolunteerShown = fire.database().ref(`incidents/${this.props.incidentKey}/isRespondingVolunteerShown`);
        var respondingVolunteer;
        var respondingVolunteerShown;
        isRespondingVolunteer.on('value', snapshot => {
            respondingVolunteer = snapshot.val();
            this.setState({isRespondingVolunteer: respondingVolunteer});
            console.log('isRespondingVolunteer',respondingVolunteer);

            isRespondingVolunteerShown.on('value', snapshot => {
                respondingVolunteerShown = snapshot.val();
                this.setState({isRespondingVolunteerShown: respondingVolunteerShown});
                console.log('isRespondingVolunteerShown',respondingVolunteerShown);

                if(respondingVolunteer === true && respondingVolunteerShown === false){
                    var a = <div>
                                {/* <p>Incident Type: {this.props.incidentType}</p> */}
                                <p><b>Incident Location:</b> {this.props.incidentLocation}</p>
                                <p>Volunteer <b>{this.state.volunteerFirstName} {this.state.volunteerLastName}</b> has accepted this incident.</p>
                            </div>; 
                    
                    NotificationManager.success(a);
                }
            });
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

    dispatchNumberOfRespondersHandler = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({dispatchNumberOfResponders: e.target.value}, () => {
                console.log('Number of Responders', this.state.dispatchNumberOfResponders);
            })
        }
    }

    dispatchMultipleResponders = (e) => {
        e.preventDefault();
        console.log('dispatch multiple responders');
        var dispatchNumberOfResponders = this.state.dispatchNumberOfResponders;
        var activeResponders = this.state.activeResponders;
        for(var i=0; i< Number(dispatchNumberOfResponders); i++){
            var responderNode = fire.database().ref(`mobileUsers/Responder/${activeResponders[i].key}`);
            responderNode.update({incidentID: this.props.incidentKey}).then(()=>{
                console.log(`${activeResponders[i].key} dispatched`);
            });
        }
    }

    dispatchNumberOfVolunteersHandler = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value == '' || re.test(e.target.value)) {
            this.setState({dispatchNumberOfVolunteers: e.target.value}, () => {
                console.log('Number of volunteers', this.state.dispatchNumberOfVolunteers);
            })
        }
    }

    dispatchMultipleVolunteers = (e) => {
        e.preventDefault();
        console.log('dispatch multiple volunteers');
        var dispatchNumberOfVolunteers = this.state.dispatchNumberOfVolunteers;
        var bestVolunteers = this.state.bestVolunteers;
        for(var i=0; i< Number(dispatchNumberOfVolunteers); i++){
            var volunteerNode = fire.database().ref(`mobileUsers/Volunteer/${bestVolunteers[i].uid}`);
            volunteerNode.update({incidentID: this.props.incidentKey}).then(()=>{
                console.log(`${bestVolunteers[i].key} dispatched`);
            });
        }
    }

    markRedundantReport = (e) => {
        e.preventDefault();
        console.log('redundant report');
        var incidentNode = fire.database().ref(`incidents/${this.props.incidentKey}`);
        incidentNode.update({isRedundantReport: true}).then(()=>{
            console.log('report marked redundant in firebase');
        }).catch(() => {
            console.log(`Error in marking report as redundant. ID: ${this.props.incidentKey}  `);
        });
    }

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
        console.log('heloasdf', this.state.activeResponders);
        return _.map(this.state.activeResponders, (responder, key) => { 
            return (
                <DispatchMobileUser firstName={responder.firstName} lastName={responder.lastName} id={responder.uid} incidentID={this.props.incidentKey} distance={responder.distance} contactNumber={responder.contactNumber} email={responder.email} user_type='Responder'/>
            );
        });
    }

    requestVolunteers = () => {
        let activeVolunteers;
        let activeVolunteersList;
        let volunteersList = [];
        var tempVolunteerObject;
        var incidentCoordinates = {
            longitude: parseFloat(this.props.coordinates.lng),
            latitude: parseFloat(this.props.coordinates.lat)
        };
        var nearestUsers = [];
        var distance; 
        var userObject = {};
        const volunteerRef = fire.database().ref('mobileUsers/Volunteer');
        volunteerRef.once('value', snapshot => {
            activeVolunteers = snapshot.val();
            console.log('activeVolunteersa', activeVolunteers);
            _.map(activeVolunteers, (volunteer, key) => {
                var volunteerDetailsNode = fire.database().ref(`users/${key}`);
                volunteerDetailsNode.once('value', snapshot => {
                    var volunteerDetails = snapshot.val();
                    volunteer.uid = key;
                    volunteer.firstName = volunteerDetails.firstName;
                    volunteer.lastName = volunteerDetails.lastName;
                    volunteer.email = volunteerDetails.email;
                    volunteer.sex = volunteerDetails.sex;
                    volunteer.contactNumber = volunteerDetails.contactNumber;
                    console.log('volunteerDetails', volunteerDetails);
                }).then(()=>{
                    var volunteerCredentialsNode = fire.database().ref(`credentials/${key}`);
                    volunteerCredentialsNode.once('value', snapshot => {
                        var volunteerCredentials = snapshot.val();
                        tempVolunteerObject = {...volunteer, ...volunteerCredentials};
                        volunteersList.push(tempVolunteerObject);
                        console.log('tempVolunteerObject', volunteersList);
                    }).then(()=>{
                        this.setState({
                            temp: volunteersList,
                        }, () => {
                            console.log('asddgasggs', this.state.temp);
                        });
                    });
                    
                }).catch((error)=> {
                    console.log('Error in fetching responders', error);
                });
            });
            // var tempObject = this.state.temp;
            // _.map(tempObject, (volunteer, key) => {
            //     if(!volunteer.isAccepted){
            //         var userCoordinates = {
            //             latitude: parseFloat(volunteer.coordinates.lat),
            //             longitude: parseFloat(volunteer.coordinates.lng)
            //         }
            //         var distance = computeDistance(volunteer.latitude, volunteer.longitude, volunteer.latitude, volunteer.longitude);
            //         volunteer.distance = distance;
            //         if(distance <= 500){
            //             nearestUsers.push(volunteer);
            //             console.log('asfgsdhgsrtgs', nearestUsers);
            //         }
            //     }
            // })

            //     var activeVolunteersLista = getNearestMobileUsers(this.props.coordinates.lng, this.props.coordinates.lat, this.state.temp, 'Volunteer');
            //     // console.log('active volunteer list', activeVolunteersLista);
            //     // // this.setState({bestVolunteers: activeVolunteers}, () => {
            //     // //     console.log('asdgsrgser', this.state.bestVolunteers);
            //     // // });
            //     console.log('asdfasdfgdfgse', activeVolunteersLista);
            
            // this.setState({onlineVolunteers: this.extractActiveMobileUserDetails(activeVolunteers)}, () => {
            //     console.log('active volunteer var', this.state.onlineVolunteers);
            //     activeVolunteersList = getNearestMobileUsers(this.props.coordinates.lng, this.props.coordinates.lat, this.state.onlineVolunteers, 'Volunteer');
            //     console.log('active volunteer list', activeVolunteersList);
            //     this.setState({bestVolunteers: this.getUsersProfiles(activeVolunteersList)}, () => {
            //         //this.getVolunteerCredentials(this.state.bestVolunteers);
            //         console.log('c', this.state.bestVolunteers);
            //     });
            // });
            console.log('then', this.state.temp)
        }).then(()=>{
            console.log('hehe');
            var incidentCoordinates = {
                longitude: parseFloat(this.props.coordinates.lng),
                latitude: parseFloat(this.props.coordinates.lat)
            };
            var nearestUsers = [];
            var distance;
            var tempArray = this.state.temp;
            _.map(tempArray, (volunteer, key) => {
                console.log('looping', volunteer);
                var userCoordinates = {
                    latitude: parseFloat(volunteer.coordinates.lat),
                    longitude: parseFloat(volunteer.coordinates.lng)
                }
                distance = computeDistance(incidentCoordinates.latitude, incidentCoordinates.longitude, userCoordinates.latitude, userCoordinates.longitude);
                volunteer.distance = distance;
                if(distance <= 500){
                    nearestUsers.push(volunteer);
                    console.log('asdfasr', nearestUsers);
                }
            });
            this.setState({bestVolunteers: nearestUsers}, () => {
                console.log('fuck you', this.state.bestVolunteers);
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

    // getVolunteerCredentials = (bestVolunteers) => {
    //     console.log('get volunteer credentials');
    //     _.map(this.state.bestVolunteers, (volunteer, key)=>{
    //         var volunteerNode = fire.database().ref(`credentials/${volunteer.key}`);
    //         volunteerNode.once('value', snapshot => {
    //             console.log('volunteer credentials', snapshot.val());
    //         });
    //     });
    // }

    renderVolunteersList = () => {
        // console.log('renderVolunteersList', this.state.bestVolunteers);
        console.log('volunteers list asdf', this.state.bestVolunteers);
        return _.map(this.state.bestVolunteers, (volunteer, key) => {
            return (
                <DispatchMobileUser firstName={volunteer.firstName} lastName={volunteer.lastName} id={volunteer.uid} incidentID={this.props.incidentKey}
                distance={volunteer.distance} user_type='Volunteer' email={volunteer.email} contactNumber={volunteer.contactNumber} points={volunteer.points} certification={volunteer.certification} medicalDegree={volunteer.medicalDegree} medicalProfession={volunteer.medicalProfession} distance={volunteer.distance}/>
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

    // getReporter = () => {
    //     var user = fire.database().ref(`users/${this.props.reportedBy}`);
    //     var firstName, lastName, snap;
    //     user.once('value', snapshot => {
    //         console.log('snapshot', snapshot);
    //         snap = snapshot.val();
    //         firstName = snap.firstName;
    //         lastName = snap.lastName;
    //         this.setState({firstName, lastName}, () => {
    //             console.log(`${this.state.firstName} ${this.state.lastName} reported an incident`);
    //         });
    //     });
    // }

    getResponderName = () => {
        var user = fire.database().ref(`users/${this.props.responderResponding}`);
        var responderFirstName, responderLastName, snap;
        user.once('value', snapshot => {
            console.log('snapshot', snapshot);
            snap = snapshot.val();
            responderFirstName = snap.firstName;
            responderLastName = snap.lastName;
            this.setState({responderFirstName, responderLastName}, () => {
                console.log(`${this.state.responderFirstName} ${this.state.responderLastName} has responded the incident (responder).`);
            });
        });

    }

    getVolunteerName = () => {
        var user = fire.database().ref(`users/${this.props.volunteerResponding}`);
        var volunteerFirstName, volunteerLastName, snap;
        user.once('value', snapshot => {
            console.log('snapshot', snapshot);
            snap = snapshot.val();
            volunteerFirstName = snap.firstName;
            volunteerLastName = snap.lastName;
            this.setState({volunteerFirstName, volunteerLastName}, () => {
                console.log(`${this.state.volunteerFirstName} ${this.state.volunteerLastName} has responded the incident (volunteer).`);
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
            {this.props.isRespondingResponder === false?
                <div className="inc_stat"></div>:null}
            <Card.Group>
                <Card color ='red' onClick={this.show('tiny')}> 
                    <Card.Header>
                        <p className='incidentStyleType'><b>{this.props.incidentType}</b></p>
                        <p className='incidentContent'>{this.props.incidentKey}</p>
                        <div style={{textAlign: 'center', fontSize:'23px', fontFamily:'sans-serif', color:'red', paddingBottom: '4px'}}>
                            <b>{this.state.m}:{this.state.s}:{this.state.ms}</b>
                        </div>
                    </Card.Header>
                    <Card.Content>
                        <p className='incidentReportedBy'><b>Reported By:</b> {this.props.reportedBy}
                        {this.props.isRespondingResponder === true? 
                            <div><b>Responded By:</b> {this.state.responderFirstName} {this.state.responderLastName}</div>:null}
                        {this.props.isRespondingVolunteer === true? 
                            <div><b>Volunteer:</b> {this.state.volunteerFirstName} {this.state.volunteerLastName}</div>:null}
                        </p>
                        
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
                    <Modal.Content>
                            <Message color='blue'>
                                <div style={{textAlign: 'center', fontSize:'30px', fontFamily:'sans-serif', paddingBottom:'5px'}}>
                                    <b>{this.state.m}:{this.state.s}:{this.state.ms}</b>
                                </div>
                            </Message>
                            <p><b>Reported by:</b> {this.state.firstName} {this.state.lastName}</p>
                            {this.props.isRespondingResponder === true? 
                            <p><b>Responded By:</b> {this.state.responderFirstName} {this.state.responderLastName}</p>:null}
                            {this.props.isRespondingVolunteer === true? 
                            <p><b>Volunteer:</b> {this.state.volunteerFirstName} {this.state.volunteerLastName}</p>:null}
                            <p><b>Type of Incident:</b> {this.props.incidentType}</p>
                            <p><b>Location of Incident:</b> {this.props.incidentLocation}</p>
                            <p><b>Coordinates:</b> {this.props.coordinates.lng} {this.props.coordinates.lat}</p>
                            <p><b>Time Received:</b> {this.props.timeReceived}</p>
                            {this.props.incidentNote === ''?
                            <p><b>Note:</b> No detailed location given by reporter</p>
                                :<p><b>Note:</b> {this.props.incidentNote}</p>}
                            {this.props.incidentPhoto === ''?
                            <p><b>Photo of Incident: No photo of incident uploaded by reporter</b></p>
                                :<p><b>Photo of Incident</b><Image src={this.props.image_uri} size="big"/></p>}

                            
                    </Modal.Content>
                        <Modal.Actions>
                            <Button color='blue' onClick={this.markRedundantReport}>
                                Mark report as redundant
                            </Button>
                            <Button color='red' onClick={this.showActiveRespondersList('small')}>
                                {this.state.isRequestingResponders === true ? 'Request Additional Responders' : 'Dispatch Responders'}
                            </Button>
                            {/*this.requestVolunteers */}
                            <Button color='blue' onClick={this.showActiveVolunteersList('small')}>
                                {this.state.isRequestingVolunteers === true ? 'Request Additional Volunteers' : 'Request Volunteer'}
                            </Button>
                            {/* <Button className='btn btn-success'
                                onClick={this.createNotification('info')}>Success
                            </Button> */}
                        </Modal.Actions>                        
            </Modal>

            <Modal size={size2} open={open2} onClose={this.closeActiveRespondersList}>
            <Modal.Header>Active Responders</Modal.Header>
                <Modal.Content>
                {this.state.activeResponders?
                <div>
                    <Message color='blue'>
                        <div style={{textAlign: 'center', fontSize:'30px', fontFamily:'sans-serif', paddingBottom:'5px'}}>
                            <b>{this.state.m}:{this.state.s}:{this.state.ms}</b>
                        </div>
                    </Message>
                    <form>
                        <div><p>Maximum number of available responders: {this.state.activeResponders.length}</p>
                        <input type="number" name="quantity" min="1" max={this.state.activeResponders.length} onChange={this.dispatchNumberOfRespondersHandler} value={this.state.dispatchNumberOfResponders}/></div>
                        <button onClick={this.dispatchMultipleResponders}>Dispatch {this.state.dispatchNumberOfResponders} responder/s</button>
                    </form>   
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
                    </div>
                    :!this.state.activeResponders?
                    <div style={{paddingTop:'20px', paddingBottom:'20px'}}>
                        <Message info>
                            <Message.Header>
                                <div style={{fontSize:'18px', textAlign:'center'}}>
                                    <Icon name='user'/>No Available Responders
                                </div>
                            </Message.Header>
                        </Message>
                    </div>
                    :null}
                </Modal.Content>
            </Modal>

            <Modal size={size3} open={open3} onClose={this.closeActiveVolunteersList}>
            <Modal.Header>Active Volunteers</Modal.Header>
            <Modal.Content>
            {this.state.bestVolunteers?
            <div>
                    <Message color='blue'>
                        <div style={{textAlign: 'center', fontSize:'30px', fontFamily:'sans-serif', paddingBottom:'5px'}}>
                            <b>{this.state.m}:{this.state.s}:{this.state.ms}</b>
                        </div>
                    </Message>
                    <form>
                        <div><p>Maximum number of available volunteers: {this.state.bestVolunteers.length}</p>
                        <input type="number" name="quantity" min="1" max={this.state.bestVolunteers.length} onChange={this.dispatchNumberOfVolunteersHandler} value={this.state.dispatchNumberOfVolunteers}/></div>
                        <button onClick={this.dispatchMultipleVolunteers}>Dispatch {this.state.dispatchNumberOfVolunteers} volunteer/s</button>
                    </form>   
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
                    
                </div>
                :!this.state.bestVolunteers?
                <div style={{paddingTop:'20px', paddingBottom:'20px'}}>
                    <Message info>
                        <Message.Header>
                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                <Icon name='user'/>No Available Volunteers
                            </div>
                        </Message.Header>
                    </Message>
                </div>
                :null}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='blue' onClick={this.volunteerDispatch}>Request Volunteer</Button>
                </Modal.Actions>
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