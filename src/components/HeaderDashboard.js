import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Modal, Form, Button, Radio, Select} from 'semantic-ui-react'
import fire from '../config/Fire';
import {connect} from 'react-redux';
import {saveIncident} from '../actions/incidentAction';
import {createUserAccount} from '../functions/createUserAccount';
import '../stylesheet_QueueIncidents.css';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
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
          unresponded: null,
          isResponding: null,
          isSettled: null,
          firstName: '',
          lastName: '',
          password: '',
          email: '',
          user_type: '',
          contactNumber: '',
          err: '',
          lat: null,
          lng: null,
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
            user_type:''
        }
          
        }
        this.logout = this.logout.bind(this);
        this.submitCreateAccount = this.submitCreateAccount.bind(this);
    }


  show = size => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })

  show2 = size2 => () => this.setState({ size2, open2: true })
  close2 = () => this.setState({ open2: false })
    
  handleChange = incidentLocation => {
      this.setState({ incidentLocation });
  };
  

  handleSelect = incidentLocation => {
      geocodeByAddress(incidentLocation)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
            this.setState({lng: latLng.lng, lat: latLng.lat});
        })
        .catch(error => console.error('Error', error));
    };
  
  inputIncidentTypeHandler = (e, {incidentType}) => this.setState({ incidentType})
  
  inputIncidentLocationHandler = (e) => {
    this.setState({ incidentLocation: e.target.value });
  }

  submitIncidentHandler = (e) => {
    e.preventDefault();
    const timeReceived = Date.now();
    const incident = {
      incidentType: this.state.incidentType,
      incidentLocation: this.state.incidentLocation,
      unresponded: true,
      isResponding: false,
      isSettled: false,
      coordinates: {lng: this.state.lng, lat: this.state.lat},
      incidentPhoto: '',
      reportedBy: 'Command Center Personnel',
      timeReceived,
      timeResponded: '',
      responderResponding: '',
      volunteerResponding: '',
    }
    this.props.saveIncident(incident);
    this.setState({
        incidentType: '',
        incidentLocation: '',
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
        formError.firstName =
          value.length < 2 ? "First Name should at least 2 characters" : "";
        break;
      case "lastName":
        formError.lastName =
          value.length < 2 ? "Last Name should at least 2 characters" : "";
        break;
      case "email":
        formError.email = emailRegex.test(value)
          ? ""
          : "Please enter a valid email address.";
        break;
      case "password":
        formError.password =
          value.length < 8 ? "Password should at least 8 characters" : "";
        break;
      case "contactNumber":
        formError.contactNumber =
          value.length < 11 ? "Contact Number should at least 11 numbers" : "";
        break; 
      // case "user_type":
      //   formError.user_type = this.user_type
      //     ? ""
      //     : "Please select user type.";
      //  break;
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
      isMobile
    }

    const credentials = {
      medicalProfession: this.state.medicalProfession,
      medicalDegree: this.state.medicalDegree,
      certification: this.state.certification,
      isActiveVolunteer: this.state.isActiveVolunteer,
      forVA: false,
      forPI: false
    }

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING--
        First Name: ${this.state.firstName}
        Last Name: ${this.state.lastName}
        Email: ${this.state.email}
        Password: ${this.state.password}
        Contact Number: ${this.state.contactNumber}
        User Type: ${this.state.user_type}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
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
      medicalProfession: '',
      medicalDegree: '',
      certification: '',
      isActiveVolunteer: ''
    })

  }

  trigger = (
    <span>
      <Icon className='user circle' /> Francisco Ibarra
    </span>
  )
  
  options = [
    { key: 'user', text: 'Account', icon: 'user' },
    { key: 'help', text: 'Help', icon: 'question' },
    { key: 'settings', text: 'Settings', icon: 'settings' },
    { key: 'sign-out', text: 'Sign Out', icon: 'sign out', onClick: this.logout },
  ]
  
  


  filtertrigger = (
    <span>
      <Icon className='small filter' />Filter
    </span>
  )
    //Personnel Actions Trigger
  act_trigger = (
    <span></span>
  )
    //Filter Incident Option
  filteroptions = [{
    key: 'filter',
    text: (
      <span><strong>
        Filter Queue by Incident Status
      </strong></span>
    ),
    disabled: true,
  },
  { key: 'exclamation', text: 'Unresponded' },
  { key: 'car', text: 'Responding' },
  { key: 'thumbs up', text: 'Settled', }
  ];
   
  logout() {
    fire.auth().signOut();
  }

  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })


  render() {
    const { open, size } = this.state
    const { open2, size2 } = this.state
    const { formError } = this.state;


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
    // { text: '', value: ''},
    // { text: '', value: ''},
    // { text: '', value: ''},
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

    return (<div className="menuz">
    {/* Header Menu */}
      <Menu inverted>
          <Menu.Menu position='left'>
              <Menu.Item>
                 App Name with Logo
              </Menu.Item>
              <Menu.Item link onClick={this.show('tiny')}>
                 <Icon className="plus" />Add Incident
              </Menu.Item>
              <Menu.Item link onClick={this.show2('tiny')}>
                 <Icon className="plus" />Create User Account
              </Menu.Item>
              <Menu.Item onClick={this.handleItemClick}>
                  {/*Settings*/}
                  <Dropdown trigger={this.filtertrigger} options={this.filteroptions} icon={null} />
              </Menu.Item>
          </Menu.Menu>
        <Menu.Menu position='right'>
              <Menu.Item onClick={this.handleItemClick}>
                  <Dropdown icon='tasks' className='icon'>
                      <Dropdown.Menu>
                      <Dropdown.Header content='Personnel Actions' />
                      <Dropdown.Divider />
                          <Dropdown.Item icon='user plus' text='Add Responder' />
                          <Dropdown.Item icon='user plus' text='Add Volunteer' />
                    </Dropdown.Menu>
                  </Dropdown>
              </Menu.Item>
              <Menu.Item onClick={this.handleItemClick}>
                  <Dropdown trigger={this.trigger} options={this.options} pointing='top left' icon={null} />
              </Menu.Item>
        </Menu.Menu>
      </Menu>

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
                  </Form.Field>
              </Form>
              </Modal.Content>
              <Modal.Actions>
                  <Button inverted color='gray' onClick={this.submitIncidentHandler}>
                      Submit
                  </Button>
        </Modal.Actions>
      </Modal>

      {/*Create Personnel Account Modal*/}
      <Modal size={size2} open={open2} onClose={this.close2}  onClick={(event) => {this.handleCreateAccount(event);}}noValidate>
      <Modal.Header>New User Account </Modal.Header>
          <Modal.Content>
              <Form onClick={this.handleCreateAccount}>

                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'red'}} required>
                    <Form.Input
                      fluid
                      placeholder='Email Address'
                      type='email'
                      name='email'
                      noValidate
                      value={this.state.email}
                      className={formError.email.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                    />
                      {formError.email.length > 0 && (
                      <span className="errorMessage">{formError.email}</span>)}
                  </Form.Field>                  
                </Form.Group> 

                <Form.Group widths='equal'>
                  <Form.Field
                    control={Select}
                    options={userTypeOptions}                
                    placeholder='Select User Type'
                    onChange={this.inputUserTypeHandler}                  
                    /> 

                  {this.state.user_type === 'Volunteer' ? 
                    <Form.Field
                      control={Select}
                      options={medicalProfessionOptions}                
                      placeholder='Medical Profession'
                      search
                      onChange={this.inputUserTypeHandler_medicalProfession}                  
                    />: null}  
               
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'red'}} required>
                    <Form.Input
                      fluid
                      placeholder='First Name'
                      type='text'
                      name='firstName'
                      noValidate
                      value={this.state.firstName}
                      className={formError.firstName.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                    />
                      {formError.firstName.length > 0 && (
                      <span className="errorMessage">{formError.firstName}</span>)}
                  </Form.Field>                   

                   {this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Nurse' ?
                    <Form.Field
                      control={Select}
                      options={nurse_medicalDegreeOptions}                
                      placeholder='Medical Degree'
                      search
                      onChange={this.inputUserTypeHandler_medicalDegree}                  
                    />:

                   this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Surgeon' ?
                    <Form.Field
                      control={Select}
                      options={surgeon_medicalDegreeOptions}                
                      placeholder='Medical Degree'
                      search
                      onChange={this.inputUserTypeHandler_medicalDegree}                  
                    />:(

                    this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Emergency Medical Service Personnel' ?
                      <Form.Field
                      control={Select}
                      options={ems_medicalDegreeOptions}                
                      placeholder='Medical Degree'
                      search
                      onChange={this.inputUserTypeHandler_medicalDegree}                  
                    />
                    
                  : null) }

                </Form.Group>
                
                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'red'}} required>
                    <Form.Input
                      fluid
                      placeholder='Last Name'
                      type='text'
                      name='lastName'
                      noValidate
                      value={this.state.lastName}
                      className={formError.lastName.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
                    />  
                      {formError.lastName.length > 0 && (
                      <span className="errorMessage">{formError.lastName}</span>)}                  
                  </Form.Field>  

                  {this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Nurse'? 
                    <Form.Field
                    control={Select}
                    options={nurse_certificationOptions}                
                    placeholder='Certification'
                    search                    
                    onChange={this.inputUserTypeHandler_certification}                  
                  />:
                    
                    this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Surgeon'? 
                    <Form.Field
                      control={Select}
                      options={surgeon_certificationOptions}                
                      placeholder='Certification'
                      search                    
                      onChange={this.inputUserTypeHandler_certification}
                    />:(

                    this.state.user_type === 'Volunteer' && this.state.medicalProfession === 'Emergency Medical Service Personnel' ?
                      <Form.Field
                      control={Select}
                      options={ems_certificationOptions}                
                      placeholder='Certification'
                      search
                      onChange={this.inputUserTypeHandler_certification}                  
                    />
                  : null)}   
                </Form.Group>

                <Form.Group widths='equal'>
                  <Form.Field style={{marginBottom: '10px', color: 'red'}} required>
                      <Form.Input
                        fluid
                        placeholder='Contact Number: 09XXXXXXXXX'
                        type='text'
                        name='contactNumber'
                        noValidate
                        value={this.state.contactNumber}
                        className={formError.contactNumber.length > 0 ? "error" : null}
                        onChange={this.handleCreateAccount}
                      />
                        {formError.contactNumber.length > 0 && (
                        <span className="errorMessage">{formError.contactNumber}</span>)}
                  </Form.Field>

                  {this.state.user_type === 'Volunteer' ? 
                    <Form.Field
                      control={Select}                  
                      options={activeVolunteerOptions}                
                      placeholder='Active Volunteer?'
                      onChange={this.inputUserTypeHandler_volunteer}                  
                      />: null}                 
                </Form.Group >

                <Form.Group widths='equal'>
                   <Form.Field style={{marginBottom: '10px', color: 'red'}} required>
                    <Form.Input
                      fluid
                      placeholder='Password'
                      type='password'
                      name='password'
                      noValidate
                      value={this.state.password}
                      className={formError.password.length > 0 ? "error" : null}
                      onChange={this.handleCreateAccount}
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
                    /> : null}     

                </Form.Group>
                   
                 <p style={{color:'white'}}>{this.state.error}</p>
                  
              </Form>
              </Modal.Content>
              <Modal.Actions>
                  <Button inverted color='gray' onClick={this.submitCreateAccount}>
                      Create User Account
                  </Button>
                   
        </Modal.Actions>
      </Modal>
      
      </div>
    )
  }
}

function mapStateToProps(state, ownProps){
  return {
      incidentsList: state.incidents,
      user: state.user
  }
}

export default connect(mapStateToProps, {saveIncident})(HeaderDashboard);