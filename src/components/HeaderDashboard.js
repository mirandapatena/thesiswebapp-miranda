import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Modal, Form, Button} from 'semantic-ui-react'
import fire from '../config/Fire';
import '../stylesheet_QueueIncidents.css';

class HeaderDashboard extends Component {
  constructor(props) {
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
    this.setState({ incidentType: e.target.value });
  }

  inputIncidentLocationHandler = (e) => {
    this.setState({ incidentLocation: e.target.value });
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
      <Icon name='small filter' />Filter
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
  { key: 'thumbs up', text: 'Settled', },
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
            <Icon name="plus" />Add Incident
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