/*global google*/
import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Modal, Form, Button, Radio, Select, Image } from 'semantic-ui-react'
import fire from '../config/Fire';
import {connect} from 'react-redux';
import {saveIncident} from '../actions/incidentAction';
import {createUserAccount} from '../functions/createUserAccount';
import ResponderAccountLists from './ResponderAccountLists';
import VolunteerAccountLists from './VolunteerAccountLists';
import RegularUserAccountLists from './RegularUserAccountLists';
import DeleteResponder from './DeleteResponder';
import DeleteVolunteer from './DeleteVolunteer';
import DeleteRegularUser from './DeleteRegularUser';
import DeleteCCP from './DeleteCCP';
import DeleteAdmin from './DeleteAdmin';
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import PlacesAutocomplete, {geocodeByAddress, getLatLng, geocodeByPlaceId} from 'react-places-autocomplete';
import vehicularUnresponded from '../../src/images/va_new.png';
import vehicularResponding from '../../src/images/va_otw.png';
import vehicularSettled from '../../src/images/va_fin.png';
import physicalUnresponded from '../../src/images/pi_new.png';
import physicalResponding from '../../src/images/pi_otw.png';
import physicalSettled from '../../src/images/pi_fin.png';
import volunteerLogo from '../images/tracking_volunteer.png';
import responderLogo from '../images/tracking_responder.png';


const emailRegex = RegExp(
  /^([a-zA-Z0-9_.\-]+)@([a-zA-Z]+)\.([a-zA-Z]{2,5})$/
);

const contactNumberRegex = RegExp(
  /^(09|\+639)\d{9}$/
);

