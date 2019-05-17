import React, {Component} from 'react';
import { Table, Message, Icon, Search } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class ManageVolunteer extends Component{
   
    constructor(props){
        super(props);
        this.state = {
            volunteerProfiles: [{}],
            volunteers: [{}]
        }
        
    }

    componentDidMount(){
        //this.getVolunteerData();
    }

    getVolunteerData = () => {
        var volunteerNode = fire.database().ref('mobileUsers/Volunteer');
        var volunteerProfiles;
        var volunteers = [];
        var volunteerObject = {};
        volunteerNode.once('value', snapshot => {
            volunteerProfiles = snapshot.val();
            console.log('volunteers', volunteerProfiles);
            this.setState({volunteerProfiles}, () => {
                console.log('volunteer setstate', this.state.volunteerProfiles);
                _.map(volunteerProfiles, (volunteer, key) => {
                    var profile = fire.database().ref(`users/${volunteer.uid}`);
                    profile.once('value', snapshot => {
                        volunteerObject = snapshot.val();
                        volunteerObject.uid = volunteer.uid;
                        volunteers.push(volunteerObject);
                        this.setState({volunteers}, () => {
                            console.log('volunteer key', volunteerObject);
                        });
                    });
                });
            });
        });
    }

    // renderVolunteers = () => {
    //     return _.map(this.state.volunteers, (volunteer, key) => {
    //         console.log('renderAdministrators1', volunteer.uid);
    //         return(
    //         <DeleteUserAccount uid={volunteer.uid} firstName={volunteer.firstName} lastName={volunteer.lastName} email={volunteer.email} contactNumber={volunteer.contactNumber} user_type='Volunteer' />);
    //     });
    // }

    render(){
        return(
            <div>
                {this.state.volunteers?
                    <Table celled>
                     <Table.Header>
                         <Table.Row>
                             <Table.HeaderCell colSpan='2'> Volunteers </Table.HeaderCell>
                             <Table.HeaderCell colSpan='2'><Search aligned='right' />  </Table.HeaderCell>
                         </Table.Row>
                         
                         <Table.Row>
                             <Table.HeaderCell style={{width:'350px'}}>Name</Table.HeaderCell>
                             <Table.HeaderCell style={{width:'300px'}}>Email</Table.HeaderCell>
                             <Table.HeaderCell>Contact Number</Table.HeaderCell>
                             <Table.HeaderCell>Status</Table.HeaderCell>
                         </Table.Row>
                     </Table.Header>
                     <Table.Body>
                            {/*this.renderVolunteers()*/}
                        </Table.Body>
                    </Table>
                :!this.state.volunteers?
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='2'> Volunteers </Table.HeaderCell>
                                <Table.HeaderCell colSpan='2'><Search aligned='right' />  </Table.HeaderCell>
                            </Table.Row>
                            
                            <Table.Row>
                                <Table.HeaderCell style={{width:'350px'}}>Name</Table.HeaderCell>
                                <Table.HeaderCell style={{width:'300px'}}>Email</Table.HeaderCell>
                                <Table.HeaderCell>Contact Number</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                            
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell colSpan='4' style={{paddingTop:'40px', paddingBottom:'40px'}}>
                                    <Message info>
                                        <Message.Header>
                                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                                <Icon name='user'/>No Volunteer Accounts
                                            </div>
                                        </Message.Header>
                                    </Message>
                                </Table.Cell>
                            </Table.Row>
                    </Table.Body>
                  </Table>
                :null
                }

            </div>
        )
    }

}

export default ManageVolunteer