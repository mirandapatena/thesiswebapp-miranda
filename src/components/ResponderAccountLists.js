import React, {Component} from 'react';
import { Table, Message, Icon } from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import fire from '../config/Fire';
import _ from 'lodash';
import VerifyUserAccount from './VerifyUserAccount';

class ResponderAccountLists extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            responders: [{}],
            respondersProfiles: [{}]
        }
    }

    componentDidMount(){
        var list = [];
        var tempObject = {};
        fire.database().ref('unverifiedMobileUsers').orderByChild('user_type').equalTo('Responder').on('value', snapshot => {
            this.setState({responders: snapshot.val()}, () => {
                console.log('unverified responders', this.state.responders);
                _.map(this.state.responders, (responder, key) => {
                    fire.database().ref(`users/${key}`).once('value', snapshot => {
                        tempObject = snapshot.val();
                        tempObject.key = snapshot.key;
                        list.push(tempObject);
                        this.setState({respondersProfiles: list}, ()=> {
                            console.log('Unverified Responders Profiles', this.state.respondersProfiles);
                        });
                    })
                })
            });
        });
    }

    renderUnverifiedResponders = () => {
        return _.map(this.state.respondersProfiles, (responder, key) => {
            console.log('asgdfgsdhfsd key', responder);
            console.log('asgdfgsdhfsd key2', this.state.respondersProfiles);
            return (<VerifyUserAccount firstName={responder.firstName} lastName={responder.lastName} contactNumber={responder.contactNumber} email={responder.email} uid={responder.key}/>)
        })
    }

    render(){
        return(
            <div>
                {this.state.responders?
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Users</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.renderUnverifiedResponders()}
                        </Table.Body>
                    </Table>
                :!this.state.responders?
                    <Message info>
                        <Message.Header>
                            <div style={{fontSize:'18px', textAlign:'center'}}>
                                <Icon name='user'/>No Unverified Responder Users
                            </div>
                        </Message.Header>
                  </Message>
                :null
                }
            </div>
        )
    }

}

export default ResponderAccountLists