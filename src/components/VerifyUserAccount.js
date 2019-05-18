import React, {Component} from 'react';
import { Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import fire from '../config/Fire';

class VerifyUserAccount extends Component{

    verifyUser = () => {
        console.log('vertu asd', this.props.uid);
        var isVerified = true;
        var deleteNode = fire.database().ref(`unverifiedMobileUsers/${this.props.uid}`);
        var userNode = fire.database().ref(`users/${this.props.uid}`);
        userNode.update({isVerified: true}).then(()=>{
            console.log(`${this.props.uid} account verified`);
            deleteNode.remove().then(()=>{
                console.log(`${this.props.uid} node in unverifiedMobileUsers node removed`);
            });
        })
    }

    render(){
        return(
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini'/>
                        <Header.Content>
                            {this.props.firstName} {this.props.lastName}
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>
                        <Header.Content>
                        {this.props.email}
                    </Header.Content>
                </Table.Cell>
                <Table.Cell>
                    <Header.Content>
                        {this.props.contactNumber}
                    </Header.Content>
                </Table.Cell>  
                <Table.Cell>
                    <Button color='green' onClick={this.verifyUser}>
                        Verify
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    }

}

export default VerifyUserAccount