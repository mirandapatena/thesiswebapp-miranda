import React, {Component} from 'react'
import {Menu, Dropdown, Icon,  Button,  } from 'semantic-ui-react'
import fire from '../config/Fire';
import '../stylesheet_QueueIncidents.css';





class HeaderDashboard extends Component{
  
    constructor(props){
      
        super(props);
        

        this.logout = this.logout.bind(this);

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
      { key: 'profile', text: 'Your Profile' },
      { key: 'stars', text: 'Your Stars' },
      { key: 'explore', text: 'Explore' },
      { key: 'integrations', text: 'Integrations' },
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
    return (
      <Menu>
        <Menu.Menu position='right'>
        <Menu.Item name='id badge' onClick={this.handleItemClick}>
        <Dropdown trigger={this.trigger} options={this.options} />
        </Menu.Item>
        
        </Menu.Menu>
      </Menu>
      
    )
  }
}

export default HeaderDashboard;