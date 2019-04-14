import React, {Component} from 'react';
import { List, Image, Card } from 'semantic-ui-react';
import _ from 'lodash';
import { Button } from '@material-ui/core';
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
                                <Image floated='right' size='mini' src='' />
                                <Card.Header>{this.props.firstName} {this.props.lastName}</Card.Header>
                            </Card.Content>                        
                            <Card.Content extra>
                            <div className='ui two buttons'>
                              <Button basic color='green' onClick={this.dispatchResponder}>
                                Dispatch
                              </Button>
                            </div>
                          </Card.Content>
                    </Card>
        );
    }

}

   
export default DispatchResponders;
