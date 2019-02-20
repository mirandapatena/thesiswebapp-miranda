import React, {Component} from 'react'
import {Menu, Dropdown, Icon, Modal, Form, Button } from 'semantic-ui-react'
import fire from '../config/Fire';
import '../stylesheet_QueueIncidents.css';





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
          responded: false
      });
      this.setState({
          incidentType: '',
          incidentLocation: '',
          responded: null
      });
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
          <Menu.Item><Button primary onClick={this.show('tiny')}>Add Incident</Button></Menu.Item>
          <Menu.Item>Filter Incidents</Menu.Item>
        </Menu.Menu>
        <Menu.Menu position='center'>
          <Menu.Item>App Name with Logo</Menu.Item>
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
                      <input 
                          name='incidentLocation'
                          onChange={this.inputIncidentLocationHandler}
                      />
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