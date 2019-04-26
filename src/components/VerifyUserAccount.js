import React, {Component} from 'react';
import { Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import fire from '../config/Fire';

class VerifyUserAccount extends Component{

    // verifyUser = () => {
    //     console.log('vertu asd', this.props.uid);
    //     var isVerified = true;
    //     var userNode = fire.database().ref(`users/${this.props.uid}`);
    //     userNode.update({isVerified});
    // }
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
                            <Button compact animated='fade' color='green'>
                                <Button.Content visible>Unverified</Button.Content>
                                <Button.Content hidden>Verify</Button.Content>
                            </Button>
                        </Table.Cell>
                    </Table.Row>
        )
    }

}

export default VerifyUserAccount