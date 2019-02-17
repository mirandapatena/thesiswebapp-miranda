import React, {Component} from 'react'
import { Header, Segment, Button, Image } from 'semantic-ui-react'
import fire from '../config/Fire';
import '../stylesheet_QueueIncidents.css';


class HeaderDashboard extends Component{

    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);

    }

    logout() {
        fire.auth().signOut();
    }

    render(){
        return(
            <div class="ui right floated segment">
            <div class="fixed-width">
            <Segment clearing >
                <Header as='h2' floated='right'>
                <Button onClick={this.logout} >Logout</Button>
                </Header>
                <Image src='' size='mini' circular floated='right'/>     
            </Segment>
            </div></div>
        );
    }
  
}

export default HeaderDashboard;


