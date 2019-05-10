import React, {Component} from 'react';
import { Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import fire from '../config/Fire';

class DeleteUserAccount extends Component{
    // constructor(){
    //     console.log('delete user account');
    // }

    // deleteUser = () => {
        
    // }

    deleteUser = () => {
        if(this.props.user_type === 'Administrator' || this.props.user_type === 'Command Center Personnel'){
            var webUserNode = fire.database().ref(`webUsers/${this.props.user_type}/${this.props.uid}`);
            var userNode = fire.database().ref(`users/${this.props.uid}`);
            webUserNode.remove().then(()=>{
                console.log(`${this.props.uid} removed from webUsers node`);
                userNode.remove().then(()=>{
                    console.log(`${this.props.uid} removed from users node`);
                });
            });

        }else if(this.props.user_type === 'Regular User' || this.props.user_type === 'Responder' || this.props.user_type === 'Volunteer'){
            var mobileUserNode = fire.database().ref(`webUsers/${this.props.user_type}/${this.props.uid}`);
            var userNode2 = fire.database().ref(`users/${this.props.uid}`);
            mobileUserNode.remove().then(()=>{
                console.log(`${this.props.uid} removed from mobileUsers node`);
                userNode2.remove().then(()=>{
                    console.log(`${this.props.uid} removed from users node`);
                });
            });
        }
    }
    
    render(){
        return(
                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini'/>
                                <Header.Content>{this.props.firstName} {this.props.lastName}
                                    <Header.Subheader>{this.props.email}</Header.Subheader>
                                    <Header.Subheader>{this.props.contactNumber}</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            <Button color='green' onClick={this.deleteUser}>
                                Delete
                            </Button>
                        </Table.Cell>
                    </Table.Row>
        )
    }

}

export default DeleteUserAccount