import React, {Component} from 'react'
import {Menu, Dropdown, Icon, Modal, Form, Button } from 'semantic-ui-react'
import fire from '../config/Fire';
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
          isResponded: null,
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
  
    inputIncidentTypeHandler = (e) => {
      this.setState({incidentType: e.target.value});
  }

  inputIncidentLocationHandler = (e) => {
      this.setState({incidentLocation: e.target.value});
  }

  submitIncidentHandler = (e) => {
    e.preventDefault();
    
    let firebaseRef = fire.database().ref('/incidents');

    firebaseRef.push({
        incidentType: this.state.incidentType,
        incidentLocation: this.state.incidentLocation,
        responded: false,
        coordinates: {lng: this.state.lng, lat: this.state.lat}
    });
    this.setState({
        incidentType: '',
        incidentLocation: '',
        responded: null,
        lng: null,
        lat: null
    });
    console.log(this.state.incidentsList);
}

    trigger = (
      <span>
        <Icon name='user' /> Hello, Bob
      </span>
    )

    options = [
      {
        key: 'user',
        text: (
          <span>
            Signed in as <strong>Bob Smith</strong>
          </span>
        ),
        disabled: true,
      },
      { key: 'help', text: 'Help' },
      { key: 'settings', text: 'Settings' },
      { key: 'sign-out', text: 'Sign Out', onClick:this.logout },
    ];

    logout() {
        fire.auth().signOut();
    }

    state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { open, size } = this.state
    return (<div>
      <Menu>
        <Menu.Menu position='left'>
          <Menu.Item link onClick={this.show('tiny')}>Add Incident</Menu.Item>
          <Menu.Item>Filter Incidents</Menu.Item>
        </Menu.Menu>
        <Menu.Menu position='right'>
          <Menu.Item>Personnel Actions</Menu.Item>
          <Menu.Item>Profile Pop-up</Menu.Item>
          <Menu.Item name='id badge' onClick={this.handleItemClick}>
          <Dropdown trigger={this.trigger} options={this.options} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Modal size={size} open={open} onClose={this.close}>
      <Modal.Header>New Emergency</Modal.Header>
          <Modal.Content>
              <Form>
                  <Form.Field>
                      <label>Type of Incident</label>
                      <input 
                          name='incidentType' 
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
                  <Button basic color='green' onClick={this.submitIncidentHandler}>
                      Submit
                  </Button>
              </Modal.Actions>
      </Modal></div>
      
    )
  }
}

export default HeaderDashboard;