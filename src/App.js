import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: ' ',
    email: ' ',
    photo: ' '
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    //console.log('sign in clicked');

    firebase.auth().signInWithPopup(provider)
      .then(res => {
        console.log(res);
        const { displayName, photoURL, email } = res.user;
        const SignedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(SignedInUser);
        console.log(displayName, email, photoURL);

      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    //console.log("sign out clicked");
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          password: '',
          error: '',
          isValid: false,
          returningUser: false
        }
        setUser(signedOutUser);
      })
      .catch(err => {

      })

  }

  const is_valid_email = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  const hasNumber = input => /\d/.test(input);
  const signInOption = event => {
    const createdUser = { ...user };
    createdUser.returningUser = event.target.checked;
    setUser(createdUser);
    console.log(event.target.checked);

  }

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    //debugger;
    //perform validation  
    let isValid = true;
    if (e.target.name === 'email') {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }
    //console.log(e.target.name);

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    //console.log(newUserInfo);
    setUser(newUserInfo);
  }

  const createAccount = (event) => {

    if (user.isValid) {
      console.log(user.email, user.password);
      //console.log(user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          //var errorCode = error.code;
          //var errorMessage = error.message;
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    //else {
      //console.log("form is not valid", user);
    //}

    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if (user.isValid) {
      //console.log(user.email, user.password);
      //console.log(user.password);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createdUser = { ...user };
          createdUser.isSignedIn = true;
          createdUser.error = '';
          setUser(createdUser);
        })
        .catch(err => {
          console.log(err.message);
          //var errorCode = error.code;
          //var errorMessage = error.message;
          const createdUser = { ...user };
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
        })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}> Sign out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p> Welcome, {user.name}</p>
          <p> Your email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }
      <h1>OWN AUTHENTICATION</h1>
      <input type="checkbox" name="signInOption" onChange={signInOption} id="signInOption" />
      <label htmlFor="signInOption"> Returning User</label>

      <form style={{display: user.returningUser ? 'block' : 'none'}} onSubmit={signInUser}>
       
        
        <input type="text" onBlur={handleChange} name="email" placeholder=" Your email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required />
        <br />
        <input type="submit" value="Sign In" />
      </form>

      <form style={{display: user.returningUser ? 'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder=" Your name" required />
        <br />
        <input type="text" onBlur={handleChange} name="email" placeholder=" Your email" required />
        <br />
        <input type="password" onBlur={handleChange} name="password" placeholder="Enter your password" required />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }
    </div>

  );
}

export default App;
