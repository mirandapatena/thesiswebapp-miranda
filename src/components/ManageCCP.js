import React, {Component} from 'react';
import { Table, Message, Icon, Search } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class ManageCCP extends Component{

    constructor(props){
        super(props);
        this.state = {
            admins: [{}],
            ccpProfiles: [{}],
            commandCenterPersonnel: [{}]
        }
        
    }

    componentDidMount(){
        this.getCCPData();
    }

    // renderAdmins = () => {
       
    // }
    getCCPData = () => {
        var ccpNode = fire.database().ref('webUsers/Command Center Personnel');
        var ccpProfiles;
        var commandCenterPersonnel = [{}];
        var ccpObject = {};
        ccpNode.once('value', snapshot => {
            ccpProfiles = snapshot.val();
            console.log('ccpProfiles', ccpProfiles);
            this.setState({ccpProfiles}, () => {
                console.log('ccpProfiles', this.state.ccpProfiles);
                _.map(ccpProfiles, (ccp, key) => {
                    var profile = fire.database().ref(`users/${ccp.uid}`);
                    profile.once('value', snapshot => {
                        ccpObject = snapshot.val();
                        ccpObject.uid = ccp.uid;
                        commandCenterPersonnel.push(ccpObject);
                        this.setState({commandCenterPersonnel}, () => {
                            console.log('commandCenterPersonnel', ccpObject);
                        });
                    });
                });
            });
        });
    }

    renderCCP = () => {
        return _.map(this.state.commandCenterPersonnel, (ccp, key) => {
            console.log('ccp1', ccp.uid);
            return(
            <DeleteUserAccount uid={ccp.uid} firstName={ccp.firstName} lastName={ccp.lastName} email={ccp.email} contactNumber={ccp.contactNumber} user_type='Command Center Personnel' key={ccp.uid}/>);
        });
    }

    render(){
        return(
            <div>
                 {this.state.admins?
                    <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'> Command Center Personnels </Table.HeaderCell>
                            <Table.HeaderCell colSpan='2'><Search aligned='right' />  </Table.HeaderCell>
                        </Table.Row>
                        
                        <Table.Row>
                            <Table.HeaderCell width='3'>Name</Table.HeaderCell>
                            <Table.HeaderCell width='3'>Email</Table.HeaderCell>
                            <Table.HeaderCell>Contact Number</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                            {this.renderCCP()}
                        </Table.Body>
                    </Table>
                :!this.state.admins?
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'> Command Center Personnels </Table.HeaderCell>
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
                                            <Icon name='user'/>No Command Center Personnel Accounts
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

export default ManageCCP