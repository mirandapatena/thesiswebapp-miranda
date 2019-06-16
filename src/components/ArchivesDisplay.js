import React, {Component} from 'react';
import { Button, Table, Header, Image, Modal} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import _ from 'lodash';
import failLoadImage from '../images/failLoadImage.png';

class ArchivesDispaly extends Component{

    constructor(props){
        super(props);
    }

    displayImage = () => {
        if(this.props.incidentImage !== 'No photo of incident uploaded by reporter'){
            return(
                <div>
                    <p><b>Photo/s of Incident:</b></p>
                    <p><Image src={this.props.incidentImage}/></p>
                </div>
                );
        }else{
            return (
                <div>
                    <p><b>{this.props.incidentImage}</b></p>
                </div>
                );
        }
    }
    

    render(){
        console.log('archive props', this.props);
        //var incidentCoordinates = this.props;
        console.log('incidentCoordinates', this.props.incidentCoordinates);
        //const incidentCoordinates = this.props.incidentCoordinates;

        return(
            <Table.Row>
                <Table.Cell width='4'>
                    <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini' circular/>
                        <Header.Content>
                            <Modal trigger={<a positive>{this.props.incidentKey}</a>} closeIcon size='large' >
                        <Modal.Content style={{backgroundColor:'white'}}>
                            <div style={{textAlign:'center', fontSize:'30px'}}>
                                <b>INCIDENT REPORT</b></div>
                            <div style={{textAlign:'center', fontSize:'13px', paddingBottom:'50px'}}>
                                <b>Incident Key:</b> {this.props.incidentKey}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'45px'}}>
                                <b>Date and Time of Incident:</b> {this.props.incidentTimeReceived}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Incident Reported by: </b> {this.props.incidentReportedBy}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Type of Incident: </b> {this.props.incidentType}</div>
                             <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Incident Location: </b> {this.props.incidentLocation}</div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Incident Coordinates: </b>
                                {_.map(this.props.incidentCoordinates, (coordinates) => {
                                    console.log('inmapcoordinates', coordinates);
                                    return(
                                        <div style={{paddingLeft:'10px'}}>
                                            {coordinates}
                                        </div>
                                    );
                                })}
                                </div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Detailed Location of Incident: </b> {this.props.feedbackLocation}</div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Date and Time Settled of Incident:</b> {this.props.feedbackTimeSettled}</div>
                            
                            {this.props.incidentAdditionalResponders === ''?
                             <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Additional Responders:</b> No Additional Responders Requested
                             </div>
                            :
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Additional Responders:</b> {
                                    _.map(this.props.incidentAdditionalResponders, (additionalResponder) => {
                                    return(
                                        <div>
                                            <div style={{paddingLeft:'15px', paddingBottom:'5px'}}>
                                                <b>Name:</b> {additionalResponder.name}
                                            </div>
                                            <div style={{paddingLeft:'15px', paddingBottom:'5px'}}>
                                                <b>Time Received:</b> {additionalResponder.timeReceived}
                                            </div>
                                            
                                        </div>
                                    )
                                })}</div>
                            }

                            {this.props.incidentAdditionalVolunteers === ''?
                             <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Additional Volunteer:</b> No Additional Volunteer Requested
                             </div>
                            :
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Additional Responders:</b> {
                                    _.map(this.props.incidentAdditionalVolunteers, (additionalVolunteer) => {
                                    return(
                                        <div>
                                            <div style={{paddingLeft:'15px', paddingBottom:'5px'}}>
                                                Name: {additionalVolunteer.name}
                                            </div>
                                            <div style={{paddingLeft:'15px', paddingBottom:'5px'}}>
                                                Time Received: {additionalVolunteer.timeReceived}
                                            </div>
                                            
                                        </div>
                                    )
                                })}</div>
                            }
                           
                            
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Assigned Responder: </b>{this.props.feedbackByResponder}</div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Assigned Volunteer: </b>{this.props.incidentOriginalVolunteer}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Feedback Report:</b> {this.props.feedbackReport}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                {this.displayImage()}</div>

                        </Modal.Content>
                    </Modal>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell width='3'>
                    <Header.Content>
                    {this.props.incidentLocation}
                    </Header.Content>
                </Table.Cell>
                <Table.Cell width='3'>
                    <Header.Content>
                        {this.props.incidentTimeReceived}
                    </Header.Content>
                </Table.Cell>
                {/* <Table.Cell width='3'>
                    <Header.Content>
                        original volunteer
                    </Header.Content>
                </Table.Cell> */}
                
                
            </Table.Row>
        )
    }



}

export default ArchivesDispaly;