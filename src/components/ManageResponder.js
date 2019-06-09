import React, {Component} from 'react';
import { Table, Message, Icon, Search } from 'semantic-ui-react'
import fire from '../config/Fire';
import _ from 'lodash';
import DeleteUserAccount from './DeleteUserAccount';

class ManageResponder extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            responders: [{}],
            respondersProfiles: [{}]
        }
    }

    componentDidMount(){
        fire.database().ref('users').orderByChild('user_type').equalTo('Responder').once('value', snapshot => {
            this.setState({responders: snapshot.val()}, () => {
                console.log('manage regular', this.state.responders);
            });
        });    
    }

    renderResponders = () => {
        return _.map(this.state.responders, (responder, key) => {
            return(
            <DeleteUserAccount uid={responder.uid} firstName={responder.firstName} lastName={responder.lastName} email={responder.email} contactNumber={responder.contactNumber} user_type='Responder' key={key}/>);
        });
    }

    render(){
        return(
            <div>
                {this.state.responders?
                     <Table celled>
                     <Table.Header>
                         <Table.Row>
                             <Table.HeaderCell colSpan='2'> Responders </Table.HeaderCell>
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
                            {this.renderResponders()}
                        </Table.Body>
                    </Table>
                :!this.state.responders?
                    <Message info>
                        <Message.Header>
                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                <Icon name='user'/>No Responder Accounts
                            </div>
                        </Message.Header>
                  </Message>
                :null
                } 
                
            </div>
        )
    }

}

export default ManageResponder