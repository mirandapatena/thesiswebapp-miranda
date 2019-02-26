import React, {Component} from 'react';
import { Button, Card, Modal, } from 'semantic-ui-react';
import '../stylesheet_QueueIncidents.css';



class EmergencyDetails extends Component{

    constructor(props){
        super(props);
        this.state = {open: false}
    }

    show = size => () => {
        this.setState({ size, open: true })
        console.log('Modal pressed');
    }
    close = () => this.setState({ open: false })
   
    render() {
        const { open, size } = this.state
        return (
            <div>
                <div className="inc_stat"></div> {/*For "if statement" to change icon per type*/}
            <Card.Group>
                <Card color ='red' onClick={this.show('tiny')}> 
                <Card.Content>
                    <Card.Header>{this.props.name}<div className="inc_typ"></div> {/*Incident Type*/}
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <Card.Description>
                        {this.props.incidentLocation}
                    </Card.Description>
                     <br></br>
                    <Card.Description>
                        12:00 AM
                    </Card.Description>
                </Card.Content>
                </Card>
            </Card.Group>
            
            <Modal size={size} open={open} onClose={this.close}>
                <Modal.Header>New Emergency</Modal.Header>
                    <Modal.Content>
                            <p>Reported by: Regular User</p>
                            <p>Type of Incident: {this.props.incidentType}</p>
                            <p>Location of Incident: {this.props.incidentLocation}</p>
                            <p>Photo of Incident:</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='green'>
                                Dispatch Responders
                            </Button>
                            <Button basic color='green'>
                                Request Volunteers
                            </Button>
                </Modal.Actions>
            </Modal>
        </div>
        );
      }
  
    }

EmergencyDetails.defaultProps = {
    name: 'Command Center Personnel',
    accountID : 12345,
    timeReported: new Date(),
    incidentType: 'Police Emergency',
    incidentLocation: 'Mandaue City'
}
export default EmergencyDetails;
