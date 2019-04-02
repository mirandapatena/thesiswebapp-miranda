import React, { Component } from 'react';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardCCPersonnel from './components/DashboardCCPersonnel';
import LandingPage from './components/LandingPage';
import AdministratorRoute from './components/AdministratorRoute';
import CCPersonnelRoute from './components/CCPersonnelRoute';
import {connect} from 'react-redux';
import logUser from './actions/logUser';
import fire from './config/Fire';
import {Router, Route, browserHistory} from 'react-router';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {},
      userID: '',
      user_type: '',
      loggedUser: {},
      userAccount: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        user_type: '',
        isMobile: null,
        contactNumber: ''
      }
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
        browserHistory.replace('/login');
      }
    });
  }

  getUserDetails = () => {
    let userValues = null;
    fire.database().ref('users/'+this.state.userID).once("value", snapshot => {
      snapshot.forEach(child => {
        userValues = child.val();
        this.setState({user_type: userValues.user_type});
        this.setState({userAccount: userValues});
        var temp = this.state.userAccount;
        this.setState({user_type: temp.user_type});
      });
      this.rerouteUserAccess();
      this.props.logUser(this.state.userAccount);
    });
  }

  rerouteUserAccess = () => {
    switch(this.state.user_type){
      case 'Administrator': console.log('Adminstrator login');
                            browserHistory.push('/administrator');
                            //this.props.logUser();
                            break;
      case 'Command Center Personnel': 
                            console.log('CC Personnel Login');
                            browserHistory.push('/ccpersonnel');
                            break;
      default: browserHistory.push('/login');
              break;
    }
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route exact path='/' component={LandingPage}/>
        <Route exact path='/login' component={Login} />
        <AdministratorRoute exact path='/administrator' component={DashboardAdmin} user_type={this.state.user_type} />
        <CCPersonnelRoute exact path='/ccpersonnel' component={DashboardCCPersonnel} user_type={this.state.user_type} />
        </Router>
    );
  }
}

function mapStateToProps(state, ownProps){
  return {
      user: state.user
  }
}

function mapDispatchToProps(dispatch){
  return{
    logUser: (userAccount) => dispatch(logUser(userAccount))
  }
}
// <div className="App">
//       {this.state.user ? (<Dashboard/>) : (<Login/>)};
//       </div>
export default connect(mapStateToProps, mapDispatchToProps)(App);