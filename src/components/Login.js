import React, {Component} from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import fire from '../config/Fire';

class Login extends Component{
  constructor(props){
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  login(e) {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.password).then((u)=>{
    }).catch((error) => {
        console.log(error);
      });
    console.log('Login');
  }

  render(){
    return(
      <div className='login-form'>
    <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Login
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' name='email' value={this.state.email} onChange={this.handleChange}/>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
            />

            <Button color='teal' fluid size='large' onClick={this.login}>
              Login
            </Button>
          </Segment>
        </Form>

      </Grid.Column>
    </Grid>
  </div>
    );
  }
  
}

export default Login;