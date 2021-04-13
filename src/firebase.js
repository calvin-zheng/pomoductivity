import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBLkC_GOOI3tQMrRsvtJ4VIO7D4dxle5w",
    authDomain: "pomoductivity-aba20.firebaseapp.com",
    projectId: "pomoductivity-aba20",
    storageBucket: "pomoductivity-aba20.appspot.com",
    messagingSenderId: "774773296394",
    appId: "1:774773296394:web:37fd9dfcfc4f15a6d6fef3",
    measurementId: "G-RDLEKQBQJE"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
