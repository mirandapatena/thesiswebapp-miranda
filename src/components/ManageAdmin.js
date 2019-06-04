import React, {Component} from 'react';
import { Table, Message, Icon, Search } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class ManageAdmin extends Component{

    constructor(props){
        super(props);
        this.state = {
            admins: [{}],
            adminsProfiles: [{}],
            administrators: [{}]
        }
        
    }

    componentDidMount(){
        this.getAdministratorData();
    }

    // renderAdmins = () => {
       
    // }
    getAdministratorData = () => {
        var adminNode = fire.database().ref('webUsers/Administrator');
        var adminsProfiles;
        var administrators = [];
        var adminObject = {};
        adminNode.once('value', snapshot => {
            adminsProfiles = snapshot.val();
            console.log('administrators', adminsProfiles);
            this.setState({adminsProfiles}, () => {
                console.log('admin setstate', this.state.adminsProfiles);
                _.map(adminsProfiles, (admin, key) => {
                    var profile = fire.database().ref(`users/${admin.uid}`);
                    profile.once('value', snapshot => {
                        adminObject = snapshot.val();
                        adminObject.uid = admin.uid;
                        administrators.push(adminObject);
                        this.setState({administrators}, () => {
                            console.log('administrator key', adminObject);
                        });
                    });
                });
            });
        });
    }

    renderAdministrators = () => {
        return _.map(this.state.administrators, (administrator, key) => {
            console.log('renderAdministrators1', administrator.uid);
            return(
            <DeleteUserAccount uid={administrator.uid} firstName={administrator.firstName} lastName={administrator.lastName} email={administrator.email} contactNumber={administrator.contactNumber} user_type='Administrator' key={administrator.uid}/>);
        });
    }

    render(){
        return(
            <div>
                 {this.state.administrators?
                    <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'> Administrators </Table.HeaderCell>
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
                            {this.renderAdministrators()}
                        </Table.Body>
                    </Table>
                :!this.state.administrators?
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'> Administrators </Table.HeaderCell>
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
                                            <Icon name='user'/>No Admin Accounts
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

export default ManageAdmin