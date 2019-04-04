import fire, {fire2} from '../config/Fire';
import _ from 'lodash';

export function createUserAccount (account, credentials = {}){
    const email = account.email;
    const password = account.password;
    const isMobile = account.isMobile;
    const user_type = account.user_type;
    const auth = fire2.auth();
    const promise = auth.createUserWithEmailAndPassword(email.trim(), password.trim());
    
    promise.then(user => {
      let app = fire.database().ref('users/'+user.user.uid);
      app.update(account);
      if(!_.isEmpty(credentials)){
        saveUserType(user_type, isMobile, user.user.uid, credentials);
      }else{
        saveUserType(user_type, isMobile, user.user.uid);
      }
      return 'Success'
    });
    promise.catch(e=>{
      var err = e.message;
      console.log(err);
      return err;
    });
}

function saveUserType(user_type, isMobile, uid, credentials = {}){
  const mobileUsers = 'mobileUsers/';
  const webUsers = 'webUsers/';
  const coordinates = {
    lng: '',
    lat: ''
  }
  const credentialID = uid;
  const db = fire.database();

  switch(isMobile){
    case false: switch(user_type){
                  case 'Administrator': 
                                        db.ref(`${webUsers}/${user_type}/${uid}`).update({uid});
                                        break;
                  case 'Command Center Personnel': 
                                        db.ref(`${webUsers}/${user_type}/${uid}`).update({uid});
                                        break;
                  default: console.log(`Error: invalid web user type entered ${user_type}`);
                            break;                
              }
              break;
    case true: switch(user_type){
                  case 'Responder': 
                                    db.ref(`${mobileUsers}/${user_type}/${uid}`).update({uid, coordinates});
                                    break;
                  case 'Regular User': 
                                    db.ref(`${mobileUsers}/${user_type}/${uid}`).update({uid, coordinates});
                                    break;
                  case 'Volunteer': db.ref(`${mobileUsers}/${user_type}/${uid}`).update({uid, coordinates});
                                    db.ref(`credentials/${credentialID}`).update(credentials);
                                    break;

                  default: console.log(`Error: invalid mobile user type entered ${user_type}`);
              }
              break;
    default: console.log(`Error: invalid user type entered ${user_type}`);
              break;
  }
}

//TODO: compute points for volunteer credentials
