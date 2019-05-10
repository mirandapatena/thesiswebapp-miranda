import React, {Component} from 'react';
import { Table, Message, Icon } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class DeleteRegularUser extends Component{

    constructor(props){
        super(props);
        this.state = {
            regularUsersProfiles: [{}],
            regularUsers: [{}]
        }
    }

    componentDidMount(){
        //this.getRegularData();    
    }

    getRegularData = () => {
        var regularUserNode = fire.database().ref('mobileUsers/Regular User');
        var regularUsersProfiles;
        var regularUsers = [{}];
        var regObject = {};
        regularUserNode.once('value', snapshot => {
            regularUsersProfiles = snapshot.val();
            console.log('regularUsers', regularUsersProfiles);
            this.setState({regularUsersProfiles}, () => {
                console.log('regular user setstate', this.state.regularUsersProfiles);
                _.map(regularUsersProfiles, (regularUser, key) => {
                    console.log('regular key', key);
                    var profile = fire.database().ref(`users/${key}`);
                    profile.once('value', snapshot => {
                        regObject = snapshot.val();
                        regObject.uid = key;
                        regularUsers.push(regObject);
                        this.setState({regularUsers}, () => {
                            console.log('regularUser key', regObject);
                        });
                    });
                });
            });
        });
    }

    // renderRegularUsers = () => {
    //     return _.map(this.state.regularUsers, (regularUser, key) => {
    //         console.log('renderRegularUser1', regularUser.uid);
    //         return(
    //         <DeleteUserAccount uid={regularUser.uid} firstName={regularUser.firstName} lastName={regularUser.lastName} email={regularUser.email} contactNumber={regularUser.contactNumber} user_type='Regular User' />);
    //     });
    // }
    

    render(){
        return(
            <div>
                {this.state.regularUsers?
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Users</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {/*this.renderRegularUsers()*/}
                        </Table.Body>
                    </Table>
                :!this.state.regularUsers?
                    <Message info>
                        <Message.Header>
                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                <Icon name='user'/>No Regular User Accounts
                            </div>
                        </Message.Header>
                  </Message>
                :null
                } 
                
            </div>
        )
    }

}

export default DeleteRegularUser