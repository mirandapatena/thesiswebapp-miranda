import React, {Component} from 'react';
import { Table, Message, Icon } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class DeleteAdmin extends Component{

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
            <DeleteUserAccount uid={administrator.uid} firstName={administrator.firstName} lastName={administrator.lastName} email={administrator.email} contactNumber={administrator.contactNumber} user_type='Administrator' />);
        });
    }

    render(){
        return(
            <div>
                 {this.state.administrators?
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Users</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.renderAdministrators()}
                        </Table.Body>
                    </Table>
                :!this.state.administrators?
                    <Message info>
                        <Message.Header>
                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                <Icon name='user'/>No Admin Accounts
                            </div>
                        </Message.Header>
                  </Message>
                :null
                }
            </div>
        )
    }

}

export default DeleteAdmin