import React, {Component} from 'react';
import { Image, Card, Button} from 'semantic-ui-react';
import _ from 'lodash';
import fire from '../config/Fire';
class DispatchMobileUser extends Component{
    
    dispatchMobileUser = () => {
        var incidentID = this.props.incidentID;
        var user_type = this.props.user_type
        console.log(`user_type: ${user_type} uid: ${this.props.id}`);
        const dispatchRef = fire.database().ref(`mobileUsers/${user_type}/${this.props.id}`);
        dispatchRef.update({incidentID});
    }
    
    render(){
        return( 
                    <Card fluid color='red'>
                            <Card.Content>
                                <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                <Card.Header>{this.props.firstName}</Card.Header>
                                <Card.Meta>{this.props.lastName}</Card.Meta>
                                <Card.Meta>{this.props.distance} m away</Card.Meta>
                                <Card.Meta>{this.props.email}</Card.Meta>
                                <Card.Meta>{this.props.contactNumber}</Card.Meta>
                            </Card.Content>                        
                            <Card.Content extra> 
                              <Button attached='bottom' color='red' onClick={this.dispatchMobileUser}>
                                Dispatch
                              </Button>
                          </Card.Content>
                    </Card>
        );
    }

}

   
export default DispatchMobileUser;