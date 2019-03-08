//import PropTypes from 'prop-types'
import React, { Component } from 'react'
import '../stylesheet_QueueIncidents.css';
import '../Login.css';
import { Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import fire from '../config/Fire';
import CircularProgress from "@material-ui/core/CircularProgress"
//import { BrowserRouter, Switch, Route, Link, history } from "react-router-dom";


class LoginAction extends Component{
    constructor(props){
      super(props);
      this.login = this.login.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        email: '',
        password: '',
        submitting: false
      }
    }
   
  
    componentDidMount(){
      this.authListener();
    }
  
    authListener() {
      fire.auth().onAuthStateChanged((user) => {
        //console.log(user);
        if (user) {
          this.setState({ user });
          //localStorage.setItem('user', user.uid);
        } else {
          this.setState({ user: null });
          //localStorage.removeItem('user');
        }
      });
    }
  
    handleSignIn = history => (email, password) =>{
      console.log('as')
      return fire.auth().signInWithEmailAndPassword(email, password).then (()=>{
        return history.push("/Dashboard");
      })
    }
    handleSubmit = e => {
      e.preventDefault();
      const { onSubmit } = this.props;
      const { email, password } = this.state;
      if (onSubmit) {
        this.setState({ submitting: true });
        onSubmit(email, password);
      }
    };
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
          
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
            <Header as='h2' textAlign='center' style={{color: 'white'}}>
              Personnel Login   
            </Header>
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
              <Button color= 'teal' fluid size='large' onSubmit={this.login}>
              {this.state.submitting ? (
                
                <CircularProgress style={{color: "#fff"}} color={"inherit"} size={16} />
              
        
            
              ) :(
              "Login")}
              </Button>
            </Segment>
          </Form>
          
        </Grid.Column>
      </Grid>
      
    </div>
      );
    }
    
  }

  export default LoginAction