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
  import {Route, Redirect} from 'react-router-dom'
  import Nav from "./nav"


function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);

  if (isSignedIn) {
    let profileStyle = {"display": "inline-block", "width": "50px", "height": "50px", "border-radius": "50%", "object-fit": "cover", "margin": "10px"};
    return (
      <div className="App text-white">
        <div className="flex justify-end items-center">
          <img src={user.photoURL} style={profileStyle}/>
          <button className="mx-2 w-1/8 h-1/2 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded" onClick = {() => { firebase.auth().signOut(); setIsSignedIn(false);}}>Sign out</button>
          <p style={{
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, 0%)"
          }} className = "text-white font-extrabold text-5xl p-5">Pomoductivity</p>
        </div>
        <Nav />
        <Route exact path="/">
            <Redirect to="/kanban" />
        </Route>
        <Route
          path="/stats" 
          render={() => (
            <Stats user={user} />
          )}
        />
         <Route
          path="/kanban" 
          render={() => (
            <div style={{height: "600px",  width: "1200px", display: "flex"}}> <Kanban user = {user}/> </div>
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
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-center">
          <p className = "text-white font-extrabold text-5xl p-5">Pomoductivity</p>
          <button className="w-1/8 bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded"
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider);
            }}
          >
          Sign In with Google
        </button>
        </div>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            setUser(user);
            return (
              <React.Fragment></React.Fragment>
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
