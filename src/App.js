import React, { Component } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import fire from './config/Fire';
import withAuthProtection from "./components/WithAuthProtection";
import { BrowserRouter, Switch, Route,} from "react-router-dom";
import LoginAction from './components/LoginAction'

const ProtectedDashboard = withAuthProtection("/")(Dashboard);
const Wrapper = props =>(
  <div style={{maxWidth:400,padding:16,margin:"auto"}} {...props}/>
)
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: fire.auth().currentUser
    };
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

  render() {
    const { user } = this.state;

    return (
      <BrowserRouter>
      <Switch>
      <Route
          path="/"
          exact
          render={()=>(
            <div>
              <Login/>
              </div>
          )}/>
        <Route
          path="/LoginForm"
          exact
          render={({history})=>(
            <div>
              <LoginAction onSubmit={this.handleSignIn(history)}/>
              </div>
          )}/>
           <Route
            path="/Dashboard"
            exact
            render={props => (
              <div>
                <ProtectedDashboard {...props} user={user} />
              </div>
            )}/>
            </Switch>
            </BrowserRouter>
    );
  }
}

export default App;
