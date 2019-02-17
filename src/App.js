import React, { Component } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import fire from './config/Fire';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {user: {}};
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

  render() {
    return (
      <div className="App">
      {this.state.user ? (<Dashboard/>) : (<Login/>)};
      </div>
    );
  }
}

export default App;
