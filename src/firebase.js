import firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
    apiKey: "AIzaSyCJiq2UKJWPUH54mclNmzOu686Sbr1N2Io",
    authDomain: "school-fcbce.firebaseapp.com",
    projectId: "school-fcbce",
    storageBucket: "school-fcbce.appspot.com",
    messagingSenderId: "425577837285",
    appId: "1:425577837285:web:300d3263f90491051cda0c"
});

export const auth = app.auth();
export default app;