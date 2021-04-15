import './App.css';
import Timer from './Timer.js';
import Stats from './stats.js'
import Groups from './components/Groups'
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
  import {Route, Link} from 'react-router-dom'
  import Nav from "./nav"


function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  if (isSignedIn) {
    return (
      <div className="App">
        <Nav />

        <Route
          path="/stats" 
          render={() => (
            <Stats user={user} />
          )}
        />
        <div style={{height: "600px",  width: "1200px", display: "flex"}}> <Kanban user = {user} signOut = {() => { firebase.auth().signOut(); setIsSignedIn(false); console.log("signed out");}} /> </div>
        <Timer user={user} />
        <Groups user={user}/>
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
    </FirebaseAuthProvider>
  );
}

export default App;
