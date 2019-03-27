import {createUser} from '../actions/accountActions';
import fire from '../config/Fire';

export function createUserAccount (account){
    const email = account.email;
    const password = account.password;
    const isMobile = account.isMobile;
    const user_type = account.user_type;
    const auth = fire.auth();
    const promise = auth.createUserWithEmailAndPassword(email.trim(), password.trim());
    
    promise.then(user => {
      console.log('account created');
      createUser(account, user.user.uid);
      saveUserType(user_type, isMobile, user.user.uid);
    });
    promise.catch(e=>{
      var err = e.message;
      console.log(err);
    })
}

function saveUserType(user_type, isMobile, uid){
  const mobilePath = 'mobileUsers/';
  const webUsers = 'webUsers/';
  const adminPath = 'adminstrators';
  const ccpPath = 'ccPersonnel';
  const regularUserPath = 'regularUsers';
  const responderPath = 'responders';
  //const volunteerPath = '/volunteers';
  const coordinates = {
    lng: '',
    lat: ''
  }
  const db = fire.database();

  switch(isMobile){
    case false: switch(user_type){
                  case 'Administrator': 
                                        db.ref(webUsers+adminPath).push(uid);
                                        break;
                  case 'Command Center Personnel': 
                                        db.ref(webUsers+ccpPath).push(uid);
                                        break;
                  default: console.log(`Error: invalid web user type entered ${user_type}`);
                            break;                
              }
              break;
    case true: switch(user_type){
                  case 'Responder': 
                                    db.ref(mobilePath+responderPath).push({uid, coordinates});
                                    break;
                  case 'Regular User': 
                                    db.ref(mobilePath+regularUserPath).push({uid, coordinates});
                                    break;
                  //TODO: Add for volunteers
                  default: console.log(`Error: invalid mobile user type entered ${user_type}`);
              }
              break;
    default: console.log(`Error: invalid user type entered ${user_type}`);
              break;
  }

}