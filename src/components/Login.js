import React, {Component} from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import CircularProgress from "@material-ui/core/CircularProgress"
import fire from '../config/Fire';
import '../Login.css';

class Login extends Component{
  constructor(props){
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      completed: 0,
      error:''
    }
  }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  login(e) {
    e.preventDefault();

    const auth = fire.auth();

    const promise = auth.signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    });

     promise.catch(e=>{
      var err = e.message;
      console.log(err);
      this.setState({err: err});

   });

   const { onClick } = this.props;
   const { email, password } = this.state;
   if (onClick) {
     this.setState({ submitting: true });
     onClick(email, password);
   }

   if (email ===''){
     this.setState({emailError: true});
     console.log("Blank email field");
   } else {
     this.setState({emailError: false});
   }

   if(password===''){
     this.setState({passwordError:true});
     console.log("Blank password field");
   }else{
     this.setState({passwordError:false});
   }
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
      <Segment stacked>
        <Header as='h2' color='red' textAlign='center'>
          Login
        </Header>
        
        <Form size='large' >

            <Form.Input 
              fluid icon='user' 
              iconPosition='left' 
              type='email'
              placeholder='E-mail address' 
              name='email' 
              value={this.state.email} 
              error={this.state.emailError}
              onChange={this.handleChange}/>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              name='password'
              value={this.state.password}
              error={this.state.passwordError}
              onChange={this.handleChange}
            />
            <Button inverted color= 'red' fluid size='large' onClick={this.login}>
              { this.state.passwordError || this.state.emailError ? "Login" :
                this.state.submitting ? (
                <CircularProgress classname={this.progress} style={{color: "#fff"}} color={"inherit"} size={16} variant="determinate" value={this.state.completed} />) :(
              "Login")}
            </Button>
            <p className='catchError'>{this.state.err}</p>
        </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  </div>
    );
  }
  
}

export default Login;