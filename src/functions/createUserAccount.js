import {createUser} from '../actions/accountActions';
import fire from '../config/Fire';

export function createUserAccount (account){
    const email = account.email;
    const password = account.password;
    const auth = fire.auth();
    const promise = auth.createUserWithEmailAndPassword(email.trim(), toString(password.trim));

    promise.then(user => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        createUser(account, user.uid);
      });
      unsubscribe();
    });
    promise.catch(e=>{
      var err = e.message;
      console.log(err);
    })
}