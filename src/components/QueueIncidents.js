import React, {Component} from 'react';
import EmergencyDetails from './EmergencyDetails';
import { Button, Modal, Header, Form,  Dropdown,} from 'semantic-ui-react';
import fire from '../config/Fire';
import _ from 'lodash';

class QueueIncidents extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            open: false,
            incidentType: '',
            incidentLocation: '',
            isResponded: null,
            incidentsList : [{
                incidentType: '',
                incidentLocation: '',
                isResponded: ''
            }]
        }

        let app = fire.database().ref('/incidents');
        app.on('value', snapshot => {
            this.getData(snapshot.val());
        })
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

    getData = (values) => {
        let incidentValues = values;
        let incidentsList = _(incidentValues)
                            .keys()
                            .map(incidentKey => {
                                let cloned = _.clone(incidentValues[incidentKey]);
                                cloned.key = incidentKey;
                                return cloned;
                            })
                            .value();
        this.setState({incidentsList: incidentsList});

    }

    render(){
        const { open, size } = this.state
        let incidentNodes = this.state.incidentsList.map((incidents, key) => {
            return (
                <div className='item' key={key}>
                    <EmergencyDetails 
                        incidentType = {incidents.incidentType} 
                        incidentLocation = {incidents.incidentLocation} 
                    />
                </div>
            );
            
        });
        
        return (
            
                <div className="ui visible left vertical sidebar menu">
                    <div>
                        <Header>
                            <Button size="tiny"><Dropdown styles='width:0x;' text='Filter' icon='filter' floating labeled button className='icon'>
                                <Dropdown.Menu>
                                    <Dropdown.Header icon='tags' content='Filter by incident status' />
                                 <Dropdown.Divider />
                                    <Dropdown.Item icon='attention' text='New' />
                                    <Dropdown.Item icon='comment' text='Responding' />
                                    <Dropdown.Item icon='conversation' text='Settled' />
                                </Dropdown.Menu>
                            </Dropdown></Button>
                            <Button primary onClick={this.show('tiny')}>
                                Add Incident
                            </Button>
                        </Header>
                    </div>
                        {incidentNodes}
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
                    </Modal>
                </div>
        );
    }
}

export default QueueIncidents;