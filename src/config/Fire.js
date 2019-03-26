import firebase from 'firebase';

  // Initialize Firebase
const config = {
  apiKey: "AIzaSyBgzYBdUhkg4o-015KSPN0BYX9YrctNdG0",
  authDomain: "emergencyresponsesystem-57dc4.firebaseapp.com",
  databaseURL: "https://emergencyresponsesystem-57dc4.firebaseio.com",
  projectId: "emergencyresponsesystem-57dc4",
  storageBucket: "emergencyresponsesystem-57dc4.appspot.com",
  messagingSenderId: "583480520859"

};
const fire = firebase.initializeApp(config);
export const auth = firebase.auth();
//create user session
export const userSession = (action, email, password) => auth[`${action}WithEmailAndPassword`](email, password);
//destroy current user session
export const logout = () => auth.signOut();
export default fire;