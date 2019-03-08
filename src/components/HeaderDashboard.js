import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Modal, Form, Button, Radio} from 'semantic-ui-react'
import fire from '../config/Fire';
import {connect} from 'react-redux';
import {saveIncident} from '../actions/incidentAction';
import '../stylesheet_QueueIncidents.css';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class HeaderDashboard extends Component{
  
    constructor(props){
      
        super(props);
        
        this.state = {
          open: false,
          incidentType: '',
          incidentLocation: '',
          unresponded: null,
          isResponding: null,
          isSettled: null
        }
        this.logout = this.logout.bind(this);
    }


  show = size => () => this.setState({ size, open: true })
  close = () => this.setState({ open: false })
    
  handleChange = incidentLocation => {
      this.setState({ incidentLocation });
  };
  

  handleSelect = incidentLocation => {
      geocodeByAddress(incidentLocation)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
            console.log('Success', latLng);
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
    
    const incident = {
      incidentType: this.state.incidentType,
      incidentLocation: this.state.incidentLocation,
      unresponded: true,
      isResponding: false,
      isSettled: false,
      coordinates: {lng: this.state.lng, lat: this.state.lat}
    }
    this.props.saveIncident(incident);
    this.setState({
        incidentType: '',
        incidentLocation: '',
        unresponded: null,
        isResponding: null,
        isSettled: null,
        lng: null,
        lat: null
    });
    console.log(this.state.incidentsList);
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
      </Modal></div>
    )
  }
}

function mapStateToProps(state, ownProps){
  return {
      incidentsList: state.incidents
  }
}

export default connect(mapStateToProps, {saveIncident})(HeaderDashboard);