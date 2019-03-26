import {createUser} from '../actions/accountActions';
import fire from '../config/Fire';

export function createUserAccount (account){
    const email = account.email;
    const password = account.password;
    const auth = fire.auth();
    const promise = auth.createUserWithEmailAndPassword(email.trim(), password.trim());

    promise.then(user => {
      console.log('account created');
      createUser(account, user.user.uid);
    });
    promise.catch(e=>{
      var err = e.message;
      console.log(err);
    })
}