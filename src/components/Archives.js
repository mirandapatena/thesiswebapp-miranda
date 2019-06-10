import VerticalMenu from './VerticalMenu';
import React, {Component} from 'react'
import { Button, Table, Search, Image, Modal, Form, Select, Icon} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import fire from '../config/Fire';
import _ from 'lodash';
import ArchivesDisplay from './ArchivesDisplay';

class Archives extends Component{

    constructor(props){
        super(props);
        this.state = {
            archives: [{}],
            archivesLists: [{}]
        }
        
    }

    componentDidMount(){
        this.getArchives();
    }

    getArchives = () =>{
        var list = [];
        const archives = fire.database().ref('Archives');
        archives.once('value', snapshot => {
            var archivesList = snapshot.val();
            console.log('archives', archivesList);
            _.map(archivesList, (archive, key) => {
                archive.incidentID = key;
                list.push(archive);
            });
            this.setState({archives: list}, () => {
                console.log('archiveslist', this.state.archives);
            });
        });

        
    }

    renderAchives = () => {
        return _.map(this.state.archives, (archive, key) => {
            console.log('renderAchives', archive.incidentKey);
            let additionalResponders, additionalVolunteer, detailedLocation, originalVolunteer, image_uri, incidentLocation;

            if(!archive.additionalResponders){
                additionalResponders = 'No Additional Responders Requested';
            }else{
                additionalResponders = archive.additionalResponders;
            }
            if(!archive.additionalVolunteer){
                additionalVolunteer = 'No Additional Volunteers Requested';
            }else{
                additionalVolunteer = archive.additionalVolunteer;
            }
            if(!archive.detailedLocation){
                detailedLocation = 'No detailed location given by reporter';
            }else{
                detailedLocation = archive.detailedLocation;
            }
            if(!archive.originalVolunteer){
                originalVolunteer = 'No Volunteer requested to respond'
            }else{
                originalVolunteer = archive.originalVolunteer;
            }
            if(!archive.image_uri){
                image_uri = 'No photo of incident uploaded by reporter'
            }else{
                image_uri = archive.image_uri
            }
            if(!archive.incidentLocation || archive.incidentLocation === ''){
                incidentLocation = 'Pinned location (See coordinates or Detailed Location)';
            }else{
                incidentLocation = archive.incidentLocation;
            }
            return(
            <ArchivesDisplay incidentKey={archive.incidentID} detailedLocation={archive.detailedLocation} incidentLocation={incidentLocation} timeReceived={archive.timeReceived} coordinates={archive.coordinates} image_uri={archive.image_uri} report={archive.report} additionalResponders={additionalResponders} additionalVolunteer={additionalVolunteer} detailedLocation={detailedLocation} originalVolunteer={originalVolunteer} image_uri={image_uri}/>);
        });
    }
    

    render(){
        return(
            <div>
                <div className="VerticalMenu">
                    <VerticalMenu/>
                </div>
                
                <div className="Archives">
                    
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell> Archives </Table.HeaderCell>
                                <Table.HeaderCell colSpan='2'><Search aligned='right' />  </Table.HeaderCell>
                            </Table.Row>
                            
                            <Table.Row>
                                <Table.HeaderCell>Incident ID</Table.HeaderCell>
                                <Table.HeaderCell>Incident Location</Table.HeaderCell>
                                <Table.HeaderCell>Time Received</Table.HeaderCell>
                            </Table.Row>

                        </Table.Header>
                            <Table.Body>
                                {this.renderAchives()}
                            </Table.Body>
                        </Table>

                    
                </div>
            </div>
        )
    }



}

export default Archives;