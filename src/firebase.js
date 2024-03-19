import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBnmCpnUv0XLJFpG25yE9-C3hmsurFd7ms",
    authDomain: "finalssofteng.firebaseapp.com",
    projectId: "finalssofteng",
    storageBucket: "finalssofteng.appspot.com",
    messagingSenderId: "789005820786",
    appId: "1:789005820786:web:6867b8c4b10c559a9833eb",
    measurementId: "G-YVS3WKF4XT"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();
