import React, {Component} from 'react';
import { Table, Message, Icon } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class DeleteCCP extends Component{

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
            <DeleteUserAccount uid={ccp.uid} firstName={ccp.firstName} lastName={ccp.lastName} email={ccp.email} contactNumber={ccp.contactNumber} user_type='Command Center Personnel' />);
        });
    }

    render(){
        return(
            <div>
                 {this.state.admins?
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Users</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.renderCCP()}
                        </Table.Body>
                    </Table>
                :!this.state.admins?
                    <Message info>
                        <Message.Header>
                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                <Icon name='user'/>No Command Center Accounts
                            </div>
                        </Message.Header>
                  </Message>
                :null
                }
            </div>
        )
    }

}

export default DeleteCCP