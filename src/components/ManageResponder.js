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

    // componentDidMount(){
       
    // }

    getResponderData = () => {
        var responderNode = fire.database().ref('mobileUsers/Responder');
        var respondersProfiles;
        var responders = [];
        var responderObject = {};
        responderNode.once('value', snapshot => {
            respondersProfiles = snapshot.val();
            console.log('responders', respondersProfiles);
            this.setState({respondersProfiles}, () => {
                console.log('responder setstate', this.state.respondersProfiles);
                _.map(respondersProfiles, (responder, key) => {
                    var profile = fire.database().ref(`users/${responder.uid}`);
                    profile.once('value', snapshot => {
                        responderObject = snapshot.val();
                        responderObject.uid = responder.uid;
                        responders.push(responderObject);
                        this.setState({responders}, () => {
                            console.log('responder key', responderObject);
                        });
                    });
                });
            });
        });

    }

    // renderResponders = () => {
    //     return _.map(this.state.responders, (responder, key) => {
    //         console.log('renderResponder', responder.uid);
    //         return(
    //         <DeleteUserAccount uid={responder.uid} firstName={responder.firstName} lastName={responder.lastName} email={responder.email} contactNumber={responder.contactNumber} user_type='Responder' />);
    //     });
    // }

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
                             <Table.HeaderCell style={{width:'350px'}}>Name</Table.HeaderCell>
                             <Table.HeaderCell style={{width:'300px'}}>Email</Table.HeaderCell>
                             <Table.HeaderCell>Contact Number</Table.HeaderCell>
                             <Table.HeaderCell>Actions</Table.HeaderCell>
                         </Table.Row>
                     </Table.Header>
                     <Table.Body>
                            {/*this.renderResponders()*/}
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