const firstNameRegex = RegExp(
  /^[a-zA-ZñÑ.,'-\s]+$/
);

const lastNameRegex = RegExp(
  /^[a-zA-ZñÑ.,'-\s]+$/
);


const formValid = ({ formError, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formError).forEach(val => {
    val.length > 0 && (valid = false)
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });


  return valid;
}


class HeaderDashboard extends Component{
  
  constructor(props){
    
      super(props);
      
      this.state = {
        open: false,
        open2: false,
        incidentType: '',
        incidentLocation: '',
        destinationPlaceId:'',
        errorAddress:'',
        unresponded: null,
        isResponding: null,
        isSettled: null,
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        user_type: '',
        contactNumber: '',
        sex: '',
        lat: null,
        lng: null,
        errorMessage: '',
        incidentPhoto: null,
        reportedBy: '',
        timeReceived: null,
        timeResponded: null,
        responderResponding: [],
        volunteerResponding: '',
        durationService: '',
        medicalDegree:'',
        medicalProfession:'',
        certification:'',
        isActiveVolunteer:'',
        formError: {
          firstName:'',
          lastName:'',
          email:'',
          password:'',
          contactNumber:'',
          sex: '',
          user_type:''
      },
      userID: ''  
      }
      this.logout = this.logout.bind(this);
      this.submitCreateAccount = this.submitCreateAccount.bind(this);
  }

  // getUserDetails = () => {
  //   let userAccount;
  //   console.log('getuserdetails', this.state.userID);
  //   fire.database().ref('users/'+this.state.userID).once("value", snapshot => {
  //     userAccount = snapshot.val();
  //     this.setState({userAccount: userAccount});
  //     console.log('userAccount', this.state.userAccount);
  //   });
  // }

  show = size => () => this.setState({ size, open: true })
  close = () => this.setState(
    { open: false, incidentType: '', incidentLocation: '', errorMessage:'', errorAddress:'' })

  show2 = size2 => () => this.setState({ size2, open2: true })
  close2 = () => this.setState({ open2: false, firstName: '', lastName: '', password: '', email: '',
                                 user_type: '', contactNumber: '', durationService: '', medicalDegree:'',
                                 medicalProfession:'', certification:'', isActiveVolunteer:'', sex:'',
                                 formError: { firstName:'', lastName:'', email:'', password:'', 
                                 contactNumber:'', user_type:''} })

  showAccountLists = size3 => () => this.setState({ size3, open3: true, open4:false, open5:false })
  close3 = () => this.setState({ open3: false, open4: false, open5: false })

  showVolunteerLists = size4 => () => this.setState({ size4, open4: true, open3:false, open5:false })
  close4 = () => this.setState({ open3: false, open4: false, open5: false })

  showRegularUserLists = size5 => () => this.setState({ size5, open5: true, open3:false, open4:false })
  close5 = () => this.setState({ open3: false, open4: false, open5: false })

  showResponder = size6 => () => this.setState({ size6, open6: true, open7: false, open8: false, open9: false, open10: false })
  close6 = () => this.setState({ open6: false, open7: false, open8: false  })

  showVolunteer = size7 => () => this.setState({ size7, open7: true, open6: false, open8: false, open9: false, open10: false })
  close7 = () => this.setState({ open7: false })

  showRegularUser = size8 => () => this.setState({ size8, open8: true, open6: false, open7: false, open9: false, open10: false  })
  close8 = () => this.setState({ open8: false })

  showCCP = size9 => () => this.setState({ size9, open9: true, open6: false, open7: false, open8: false, open10: false })
  close9 = () => this.setState({ open9: false })

  showAdmin = size10 => () => this.setState({ size10, open10: true, open6: false, open7: false, open8: false, open9: false })
  close10 = () => this.setState({ open10: false })

  handleChange = (incidentLocation, destinationPlaceId)  => {
      this.setState({ incidentLocation, destinationPlaceId, errorMessage: '', errorAddress:'' });
  };

  handleSelect = (incidentLocation, destinationPlaceId) => {
    geocodeByPlaceId(destinationPlaceId)
    .then(results => {geocodeByPlaceId(results[0].place_id)
    // .then(placeId => {
        this.setState({destinationPlaceId});
        console.log('destinationPlaceId:',destinationPlaceId)
        console.log(results)
    })
    .catch(error => console.error(error));

    
    geocodeByAddress(incidentLocation)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
          this.setState({lng: latLng.lng, lat: latLng.lat});
          console.log('Incident Location:',incidentLocation)
      })
      .catch(errorAddress => {
        var errorAddress;
        console.log('Invalid Address!', errorAddress);
        this.setState({errorAddress:errorAddress}) // eslint-disable-line no-console
      });
  };

  handleCloseClick = () => {
    this.setState({
      incidentLocation: '',
      latitude: null,
      longitude: null,
    });
  };

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status); // eslint-disable-line no-console
    this.setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  inputIncidentTypeHandler = (e, {incidentType}) => this.setState({ incidentType})

  inputIncidentLocationHandler = (e) => {
    this.setState({ incidentLocation: e.target.value });
  }

  submitIncidentHandler = (e) => {
    // console.log('uid reported', this.props.user.uid);
    e.preventDefault();
    
    var d = Date();
    var a = d.toString()  

    const timeReceived = a;
    const incident = {
      incidentType: this.state.incidentType,
      incidentLocation: this.state.incidentLocation,
      unresponded: true,
      isResponding: false,
      isSettled: false,
      coordinates: {lng: this.state.lng, lat: this.state.lat},
      incidentPhoto: '',
      reportedBy: this.props.uid.uid,
      timeReceived,
      timeResponded: '',
      timeSettle: '',
      responderResponding: '',
      volunteerResponding: '',
      destinationPlaceId: this.state.destinationPlaceId,
      isRequestingResponders: false,
      isRequestingVolunteers: false,
      isRespondingResponder: false,
      unrespondedResponder: true,
      isRespondingVolunteer: false,
      unrespondedVolunteer: true
    }
    this.props.saveIncident(incident);
    this.setState({
        incidentType: '',
        incidentLocation: '',
        destinationPlaceId: '',
        unresponded: false,
        isResponding: false,
        isSettled: false,
        lng: null,
        lat: null,
    });
    console.log(this.state.incidentsList);
  }

  handleCreateAccount = (e) => {
    e.preventDefault();
    //this.setState({[e.target.name]: e.target.value});
    const { name, value } = e.target;
    
    let formError = { ...this.state.formError };

      switch (name) {

      case "firstName":
        formError.firstName = firstNameRegex.test(value) ? "" : "Please enter a valid name.";
        break;

      case "lastName":
        formError.lastName = lastNameRegex.test(value) ? "" : "Please enter a valid name.";
        break;

      case "email":
        formError.email = emailRegex.test(value)? "" : "Please enter a valid email address.";
        break;

      case "password":
        formError.password = value.length < 8 ? "Password should at least 8 characters" : "";
        break;

      // case "confirmPassword":
      //   formError.confirmPassword = value.length < 8 ? "Password should at least 8 characters" : "";
      //   break;

      case "contactNumber":
        formError.contactNumber = contactNumberRegex.test(value)? "": "Please enter a valid number (09XXXXXXXX or +639XXXXXXXX)";
        break;
      
      // case "sex":
      //   formError.sex = genderRegex.test(value) ? "" : "Please select.";
      //   break;

      default:
        break;
    }

    
       this.setState({ formError, [name]: value }, () => console.log(this.state));

  };
  
  inputUserTypeHandler = (e, { value }) => {
    //this.setState({user_type: e.target.value})
    this.setState({ user_type: value })
    //console.log('USRER TPsdfgs', value);
  };

  inputUserTypeHandler_volunteer = (e, { value }) => {
    this.setState({ isActiveVolunteer: value })
  };

  inputUserTypeHandler_medicalDegree = (e, { value}) => {
    this.setState({medicalDegree: value })
  };

  inputUserTypeHandler_medicalProfession = (e, { value}) => {
    this.setState({medicalProfession: value })
  };

  inputUserTypeHandler_durationService = (e, { value}) => {
    this.setState({durationService: value })
  };
  
  inputUserTypeHandler_certification = (e, { value}) => {
    this.setState({certification: value })
  };

  inputSex = (e, { value}) => {
    this.setState({sex: value })
  };

  submitCreateAccount = (e) => {

    e.preventDefault();
    var isMobile = false;
    var err = '';
    if(this.state.user_type === 'Regular User' || this.state.user_type === 'Responder' || this.state.user_type === 'Volunteer'){
      isMobile = true;
    }

    const account = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password,
      email: this.state.email,
      user_type: this.state.user_type,
      contactNumber: this.state.contactNumber,
      sex: this.state.sex,
      isMobile,
      isVerified: false
    }

    const credentials = {
      medicalProfession: this.state.medicalProfession,
      medicalDegree: this.state.medicalDegree,
      certification: this.state.certification,
      isActiveVolunteer: this.state.isActiveVolunteer,
      forVA: false,
      forPI: false,
      durationService: this.state.durationService
    }

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        First Name: ${this.state.firstName}
        Last Name: ${this.state.lastName}
        Email: ${this.state.email}
        Password: ${this.state.password}
        Contact Number: ${this.state.contactNumber}
        Gender: ${this.state.sex}
        User Type: ${this.state.user_type}
      `);
    }
    if(account.user_type === 'Volunteer'){
      err = createUserAccount(account, credentials);
      this.setState({err: err});
    }else{
      err = createUserAccount(account);
      this.setState({err: err});
    }
    this.setState({
      firstName: '',
      lastName: '',
      userName: '',
      password: '',
      email: '',
      user_type: '',
      contactNumber: '',
      sex: '',
      medicalProfession: '',
      medicalDegree: '',
      certification: '',
      isActiveVolunteer: ''
    })

  }

  trigger = (
    <span>
      <Icon className='user circle' /> {this.props.user.firstName} {this.props.user.lastName}
    </span>
  )
  
  options = [
    { key: 'user', text: 'Account', icon: 'user' },
    // { key: 'help', text: 'Help', icon: 'question' },
    // { key: 'settings', text: 'Settings', icon: 'settings' },
    { key: 'sign-out', text: 'Sign Out', icon: 'sign out', onClick: this.logout },
  ]
  
   
  logout() {
    fire.auth().signOut();
  }

  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  

  render() {
    const { open, size, open2, size2, open3, size3, open4, 
            size4, open5, size5, open6, size6, open7, size7,
            open8, size8, open9, size9, open10, size10
          } = this.state
    const { formError } = this.state;
    let createUserAccountButton;
    let accountLists;
    let deleteUser;

    const {errorMessage} = this.state;

    const searchOptions = {
      location: new google.maps.LatLng(10.324646, 123.942197),
      radius: 10,
      types: ['establishment']
    }

    if(this.props.user_type === 'Administrator'){
      createUserAccountButton = <Menu.Item link onClick={this.show2('tiny')}>
      <Icon className="add user" />Create User Account
      </Menu.Item>
       accountLists = <Menu.Item link onClick={this.showAccountLists('tiny')}>
       <Icon className="list" />Unverified Mobile Users
       </Menu.Item>
       deleteUser = <Menu.Item link onClick={this.showAdmin('tiny')}>
        <Icon className="user delete" />Delete User
      </Menu.Item>
       

    }
  

    const userTypeOptions = [
    { text: 'Administrator', value: 'Administrator'},
    { text: 'Command Center Personnel', value: 'Command Center Personnel'},
    { text: 'Responder', value: 'Responder'},
    { text: 'Volunteer', value: 'Volunteer'},
    { text: 'Regular User', value: 'Regular User'}
  ]

    const activeVolunteerOptions = [
      { text: 'Yes', value: 'Yes'},
      { text: 'No', value: 'No'},
    ]

    const surgeon_medicalDegreeOptions = [
      { text: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', value: 'Bachelor of Medicine and Bachelor of Surgery'},
      { text: 'Master of Medicine (MM, MMed)', value: 'Master of Medicine'},
      { text: 'Master of Surgery (MS, MSurg, ChM)', value: 'Master of Surgery'},
      { text: 'Master of Medical Science (MMSc, MMedSc)', value: 'Master of Medical Science'},
      { text: 'Doctor of Medical Science (DMSc, DMedSc)', value: 'Doctor of Medical Science'},
      { text: 'Doctor of Surgery (DS, DSurg)', value: 'Doctor of Surgery'},
      { text: 'Doctor of Medicine (MD)', value: 'Doctor of Medicine'},
    ]

    const surgeon_certificationOptions = [
      { text: 'General Surgeon Board Certification', value: 'General Surgeon Board Certification'},
    ]

    const nurse_medicalDegreeOptions = [
      { text: 'Bachelor of Science in Nursing (BSN)', value: 'Bachelor of Science in Nursing'},
      { text: 'Associate Degree in Nursing (ADN)', value: 'Associate Degree in Nursing'},
    ]

    const nurse_certificationOptions = [
      { text: 'Maternal and Child Health Nursing', value: 'Maternal and Child Health Nursing'},
      { text: 'Emergency and Trauma Nursing', value: 'Emergency and Trauma Nursing'},
      { text: 'Cardiovascular Nursing', value: 'Cardiovascular Nursing'},
    ]

    const ems_medicalDegreeOptions = [
      {text: 'Emergency Medical Services NC II', value: 'Emergency Medical Services NC II'},
    ]

    const ems_certificationOptions = [
      {text: 'Medical First Responder', value: 'Medical First Responder'},
      {text: 'Ambulance Care Assistants', value: 'Ambulance Care Assistants'},
      {text: 'Emergency Medical Technicians', value:'Emergency Medical Technicians'},
      {text: 'Paramedics', value: 'Paramedics'},
    ]

    const medicalProfessionOptions = [
      { text: 'Nurse', value: 'Nurse'},
      { text: 'Surgeon', value: 'Surgeon'},
      { text: 'Emergency Medical Service Personnel', value: 'Emergency Medical Service Personnel'},
    ]

    const durationServiceOptions = [
      {text: '1 year', value: 1},
      {text: '2 years', value: 2},
      {text: '3 years', value: 3},
      {text: '4 years', value: 4},
      {text: '5 years', value: 5},
      {text: '6 years', value: 6},
      {text: '7 years', value: 7},
      {text: '8 years', value: 8},
      {text: '9 years', value: 9},
      {text: '10 years', value: 10},
    ]

    const sex = [
      { text: 'Male', value: 'Male'},
      { text: 'Female', value: 'Female'},
    ]

    return (

    <div>
      {/* Header Menu */}
      <Menu inverted>
          <Menu.Menu position='left'>
              <Menu.Item>
                 <span className="appLogo"></span><span style={{marginLeft:"40px"}}>Tabang!</span>
              </Menu.Item>
              <Menu.Item link onClick={this.show('tiny')}>
                 <Icon className="plus" />Add Incident
              </Menu.Item>
              {createUserAccountButton}
              {accountLists}
              {deleteUser}
          </Menu.Menu>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Dropdown text='Legends' pointing='top right' floating iconPosition='right' icon='caret down'  >
                <Dropdown.Menu>
                  <Dropdown.Item><Image src={vehicularUnresponded} size='mini' floated='right'/>Vehicular Unresponded</Dropdown.Item>
                  <Dropdown.Item><Image src={vehicularResponding} size='mini' floated='right'/>Vehicular Responding</Dropdown.Item>
                  <Dropdown.Item><Image src={vehicularSettled} size='mini' floated='right'/>Vehicular Settled</Dropdown.Item>
                  <Dropdown.Item><Image src={physicalUnresponded} size='mini' floated='right'/>Physical Unresponded</Dropdown.Item>
                  <Dropdown.Item><Image src={physicalResponding} size='mini' floated='right'/>Physical Responding</Dropdown.Item>
                  <Dropdown.Item><Image src={physicalSettled} size='mini' floated='right'/>Physical Settled</Dropdown.Item>
                  <Dropdown.Divider/>
                  <Dropdown.Item><Image src={responderLogo} size='mini' floated='right'/>Responder</Dropdown.Item>
                  <Dropdown.Item><Image src={volunteerLogo} size='mini' floated='right'/>Volunteer</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            <Menu.Item onClick={this.handleItemClick}>
              <Dropdown trigger={this.trigger} options={this.options} pointing='top left' icon={null} />
            </Menu.Item>
          </Menu.Menu>
      </Menu>
      {/* Header Menu */}
    
      {/* Add Incident Modal */}
      <Modal size={size} open={open} onClose={this.close}>
      <Modal.Header>New Emergency</Modal.Header>
          <Modal.Content>
              <Form>
                <Form.Field>
                  <label>Type of Incident</label>
                    <Radio
                      label='Vehicular Accident'
                      incidentType='Vehicular Accident'
                      checked={this.state.incidentType === 'Vehicular Accident'}
                      onChange={this.inputIncidentTypeHandler}
                    />
                    <br/>
                    <Radio
                      label='Physical Injury'
                      incidentType='Physical Injury'
                      checked={this.state.incidentType === 'Physical Injury'}
                      onChange={this.inputIncidentTypeHandler}
                    />
                  </Form.Field>
                  <Form.Field>
                  <label>Incident Location</label>
                  <PlacesAutocomplete
                      onError={this._handleError}
                      clearItemsOnError={true}
                      value={this.state.incidentLocation}
                      onChange={this.handleChange}
                      onSelect={this.handleSelect}
                      searchOptions={searchOptions}
                      // shouldFetchSuggestions={this.state.incidentLocation.length > 3}
                  >
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div>
                          <input 
                          {...getInputProps({
                              placeholder: 'Search Places ...',
                              className: 'location-search-input',
                          })} 
                          />
                          
                          <div className="autocomplete-dropdown-container">
                          {loading && <div>Loading...</div>}
                          {suggestions.map(suggestion => {
                              const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                              // inline style for demonstration purpose
                              const style = suggestion.active
                              ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                              : { backgroundColor: '#ffffff', cursor: 'pointer' };
                              return (
                              <div
                                  {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                  })}
                              >
                                  <span>{suggestion.description}</span>
                              </div>
                              );
                          })}
                          </div>
                      </div>
                      )}
                  </PlacesAutocomplete>   
                  {errorMessage.length > 0 && (<div>{this.state.errorMessage}</div>
                    )}
                  {this.state.errorAddress?
                    <div>{this.state.errorAddress}</div>:null}
                  </Form.Field>
              </Form>
              </Modal.Content>
              <Modal.Actions>
              {this.state.incidentLocation.length > 0 && (
                  <Form.Button floated='left' color='red' onClick={this.handleCloseClick}> Clear </Form.Button>)}
                  <Form.Button color='red' onClick={this.submitIncidentHandler} 
                            disabled={!this.state.incidentLocation || !this.state.incidentType 
                                      || this.state.errorMessage || this.state.errorAddress
                                      || !this.state.destinationPlaceId
                                      }>
                      Submit
                  </Form.Button>
                 
        </Modal.Actions>
      </Modal>
      {/* Add Incident Modal */}

      {/*Create Personnel Account Modal*/}
      <Modal size={size2} open={open2} onClose={this.close2}  onClick={(event) => {this.handleCreateAccount(event);}}noValidate>
      <Modal.Header>New User Account </Modal.Header>
          <Modal.Content>
              <Form onClick={this.handleCreateAccount}>

                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'whitesmoke'}} required>
                    <Form.Input
                      fluid
                      placeholder='Email Address'
                      type='email'
                      name='email'
                      noValidate
                      value={this.state.email}
                      className={formError.email.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                      required
                    />
                      {formError.email.length > 0 && (
                      <span className="errorMessage">{formError.email}</span>)}
                  </Form.Field>   

                 {this.state.user_type === 'Volunteer' ? 
                    <Form.Field
                      control={Select}
                      options={medicalProfessionOptions}                
                      placeholder='Medical Profession'
                      search
                      onChange={this.inputUserTypeHandler_medicalProfession}
                      required                  
                    />: null}  


                </Form.Group> 

                <Form.Group widths='equal'>
                  <Form.Field
                    control={Select}
                    options={userTypeOptions}                
                    placeholder='Select User Type'
                    onChange={this.inputUserTypeHandler}    
                    required              
                    /> 

                  {this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Nurse' ?
                    <Form.Field
                      control={Select}
                      options={nurse_medicalDegreeOptions}                
                      placeholder='Medical Degree'
                      onChange={this.inputUserTypeHandler_medicalDegree}   
                      required               
                    />: null } 

                   {this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Surgeon' ?
                    <Form.Field
                      control={Select}
                      options={surgeon_medicalDegreeOptions}                
                      placeholder='Medical Degree'
                      onChange={this.inputUserTypeHandler_medicalDegree}    
                      required              
                    />: null } 

                    {this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Emergency Medical Service Personnel' ?
                      <Form.Field
                      control={Select}
                      options={ems_medicalDegreeOptions}                
                      placeholder='Medical Degree'
                      onChange={this.inputUserTypeHandler_medicalDegree}      
                      required            
                    />
                    
                  : null }               
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'whitesmoke'}} required>
                    <Form.Input
                      fluid
                      placeholder='First Name (at least 2 characters)'
                      type='text'
                      name='firstName'
                      noValidate
                      value={this.state.firstName}
                      className={formError.firstName.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                      required
                    />
                      {formError.firstName.length > 0 && (
                      <span className="errorMessage">{formError.firstName}</span>)}
                  </Form.Field>     

                  {this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Nurse'? 
                    <Form.Field
                    control={Select}
                    options={nurse_certificationOptions}                
                    placeholder='Certification'           
                    onChange={this.inputUserTypeHandler_certification}    
                    required              
                  />:
                    
                    this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Surgeon'? 
                    <Form.Field
                      control={Select}
                      options={surgeon_certificationOptions}                
                      placeholder='Certification'           
                      onChange={this.inputUserTypeHandler_certification}
                      required
                    />:(

                    this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Emergency Medical Service Personnel' ?
                      <Form.Field
                      control={Select}
                      options={ems_certificationOptions}                
                      placeholder='Certification'
                      onChange={this.inputUserTypeHandler_certification}    
                      required              
                    />
                  : null)}   

                </Form.Group>
                
                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'whitesmoke'}} required>
                    <Form.Input
                      fluid
                      placeholder='Last Name (at least 2 characters)'
                      type='text'
                      name='lastName'
                      noValidate
                      value={this.state.lastName}
                      className={formError.lastName.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                      required
                    />  
                      {formError.lastName.length > 0 && (
                      <span className="errorMessage">{formError.lastName}</span>)}                  
                  </Form.Field>

                  {this.state.user_type === 'Volunteer' ? 
                    <Form.Field
                      control={Select}                  
                      options={activeVolunteerOptions}                
                      placeholder='Active Volunteer?'
                      onChange={this.inputUserTypeHandler_volunteer}
                      required                  
                      />: null} 
                </Form.Group>

                <Form.Group widths='equal'>
                <Form.Field style={{marginBottom: '10px', color: 'whitesmoke'}} required>
                    <Form.Input
                      fluid
                      placeholder='Password'
                      type='password'
                      name='password'
                      noValidate
                      value={this.state.password}
                      className={formError.password.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                      required
                    />                     
                      {formError.password.length > 0 && (
                      <span className="errorMessage">{formError.password}</span>)}
                  </Form.Field>
                
                {this.state.user_type === 'Volunteer' ? 
                      <Form.Field
                      control={Select}
                      options={durationServiceOptions}                
                      placeholder='Duration Service (in years)'
                      search                    
                      onChange={this.inputUserTypeHandler_durationService}                  
                      required
                    /> : null}                  
                </Form.Group >

                <Form.Group widths='equal'>
                <Form.Field style={{marginBottom: '10px', color: 'whitesmoke'}} required>
                      <Form.Input
                        fluid
                        placeholder='Contact Number: 09XXXXXXXXX'
                        type='text'
                        name='contactNumber'
                        pattern='[0-9]*'
                        inputmode='numeric'
                        noValidate
                        value={this.state.contactNumber}
                        className={formError.contactNumber.length > 0 ? "error" : null}
                        onChange={this.handleCreateAccount}
                        required
                      />
                        {formError.contactNumber.length > 0 && (
                        <span className="errorMessage">{formError.contactNumber}</span>)}
                  </Form.Field>

                  <Form.Field style={{marginBottom: '10px', color: 'whitesmoke'}} required>
                      <Form.Input
                         fluid
                         control={Select}
                         placeholder='Sex'
                         options={sex} 
                         type='text'
                         name='sex'
                         noValidate
                         value={this.state.sex}
                         onChange={this.inputSex}
                         required
                      />
                        
                  </Form.Field>
   
                </Form.Group>
                   
                 <p style={{color:'white'}}>{this.state.err}</p>
                  
              </Form>
              </Modal.Content>
              <Modal.Actions>
                  <Form.Button color='red' onClick={this.submitCreateAccount} 
                    disabled={!this.state.email || !this.state.firstName || !this.state.lastName 
                              || !this.state.user_type || !this.state.password || !this.state.contactNumber || !this.state.sex
                              || this.state.formError.email || this.state.formError.firstName || this.state.formError.lastName
                              || this.state.formError.password || this.state.formError.contactNumber 
                              || this.state.user_type === 'Volunteer'?!this.state.medicalDegree 
                              || !this.state.medicalProfession || !this.state.certification 
                              || !this.state.isActiveVolunteer || !this.state.durationService:null               
                            } 
                  >
                      Create User Account
                  </Form.Button>
                   
        </Modal.Actions>
      </Modal>
      {/*Create Personnel Account Modal*/}

      {/* Responder Account Lists */}
      <Modal size={size3} open={open3} onClose={this.close3}>
        
        <div style={{backgroundColor:"#5c7788"}}>
            <Button.Group>
              <Button color='blue' size='small' onClick={this.showAccountLists('tiny')}>
                Responder
              </Button>
              <Button color='black' size='small' onClick={this.showVolunteerLists('tiny')}>
                  Volunteer
              </Button>
              <Button color='black' size='small' onClick={this.showRegularUserLists('tiny')}>
                Regular User
              </Button>
          </Button.Group>
        </div>    
        
        <Modal.Content>
          <ResponderAccountLists/>
        </Modal.Content>

      </Modal>
      {/* Responder Account Lists */}

      {/* Volunteer Account Lists */}
      <Modal size={size4} open={open4} onClose={this.close4}>
        <div style={{backgroundColor:"#5c7788"}}>
            <Button.Group>
              <Button color='black' size='small' onClick={this.showAccountLists('tiny')}>
                Responder
              </Button>
              <Button color='blue' size='small' onClick={this.showVolunteerLists('tiny')}>
                  Volunteer
              </Button>
              <Button color='black' size='small' onClick={this.showRegularUserLists('tiny')}>
                Regular User
              </Button>
          </Button.Group>
        </div>

        <Modal.Content>
          <VolunteerAccountLists/>
        </Modal.Content>
      </Modal>
      {/* Volunteer Account Lists */}

      {/* Regular User Account Lists */}
      <Modal size={size5} open={open5} onClose={this.close5}>
        <div style={{backgroundColor:"#5c7788"}}>
          <Button.Group>
          <Button color='black' size='small' onClick={this.showAccountLists('tiny')}>
            Responder
          </Button>
          <Button color='black' size='small' onClick={this.showVolunteerLists('tiny')}>
            Volunteer
          </Button>
          <Button color='blue' size='small' onClick={this.showRegularUserLists('tiny')}>
            Regular User
          </Button>
          </Button.Group>
        </div>

        <Modal.Content>
          <RegularUserAccountLists/>
        </Modal.Content>

      </Modal>
      {/* Regular User Account Lists */}

      {/* Admin: Delete */}
      <Modal size={size10} open={open10} onClose={this.close10}>
        <div style={{backgroundColor:"#5c7788"}}>
          <Button.Group>
            <Button color='blue' size='small' onClick={this.showAdmin('tiny')}>
                Admin
            </Button> 
            <Button color='black' size='small' onClick={this.showResponder('tiny')}>
              Responder
            </Button>
            <Button color='black' size='small' onClick={this.showVolunteer('tiny')}>
              Volunteer
            </Button>
            <Button color='black' size='small' onClick={this.showRegularUser('tiny')}>
              Regular User
            </Button>
            <Button color='black' size='small' onClick={this.showCCP('tiny')}>
              CCP
            </Button> 
          </Button.Group>
        </div>

        <Modal.Content>
          <DeleteAdmin/>
        </Modal.Content>
      </Modal>
      {/* Admin: Delete */}

      {/* Responder: Delete */}
      <Modal size={size6} open={open6} onClose={this.close6}>
        <div style={{backgroundColor:"#5c7788"}}>
          <Button.Group>
            <Button color='black' size='small' onClick={this.showAdmin('tiny')}>
                Admin
            </Button> 
            <Button color='blue' size='small' onClick={this.showResponder('tiny')}>
              Responder
            </Button>
            <Button color='black' size='small' onClick={this.showVolunteer('tiny')}>
              Volunteer
            </Button>
            <Button color='black' size='small' onClick={this.showRegularUser('tiny')}>
              Regular User
            </Button>
            <Button color='black' size='small' onClick={this.showCCP('tiny')}>
              CCP
            </Button> 
          </Button.Group>
        </div>

        <Modal.Content>
          <DeleteResponder/>
        </Modal.Content>

      </Modal>
      {/* Responder: Delete */}
      
      {/* Volunteer: Delete */}  
      <Modal size={size7} open={open7} onClose={this.close7}>
        <div style={{backgroundColor:"#5c7788"}}>
          <Button.Group>
            <Button color='black' size='small' onClick={this.showAdmin('tiny')}>
                Admin
            </Button> 
            <Button color='black' size='small' onClick={this.showResponder('tiny')}>
              Responder
            </Button>
            <Button color='blue' size='small' onClick={this.showVolunteer('tiny')}>
              Volunteer
            </Button>
            <Button color='black' size='small' onClick={this.showRegularUser('tiny')}>
              Regular User
            </Button>
            <Button color='black' size='small' onClick={this.showCCP('tiny')}>
              CCP
            </Button> 
          </Button.Group>
        </div>

        <Modal.Content>
          <DeleteVolunteer/>
        </Modal.Content>
      </Modal>
      {/* Volunteer: Delete */}  
      
      {/* Regular User: Delete */}  
      <Modal size={size8} open={open8} onClose={this.close8}>
        <div style={{backgroundColor:"#5c7788"}}>
          <Button.Group>
            <Button color='black' size='small' onClick={this.showAdmin('tiny')}>
                Admin
            </Button> 
            <Button color='black' size='small' onClick={this.showResponder('tiny')}>
              Responder
            </Button>
            <Button color='black' size='small' onClick={this.showVolunteer('tiny')}>
              Volunteer
            </Button>
            <Button color='blue' size='small' onClick={this.showRegularUser('tiny')}>
              Regular User
            </Button>
            <Button color='black' size='small' onClick={this.showCCP('tiny')}>
              CCP
            </Button> 
          </Button.Group>
        </div>

        <Modal.Content>
          <DeleteRegularUser/>
        </Modal.Content>
      </Modal>
      {/* Regular User: Delete */}  

      {/* Command Center Personnel: Delete */}
       <Modal size={size9} open={open9} onClose={this.close9}>
        <div style={{backgroundColor:"#5c7788"}}>
          <Button.Group>
            <Button color='black' size='small' onClick={this.showAdmin('tiny')}>
                Admin
            </Button> 
            <Button color='black' size='small' onClick={this.showResponder('tiny')}>
              Responder
            </Button>
            <Button color='black' size='small' onClick={this.showVolunteer('tiny')}>
              Volunteer
            </Button>
            <Button color='black' size='small' onClick={this.showRegularUser('tiny')}>
              Regular User
            </Button>
            <Button color='blue' size='small' onClick={this.showCCP('tiny')}>
              CCP
            </Button> 
          </Button.Group>
        </div>

        <Modal.Content>
          <DeleteCCP/>
        </Modal.Content>
      </Modal>
      {/* Command Center Personnel: Delete */}

      
    </div>
    )  
  }
}

function mapStateToProps(state){
  return {
      incidentsList: state.incidents,
      user: state.user,
      uid: state.uid
  }
}

export default connect(mapStateToProps, {saveIncident})(HeaderDashboard);