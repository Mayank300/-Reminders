import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBH-FgnrT4Dh6W3WRgqHWzrRoD0WIdbHO8",
  authDomain: "reminders-03.firebaseapp.com",
  projectId: "reminders-03",
  storageBucket: "reminders-03.appspot.com",
  messagingSenderId: "427368897117",
  appId: "1:427368897117:web:4e2247dc30d2d3f7220bb4",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
