import React, {Component} from 'react';
import { Button, Table, Header, Image, Modal} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import _ from 'lodash';
import failLoadImage from '../images/failLoadImage.png';

class ArchivesDispaly extends Component{

    

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
                                        <div>
                                            {coordinates}
                                        </div>
                                    );
                                })}
                                </div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Detailed Location of Incident: </b> {this.props.feedbackLocation}</div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Date and Time Settled of Incident:</b> {this.props.feedbackTimeSettled}</div>
                            
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Additional Responders:</b> {
                                    _.map(this.props.incidentAdditionalResponders, (additionalResponder) => {
                                    return(
                                        <div>
                                            <div>
                                                Name: {additionalResponder.name}
                                            </div>
                                            <div>
                                                Time Received: {additionalResponder.timeReceived}
                                            </div>
                                            
                                        </div>
                                    )
                                })}</div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Additional Volunteer:</b> {this.props.incidentAdditionalVolunteers}</div>
                            
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'5px'}}>
                                <b>Assigned Responder: </b>{this.props.feedbackByResponder}</div>
                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Assigned Volunteer: </b>{this.props.incidentOriginalVolunteer}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Feedback Report:</b> {this.props.feedbackReport}</div>

                            <div style={{textAlign:'left', fontSize:'14px', paddingBottom:'20px'}}>
                                <b>Incident Image: </b> <Image src={failLoadImage} size='large'/></div>

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