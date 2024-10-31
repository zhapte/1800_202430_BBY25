//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBF_dSkOi2ZkHU1NUjgQ7Ba89VSIlMKJl0",
    authDomain: "bby25-ed23e.firebaseapp.com",
    projectId: "bby25-ed23e",
    storageBucket: "bby25-ed23e.appspot.com",
    messagingSenderId: "675789470983",
    appId: "1:675789470983:web:64ec71f1f240db006199a2"
  };

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

