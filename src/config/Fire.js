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
// const firebaseRef = firebase.database().ref();
// const emergency = firebaseRef.child('emergencies');

// emergency.on('child_added', (snapshot) => {
//   console.log('child_added', snapshot.key, snapshot.val());
// });

// const addEmergency = emergency.push({
//   name: 'Keenan Mendiola',
//   location: 'Mandaue City',
//   type: 'Death'
// });


export default fire;