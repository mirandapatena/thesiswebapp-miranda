import React, { Component } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import fire from './config/Fire';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      userID: '',
      user_type: '',
      loggedUser: {},
    };
  }

  componentDidMount(){
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user, userID: user.uid });
        this.getUserDetails();
      } else {
        this.setState({ user: null });
      }
    });
  }

  getUserDetails = () => {
    fire.database().ref('/users').child(this.state.userID).once("value", snapshot => {
      this.setState({loggedUser: snapshot.val()});
    });
    var loggedUser = this.state.loggedUser;
    var key = loggedUser;
    console.log('key', key);
    console.log('loggedUser', this.state.loggedUser);
  }
  render() {
    return (
      <div className="App">
      {this.state.user ? (<Dashboard/>) : (<Login/>)};
      </div>
    );
  }
}

export default App;
