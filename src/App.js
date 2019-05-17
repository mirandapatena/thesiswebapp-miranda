import React, { Component } from 'react';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardCCPersonnel from './components/DashboardCCPersonnel';
import LandingPage from './components/LandingPage';
import AdministratorRoute from './components/AdministratorRoute';
import CCPersonnelRoute from './components/CCPersonnelRoute';
import {connect} from 'react-redux';
import logUser from './actions/logUser';
import logUID from './actions/logUID';
import fire from './config/Fire';
import {Router, Route, browserHistory} from 'react-router';
import CreateNewAccount from './components/CreateNewAccount';
import Home from './components/Home';
import Profile from './components/Profile';
import UnverifiedResponders from './components/UnverifiedResponders';
import UnverifiedVolunteers from './components/UnverifiedVolunteers';
import UnverifiedRegularUsers from './components/UnverifiedRegularUsers';
import AccountsAdmin from './components/AccountsAdmin';
import AccountsCCP from './components/AccountsCCP';
import AccountsResponder from './components/AccountsResponder';
import AccountsVolunteer from './components/AccountsVolunteer';
import AccountsRegularUser from './components/AccountsRegularUser';

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
        browserHistory.replace('/');
      }
    });
  }

  getUserDetails = () => {
    let userAccount;
    console.log('getuserdetails', this.state.userID);
    fire.database().ref('users/'+this.state.userID).once("value", snapshot => {
      userAccount = snapshot.val();
      userAccount.uid = this.state.userID;
      this.setState({user_type: userAccount.user_type});
      this.setState({userAccount: userAccount});
      this.rerouteUserAccess();
      this.props.logUser(this.state.userAccount);
      this.props.logUID(this.state.userID);
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
        <CreateNewAccount exact path='/CreateNewAccount' component={CreateNewAccount} user_type={this.state.user_type} />
        <Home exact path='/Home' component={Home} user_type={this.state.user_type} />
        <Profile exact path='/Profile' component={Profile} user_type={this.state.user_type} />
        <UnverifiedResponders exact path='/UnverifiedResponders' component={UnverifiedResponders} user_type={this.state.user_type} />
        <UnverifiedVolunteers exact path='/UnverifiedVolunteers' component={UnverifiedVolunteers} user_type={this.state.user_type} />
        <UnverifiedRegularUsers exact path='/UnverifiedRegularUsers' component={UnverifiedRegularUsers} user_type={this.state.user_type} />
        <AccountsAdmin exact path='/AccountsAdmin' component={AccountsAdmin} user_type={this.state.user_type} />
        <AccountsCCP exact path='/AccountsCCP' component={AccountsCCP} user_type={this.state.user_type} />
        <AccountsResponder exact path='/AccountsResponder' component={AccountsResponder} user_type={this.state.user_type} />
        <AccountsVolunteer exact path='/AccountsVolunteer' component={AccountsVolunteer} user_type={this.state.user_type} />
        <AccountsRegularUser exact path='/AccountsRegularUser' component={AccountsRegularUser} user_type={this.state.user_type} />
      </Router>
    );
  }
}

function mapStateToProps(state, ownProps){
  return {
      user: state.user,
      uid: state.uid
  }
}

function mapDispatchToProps(dispatch){
  return{
    logUser: (userAccount) => dispatch(logUser(userAccount)),
    logUID: (uid) => dispatch(logUID(uid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);