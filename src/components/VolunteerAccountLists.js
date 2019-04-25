import React, {Component} from 'react';
import { Icon, Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';

class VolunteerAccountLists extends Component{

    render(){
        return(
            <Table celled>

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Users</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini' />
                                <Header.Content>Lany Doe
                                    <Header.Subheader>lany@gmail.com</Header.Subheader>
                                    <Header.Subheader>0999234212</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            <Icon name='checkmark' /><b>Verified</b>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>

            </Table>  
        )
    }

}

export default VolunteerAccountLists