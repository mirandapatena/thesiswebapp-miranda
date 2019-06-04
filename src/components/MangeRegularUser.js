import React, {Component} from 'react';
import { Table, Message, Icon, Search } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class ManageRegularUser extends Component{

    constructor(props){
        super(props);
        this.state = {
            regularUsersProfiles: [{}],
            regularUsers: [{}]
        }
    }

    componentDidMount(){
        fire.database().ref('users').orderByChild('user_type').equalTo('Regular User').once('value', snapshot => {
            this.setState({regularUsers: snapshot.val()}, () => {
                console.log('manage regular', this.state.regularUsers);
            });
        });    
    }


    renderRegularUsers = () => {
        return _.map(this.state.regularUsers, (regularUser, key) => {
            return(
            <DeleteUserAccount uid={regularUser.uid} firstName={regularUser.firstName} lastName={regularUser.lastName} email={regularUser.email} contactNumber={regularUser.contactNumber} user_type='Regular User' key={key}/>);
        });
    }
    

    render(){
        return(
            <div>
                {this.state.regularUsers?
                    <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'> Regular Users </Table.HeaderCell>
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
                            {this.renderRegularUsers()} 
                        </Table.Body>
                    </Table>
                :!this.state.regularUsers?
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'> Regular Users </Table.HeaderCell>
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
                                            <Icon name='user'/>No Regular User Accounts
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

export default ManageRegularUser