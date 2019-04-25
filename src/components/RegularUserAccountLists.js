import React, {Component} from 'react';
import { Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';

class RegularUserAccountLists extends Component{

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
                            <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini'/>
                                <Header.Content>Jane Cruz
                                    <Header.Subheader>janecruz@gmail.com</Header.Subheader>
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
                </Table.Body>

        </Table>  
        )
    }

}

export default RegularUserAccountLists