import React, {Component} from 'react';
import { Button, Table, Header, Image} from 'semantic-ui-react'
import '../stylesheet_QueueIncidents.css';
import '../HeaderDashboard.css';
import fire from '../config/Fire';
import _ from 'lodash';
import VerifyUserAccount from './VerifyUserAccount';

class VolunteerAccountLists extends Component{
    constructor(props){
        super(props);
        this.state = {
            volunteers: [{}],
            volunteersProfiles: [{}]
        }
    }

    componentDidMount(){
        var list = [];
        var tempObject = {};
        fire.database().ref('unverifiedMobileUsers').orderByChild('user_type').equalTo('Volunteer').on('value', snapshot => {
            this.setState({volunteers: snapshot.val()}, () => {
                console.log('unverified volunteers', this.state.volunteers);
                _.map(this.state.volunteers, (volunteer, key) => {
                    fire.database().ref(`users/${key}`).once('value', snapshot => {
                        tempObject = snapshot.val();
                        tempObject.key = snapshot.key;
                        list.push(tempObject);
                        this.setState({volunteersProfiles: list}, ()=> {
                            console.log('Unverified Regular Users Profiles', this.state.volunteersProfiles);
                        });
                    })
                })
            });
        });
    }

    renderUnverifiedVolunteers = () => {
        return _.map(this.state.volunteersProfiles, (volunteer, key) => {
            console.log('asgdfgsdhfsd key', volunteer);
            return (<VerifyUserAccount firstName={volunteer.firstName} lastName={volunteer.lastName} contactNumber={volunteer.contactNumber} email={volunteer.email} uid={volunteer.key}/>)
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
                    {this.renderUnverifiedVolunteers()}
                </Table.Body>

            </Table>  
        )
    }

}

export default VolunteerAccountLists