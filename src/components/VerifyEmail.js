import VerticalMenu from './VerticalMenu';
import React, {Component} from 'react'
import '../stylesheet_QueueIncidents.css';
import '../Home.css';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import fire from '../config/Fire';
import swal from 'sweetalert';

class verifyEmail extends Component{

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
          
            emailVerified:'',
            email: '',
          
        }
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value});
      }

    componentDidMount(){
        var user = fire.auth().currentUser;
        console.log('userProfile',user);
        var emailVerified, email;
        if (user != null){
            emailVerified = user.emailVerified;
            email = user.email;
            console.log('isEmailVerified: ',emailVerified);
            this.setState({emailVerified: emailVerified, email: email});
            console.log('My Email: ', email);
        }
    }

    verifyEmail = () =>{    
        var user = fire.auth().currentUser;
        user.sendEmailVerification().then(function() {
            // Email sent.
            swal("Email sent!", {
                icon: "success",
                });
            }).catch(e=> {
            // An error happened.
            var err = e.message;
                console.log(err);
                this.setState({err: err});
            });
            
        }
    
    render(){
        let unverifed;

        if(this.state.emailVerified === false){
            unverifed = <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
      
            <Segment stacked style={{marginTop:'20px'}}>
                <Header as='h2' color='red' textAlign='center'>
                    Verify your email address
                </Header>
                <div style={{marginBottom:'30px'}}>
                    <p>
                        To finish setting up this Tabang account, we just need to make sure that
                        this email address is yours.
                    </p>
                </div>
                
                {/* <Form size='large' >
                    <div style={{marginTop:'30px',marginBottom:'20px'}}>
                        <Form.Input
                        icon='mail' 
                        iconPosition='left' 
                        value={this.state.email} 
                        />
                    </div> */}
                    <div className="space"></div>
                    
                    <Button inverted color= 'red' fluid size='large' onClick={this.verifyEmail}>
                        Verify {this.state.email}
                    </Button>
                    
                    <p className='catchError'>{this.state.err}</p>
                  
              
              {/* </Form> */}
              </Segment>
            </Grid.Column>
          </Grid>
        }
        return(
            <div>
                <div className="VerticalMenu">
                    <VerticalMenu/>
                </div>
                
                <div className="Homepage">
                    {/* <h1>WELCOME MADAFAKKER!</h1> */}
                    <div className="HomepageMessage">
                        {unverifed}
                    </div>
                </div>
            </div>
        )
    }



}

export default verifyEmail;