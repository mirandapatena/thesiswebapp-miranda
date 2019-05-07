import React, {Component} from 'react';
import { Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import fire from '../config/Fire';
import _ from 'lodash';
import VerifyUserAccount from './VerifyUserAccount';

class RegularUserAccountLists extends Component{
    constructor(props){
        super(props);
        this.state = {
            regularUsers: [{}],
            regularUsersProfiles: [{}]
        }
    }

    componentDidMount(){
        var list = [];
        var tempObject = {};
        fire.database().ref('unverifiedMobileUsers').orderByChild('user_type').equalTo('Regular User').on('value', snapshot => {
            this.setState({regularUsers: snapshot.val()}, () => {
                console.log('unverified regular users', this.state.regularUsers);
                _.map(this.state.regularUsers, (regularUser, key) => {
                    fire.database().ref(`users/${key}`).once('value', snapshot => {
                        tempObject = snapshot.val();
                        tempObject.key = snapshot.key;
                        list.push(tempObject);
                        this.setState({regularUsersProfiles: list}, ()=> {
                            console.log('Unverified Regular Users Profiles', this.state.regularUsersProfiles);
                        });
                    })
                });
                
            });
        });
    }

    renderUnverifiedRegularUsers = () => {
        return _.map(this.state.regularUsersProfiles, (regularUser, key) => {
            console.log('asgdfgsdhfsd key', regularUser);
            return (<VerifyUserAccount firstName={regularUser.firstName} lastName={regularUser.lastName} contactNumber={regularUser.contactNumber} email={regularUser.email} uid={regularUser.key}/>)
        })
    }
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
                    {this.renderUnverifiedRegularUsers()}
                </Table.Body>

        </Table>  
        )
    }

}

export default RegularUserAccountLists