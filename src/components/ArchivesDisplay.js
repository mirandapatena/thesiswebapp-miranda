import React, {Component} from 'react';
import { Button, Table, Header, Image, Modal, Form} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import _ from 'lodash';

class ArchivesDispaly extends Component{


    displayImage = () => {
        if(this.props.incidentImage !== 'No photo of incident uploaded by reporter'){
            return(
                <div style={{marginTop:'15px', marginBottom:'15px', paddingBottom:'15px', fontSize:'1.1em', fontFamily:'monospace,monospace'}}>
                    <p><b>PHOTO OF INCIDENT </b></p>
                    <p><Image src={this.props.incidentImage} size='large'/></p>
                </div>
                );
        }else{
            return (
                <pre style={{marginTop:'15px', fontSize:'1.1em', fontFamily:'monospace,monospace',  paddingBottom:'15px'}}>
                    <b>PHOTO OF INCIDENT</b>
                    <u>  {this.props.incidentImage}  </u>
                </pre>
                );
        }
    }

    render(){
        

        return(
            <Table.Row>
                <Table.Cell width='4'>
                    <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini' circular/>
                        <Header.Content>
                            <Modal trigger={<a positive>{this.props.incidentKey}</a>} closeIcon size='large' >
                        
                            <Modal.Content style={{backgroundColor:'white'}}>
                            
                                <div style={{fontSize:'40px', color:'#16426a', textAlign:'center'}}>
                                    <b>INCIDENT REPORT</b>
                                </div>
                                <div style={{marginBottom:'0px', marginTop:'-13px', paddingBottom:'45px', textAlign:'center', fontSize:'16px', color:'#16426a'}}>
                                    <b>{this.props.incidentKey}</b>
                                </div>
                                
                                <Form>
                                    <div style={{fontSize:'16px', paddingBottom:'5px', fontSize:'1.1em', fontFamily:'monospace,monospace',  paddingBottom:'15px'}}>
                                        <Form.Group widths='2'>
                                            <Form.Field>
                                                <pre style={{marginBottom:'0px', marginTop:'5px'}}>
                                                    <b>REPORTED BY : </b>           
                                                    <u>  {this.props.incidentReportedBy}  </u>
                                                </pre>
                                            </Form.Field>
                                            <Form.Field>
                                                <pre style={{marginBottom:'0px', marginTop:'5px'}}>
                                                    <b>DATE OF REPORT : </b>     
                                                    <u>  {this.props.incidentTimeReceived}  </u>   
                                                </pre>
                                            </Form.Field>
                                        </Form.Group>
                                        <Form.Group widths='2'>
                                            <Form.Field>
                                                <pre style={{marginBottom:'0px', marginTop:'-13px'}}>
                                                    <b>ASSIGNED RESPONDER : </b> 
                                                    <u>  {this.props.feedbackByResponder}  </u>
                                                </pre>
                                            </Form.Field>
                                            <Form.Field>
                                                <pre style={{marginBottom:'0px', marginTop:'-13px'}}>
                                                    <b>ASSIGNED VOLUNTEER : </b> 
                                                    <u>  {this.props.incidentOriginalVolunteer}  </u>
                                                </pre>
                                            </Form.Field>
                                        </Form.Group>
                                    </div>

                                    <div style={{textAlign:'center', backgroundColor:'#16426a', padding:'5px', color:'white', fontSize:'18px'}}>
                                        <b>INCIDENT INFORMATION</b>
                                    </div>

                                    <div style={{paddingBottom:'5px', fontSize:'1.1em', fontFamily:'monospace,monospace'}}>
                                        <Form.Group widths='2'>
                                            <Form.Field>
                                                <pre style={{marginBottom:'0px'}}>
                                                    <b>TYPE OF INCIDENT  : </b> 
                                                    <u>  {this.props.incidentType}  </u>
                                                </pre>
                                            </Form.Field>
                                            <Form.Field>
                                                <pre style={{marginBottom:'0px'}}>
                                                    <b>SETTLED DATE  : </b> 
                                                    <u>  {this.props.feedbackTimeSettled}  </u>
                                                </pre>
                                            </Form.Field>
                                        </Form.Group>
                                        <div style={{marginTop:'-13px', marginBottom:'0px'}}>
                                            <b>INCIDENT LOCATION : </b> 
                                            <u>&nbsp;&nbsp;{this.props.incidentLocation}&nbsp;&nbsp;</u>
                                        </div>  
                                        <pre style={{marginTop:'5px', marginBottom:'0px'}}>
                                            <b>DETAILED LOCATION : </b> 
                                            <u>  {this.props.feedbackLocation}  </u>
                                        </pre>
                                        <pre style={{marginBottom:'15px', marginTop:'5px'}}>
                                            <b>      COORDINATES : </b>
                                            {_.map(this.props.incidentCoordinates, (coordinates) => {
                                                console.log('inmapcoordinates', coordinates);
                                                return(
                                                    <u>  {coordinates}  </u>
                                                );
                                            })}
                                        </pre>

                                        <div style={{marginBottom:'15px', marginTop:'5px'}}>
                                            <b>INCIDENT DESCRIPTION</b> 
                                            <div style={{backgroundColor:'#94a7b9', padding:'30px'}}>
                                                {this.props.feedbackReport}
                                            </div>
                                        </div>
                                        
                                        <div style={{marginBottom:'5px', marginTop:'5px'}}>
                                            <b>ADDITIONAL</b> 
                                        </div>
                                        
                                        {this.props.incidentAdditionalResponders === ''?
                                            <pre style={{marginBottom:'5px', marginTop:'5px'}}>
                                                <b>    RESPONDERS : </b> <u>  No Additional Responders Requested  </u>
                                            </pre>
                                            :
                                            <pre style={{marginBottom:'15px', marginTop:'5px'}}>
                                                <b>    RESPONDERS</b> {
                                                    _.map(this.props.incidentAdditionalResponders, (additionalResponder) => {
                                                    return(
                                                        <div>
                                                            <div>
                                                                <b>      Name          : </b> <u>  {additionalResponder.name}  </u>
                                                            </div>
                                                            <div>
                                                                <b>      Time Received : </b> <u>  {additionalResponder.timeReceived}  </u>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </pre>
                                            }
                                            
                                        {this.props.incidentAdditionalVolunteers === ''?
                                            <pre style={{marginBottom:'5px', marginTop:'5px'}}>
                                                <b>    VOLUNTEERS : </b> <u>  No Additional Volunteers Requested   </u>
                                            </pre>
                                            :
                                            <pre style={{marginBottom:'15px', marginTop:'5px'}}>
                                                <b>    VOLUNTEERS</b> {
                                                    _.map(this.props.incidentAdditionalVolunteers, (additionalVolunteer) => {
                                                    return(
                                                        <div>
                                                            <div>
                                                                <b>      Name          : </b> <u>  {additionalVolunteer.name}  </u>
                                                            </div>
                                                            <div>
                                                                <b>      Time Received : </b> <u>  {additionalVolunteer.timeReceived}  </u>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </pre>
                                            }
                                    </div>

                                    <div>{this.displayImage()}</div>
                                
                                    <div style={{backgroundColor:'#16426a', padding:'15px'}}></div>       

                                </Form>
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
                
                
            </Table.Row>
        )
    }



}

export default ArchivesDispaly;