import './App.css';
<<<<<<< HEAD
import Timer from './Timer.js';
import Stats from './stats.js'
=======
import React, { useState } from 'react';
import Kanban from './components/Kanban';
import firebase from 'firebase/app'
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";
  import { config } from "./config.js";
>>>>>>> kanban

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  if (isSignedIn) {
    return (
      <div className="App">
        <div style={{height: "600px",  width: "1200px", display: "flex"}}> <Kanban user = {user} signOut = {() => { firebase.auth().signOut(); setIsSignedIn(false); console.log("signed out");}} /> </div>
      </div>
    );
  }
  
  return (
    <FirebaseAuthProvider {...config} firebase={firebase}>
      <div>
        <button
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(googleAuthProvider);
          }}
        >
          Sign In with Google
        </button>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            setUser(user);
            return (
              <pre style={{ height: 300, overflow: "auto" }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre>
            );  
          }}
        </FirebaseAuthConsumer>
        <div>
          <IfFirebaseAuthedAnd
            filter={({ providerId }) => providerId !== "anonymous"}
          >
            {({ providerId }) => {
              setIsSignedIn(true);
            }}
          </IfFirebaseAuthedAnd>
        </div>
      </div>
      <Timer/>
      <Stats/>
    </FirebaseAuthProvider>
  );
}

export default App;
