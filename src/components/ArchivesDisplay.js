import React, {Component} from 'react';
import { Button, Table, Header, Image, Modal, Icon} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import _ from 'lodash';

class ArchivesDispaly extends Component{

    

    render(){
        console.log('archive props', this.props);
        return(
            <Table.Row>
                <Table.Cell width='4'>
                    <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini' circular/>
                        <Header.Content>
                            {this.props.incidentKey}
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell width='3'>
                    <Header.Content>
                    {this.props.detailedLocation}
                    </Header.Content>
                </Table.Cell>
                <Table.Cell width='3'>
                    <Header.Content>
                        {this.props.timeReceived}
                    </Header.Content>
                </Table.Cell>
                {/* <Table.Cell width='3'>
                    <Header.Content>
                        original volunteer
                    </Header.Content>
                </Table.Cell> */}
                
                
            </Table.Row>
        )
    }



}

export default ArchivesDispaly;