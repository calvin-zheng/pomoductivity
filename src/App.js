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
    let profileStyle = {"display": "inline-block", "width": "50px", "height": "50px", "border-radius": "50%", "object-fit": "cover", "margin": "10px"};
    return (
      <div className="App text-white">
        <React.Fragment> Pomoductivity </React.Fragment>
        <img src={user.photoURL} style={profileStyle}/>
        <button className="mx-auto w-1/8 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded" onClick = {() => { firebase.auth().signOut(); setIsSignedIn(false);}}>Sign out</button>
        <Nav />
        <Route
          path="/stats"
          render={() => (
            <Stats user={user} />
          )}
        />
         <Route
          path="/kanban"
          render={() => (
            <Kanban user = {user}/>
          )}
        />
         <Route
          path="/timer"
          render={() => (
            <Timer user={user} />
            )}
        />
         <Route
          path="/groups"
          render={() => (
            <Groups user={user}/>
          )}
        />
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
