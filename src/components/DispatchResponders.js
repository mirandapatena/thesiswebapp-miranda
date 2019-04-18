import React, {Component} from 'react';
import { Image, Card, Button} from 'semantic-ui-react';
import _ from 'lodash';
import fire from '../config/Fire';
class DispatchResponders extends Component{
    
    dispatchResponder = () => {
        var incidentID = this.props.incidentID;
        const dispatchRef = fire.database().ref(`mobileUsers/Responder/${this.props.id}`);
        dispatchRef.update({incidentID});
    }
    render(){
        return( 
                    <Card fluid color='red'>
                            <Card.Content>
                                <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                <Card.Header>{this.props.firstName}</Card.Header>
                                <Card.Meta>{this.props.lastName}</Card.Meta>
                            </Card.Content>                        
                            <Card.Content extra> 
                              <Button attached='bottom' color='gray' onClick={this.dispatchResponder}>
                                Dispatch
                              </Button>
                          </Card.Content>
                    </Card>
                     
        );
    }

}

   
export default DispatchResponders;