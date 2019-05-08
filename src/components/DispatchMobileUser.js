import React, {Component} from 'react';
import { Image, Table, Header, Button} from 'semantic-ui-react';
import fire from '../config/Fire';
class DispatchMobileUser extends Component{

    constructor(props){
        super(props);
        this.state = {
            isButtonDisabled: false
        }
        var isAccepted = fire.database().ref(`mobileUsers/${this.props.user_type}/${this.props.id}/isAccepted`);
        console.log("sakto ni na user id?", this.props.id);
        var isACCEPTED;
        isAccepted.on('value', snapshot => {
            isACCEPTED = snapshot.val();

            console.log("hoy",isACCEPTED)     
            this.setState({isAccepted: isACCEPTED});
            console.log('isSETTLEDDD SHIT',isACCEPTED);

            if(isACCEPTED === true){
            this.setState({isButtonDisabled:true});
            console.log('pISTI KA LESTER',this.state.isButtonDisabled);
        }
        });
        
    }

    dispatchMobileUser = () => {
        var incidentID = this.props.incidentID;
        var user_type = this.props.user_type
        console.log(`user_type: ${user_type} uid: ${this.props.id}`);
        const dispatchRef = fire.database().ref(`mobileUsers/${user_type}/${this.props.id}`);
        dispatchRef.update({incidentID});
    }
    
    render(){
        return( 
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image><Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' rounded size='mini'/>
                        <Header.Content>
                            <p className='colorBlue'>{this.props.firstName} {this.props.lastName}</p>
                            <Header.Subheader></Header.Subheader>
                            <Header.Subheader><p className='colorRed'>{this.props.distance} m away</p></Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>
                    <Header>
                        <Header.Content>
                            <Header.Subheader><p className='colorBlue'><b>Email:</b> {this.props.email}</p></Header.Subheader>
                            <Header.Subheader><p className='colorBlue'><b>Contact Number:</b> {this.props.contactNumber}</p></Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>
                    <Button attached='bottom' color='red' onClick={this.dispatchMobileUser} disabled={this.state.isButtonDisabled}>
                        Dispatch
                    </Button>
                </Table.Cell>
            </Table.Row>
        );  
    }

}

   
export default DispatchMobileUser;